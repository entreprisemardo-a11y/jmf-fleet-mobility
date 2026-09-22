import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole, requirePermission, AuthenticatedRequest } from '../middleware/auth.js';
import { hashPassword } from '../utils/password.js';
import { RoleId } from '../db/types.js';

export const usersRouter = Router();

/**
 * List users (Super Admin sees all, Company Admin sees only their company)
 */
usersRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const database = db.getDb();
    let users = database.users || [];

    if (user.role_id === 'SUPER_ADMIN_JMF') {
      const { company_id } = req.query;
      if (company_id && typeof company_id === 'string') {
        users = users.filter(u => u.company_id === company_id);
      }
    } else if (user.role_id === 'COMPANY_ADMIN' || user.role_id === 'FLEET_MANAGER') {
      users = users.filter(u => u.company_id === user.company_id);
    } else {
      // Regular user or client can only see their own profile
      users = users.filter(u => u.id === user.id);
    }

    // Filters
    const { role, status, search } = req.query;
    if (role && typeof role === 'string' && role !== 'ALL') {
      users = users.filter(u => u.role_id === role);
    }
    if (status && typeof status === 'string' && status !== 'ALL') {
      const isActive = status === 'ACTIVE';
      users = users.filter(u => u.is_active === isActive);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      users = users.filter(
        u =>
          u.first_name.toLowerCase().includes(q) ||
          u.last_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q))
      );
    }

    // Attach role and company name for quick display
    const sanitized = users.map(u => {
      const comp = database.companies.find(c => c.id === u.company_id);
      const roleObj = database.roles.find(r => r.id === u.role_id);
      return {
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        phone: u.phone || '+229 01 00 00 00',
        role: u.role_id,
        role_label: roleObj ? roleObj.name : u.role_id,
        company_id: u.company_id,
        company_name: comp ? comp.name : 'JMF Global (Non affilié)',
        site_id: u.site_id,
        is_active: u.is_active,
        avatar_url: u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        created_at: u.created_at,
        updated_at: u.updated_at,
      };
    });

    return res.json({
      success: true,
      count: sanitized.length,
      data: sanitized,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

/**
 * Get comprehensive user sheet with all 7 tabs data
 */
usersRouter.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const caller = req.user!;
    const database = db.getDb();
    const targetUser = database.users.find(u => u.id === req.params.id);

    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Access control: caller must be Super Admin or Company Admin in same company, or self
    if (caller.role_id !== 'SUPER_ADMIN_JMF') {
      if (caller.role_id === 'COMPANY_ADMIN' && targetUser.company_id !== caller.company_id) {
        return res.status(403).json({ error: 'Accès interdit aux utilisateurs d’autres entreprises' });
      }
      if (caller.role_id !== 'COMPANY_ADMIN' && targetUser.id !== caller.id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }

    const company = database.companies.find(c => c.id === targetUser.company_id) || null;
    const site = targetUser.site_id ? database.sites.find(s => s.id === targetUser.site_id) : null;
    const roleObj = database.roles.find(r => r.id === targetUser.role_id) || null;

    // 1. Associated Vehicles
    // If user is a driver or customer, find vehicles linked to their company or assigned
    const driver = database.drivers.find(d => d.user_id === targetUser.id || d.email === targetUser.email);
    let associatedVehicles: any[] = [];
    if (driver) {
      const assignments = database.vehicle_assignments.filter(a => a.driver_id === driver.id && !a.end_at);
      const vehicleIds = assignments.map(a => a.vehicle_id);
      associatedVehicles = database.vehicles.filter(v => vehicleIds.includes(v.id));
    }
    if (associatedVehicles.length === 0 && targetUser.company_id) {
      associatedVehicles = database.vehicles.filter(v => v.company_id === targetUser.company_id).slice(0, 5);
    }

    // 2. Associated Invoices
    const associatedInvoices = database.invoices.filter(
      inv => inv.user_id === targetUser.id || (targetUser.company_id && inv.company_id === targetUser.company_id)
    );

    // 3. Associated Convoy Requests
    const associatedConvoys = database.convoy_requests.filter(
      r => r.user_id === targetUser.id || r.client_email.toLowerCase() === targetUser.email.toLowerCase()
    );

    // 4. Associated Documents
    const associatedDocs = database.documents.filter(
      d => (targetUser.company_id && d.company_id === targetUser.company_id) || (driver && d.driver_id === driver.id)
    );

    // 5. Role and Permissions
    const rolePermissions = database.role_permissions
      .filter(rp => rp.role_id === targetUser.role_id)
      .map(rp => database.permissions.find(p => p.id === rp.permission_id))
      .filter(Boolean);

    // 6. Audit & History
    const userAuditLogs = database.activity_logs.filter(
      act => act.user_id === targetUser.id || act.entity_id === targetUser.id
    );

    const userInfo = {
      id: targetUser.id,
      first_name: targetUser.first_name,
      last_name: targetUser.last_name,
      email: targetUser.email,
      phone: targetUser.phone || '+229 01 00 00 00',
      company_name: company ? company.name : 'JMF Mobility Services',
      site_name: site ? site.name : 'Cotonou - Akpakpa',
      role: targetUser.role_id,
      role_label: roleObj?.name || targetUser.role_id,
      is_active: targetUser.is_active,
      avatar_url: targetUser.avatar_url,
      created_at: targetUser.created_at,
      last_login: new Date().toISOString(),
    };

    return res.json({
      success: true,
      data: {
        id: targetUser.id,
        first_name: targetUser.first_name,
        last_name: targetUser.last_name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role_id,
        role_label: roleObj?.name || targetUser.role_id,
        company,
        site,
        is_active: targetUser.is_active,
        avatar_url: targetUser.avatar_url,
        created_at: targetUser.created_at,
        updated_at: targetUser.updated_at,
        vehicles: associatedVehicles,
        invoices: associatedInvoices,
        convoys: associatedConvoys,
        documents: associatedDocs,
        permissions: rolePermissions,
        history: userAuditLogs,
        user: userInfo,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user detail:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération de la fiche utilisateur' });
  }
});

/**
 * Create user (Super Admin or Company Admin)
 */
usersRouter.post('/', authenticate, requirePermission('settings.manage'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const caller = req.user!;
    const { first_name, last_name, email, phone, role, company_id, site_id, password } = req.body;

    if (!first_name || !last_name || !email || !role) {
      return res.status(400).json({ error: 'Prénom, nom, email et rôle sont obligatoires' });
    }

    const database = db.getDb();
    if (database.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Un utilisateur avec cette adresse email existe déjà' });
    }

    // Company Admin restriction: can only create inside their own company and cannot create SUPER_ADMIN_JMF
    let targetCompanyId = company_id;
    if (caller.role_id !== 'SUPER_ADMIN_JMF') {
      targetCompanyId = caller.company_id;
      if (role === 'SUPER_ADMIN_JMF') {
        return res.status(403).json({ error: 'Vous ne pouvez pas attribuer le rôle Super Admin' });
      }
    }

    const newUserId = db.generateId('usr');
    const now = new Date().toISOString();
    const newUser = {
      id: newUserId,
      company_id: targetCompanyId || null,
      site_id: site_id || undefined,
      first_name: String(first_name).trim(),
      last_name: String(last_name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '+229 01 00 00 00',
      password_hash: hashPassword(password || 'jmf2026'),
      role_id: role as RoleId,
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    database.users.unshift(newUser);
    await db.save();

    db.logActivity({
      company_id: targetCompanyId || null,
      user_id: caller.id,
      entity_type: 'user',
      entity_id: newUser.id,
      action: 'Création compte utilisateur',
      description: `Utilisateur ${newUser.first_name} ${newUser.last_name} (${newUser.email}) créé avec le rôle ${newUser.role_id}`,
    });

    return res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: newUser,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de l’utilisateur' });
  }
});

/**
 * Update user details, role, status (active/suspended)
 */
usersRouter.patch('/:id', authenticate, requirePermission('settings.manage'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const caller = req.user!;
    const database = db.getDb();
    const targetUser = database.users.find(u => u.id === req.params.id);

    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Role check
    if (caller.role_id !== 'SUPER_ADMIN_JMF') {
      if (targetUser.company_id !== caller.company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
      if (req.body.role === 'SUPER_ADMIN_JMF') {
        return res.status(403).json({ error: 'Interdit d’attribuer le rôle Super Admin' });
      }
    }

    const { first_name, last_name, phone, role, is_active, site_id, company_id } = req.body;
    const now = new Date().toISOString();
    const changes: { field: string; old_value: any; new_value: any }[] = [];
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '197.234.221.14';

    let isRoleChange = false;
    let previousRole = targetUser.role_id;

    if (first_name !== undefined && first_name !== targetUser.first_name) {
      changes.push({ field: 'first_name', old_value: targetUser.first_name, new_value: String(first_name).trim() });
      targetUser.first_name = String(first_name).trim();
    }
    if (last_name !== undefined && last_name !== targetUser.last_name) {
      changes.push({ field: 'last_name', old_value: targetUser.last_name, new_value: String(last_name).trim() });
      targetUser.last_name = String(last_name).trim();
    }
    if (phone !== undefined && phone !== targetUser.phone) {
      changes.push({ field: 'phone', old_value: targetUser.phone, new_value: String(phone).trim() });
      targetUser.phone = String(phone).trim();
    }
    if (role !== undefined && role !== targetUser.role_id) {
      isRoleChange = true;
      changes.push({ field: 'role_id', old_value: targetUser.role_id, new_value: role });
      targetUser.role_id = role as RoleId;
    }
    if (is_active !== undefined && is_active !== targetUser.is_active) {
      changes.push({ field: 'is_active', old_value: targetUser.is_active, new_value: Boolean(is_active) });
      targetUser.is_active = Boolean(is_active);
    }
    if (site_id !== undefined && site_id !== targetUser.site_id) {
      changes.push({ field: 'site_id', old_value: targetUser.site_id, new_value: site_id });
      targetUser.site_id = site_id;
    }
    if (company_id !== undefined && caller.role_id === 'SUPER_ADMIN_JMF' && company_id !== targetUser.company_id) {
      changes.push({ field: 'company_id', old_value: targetUser.company_id, new_value: company_id });
      targetUser.company_id = company_id;
    }

    targetUser.updated_at = now;
    await db.save();

    if (isRoleChange) {
      db.logActivity({
        company_id: targetUser.company_id,
        user_id: caller.id,
        entity_type: 'user',
        entity_id: targetUser.id,
        action: 'Modification de rôle administrateur',
        description: `Privilèges modifiés : Le rôle de ${targetUser.first_name} ${targetUser.last_name} (${targetUser.email}) a été changé de ${previousRole} à ${targetUser.role_id}`,
        severity: 'critical',
        compliance_tag: 'ROLE_CHANGE',
        ip_address: clientIp,
        changes,
        metadata: {
          target_user_id: targetUser.id,
          target_email: targetUser.email,
          previous_role: previousRole,
          new_role: targetUser.role_id,
          initiated_by: caller.email,
        },
      });
    } else {
      db.logActivity({
        company_id: targetUser.company_id,
        user_id: caller.id,
        entity_type: 'user',
        entity_id: targetUser.id,
        action: 'Modification compte utilisateur',
        description: `Mise à jour du profil et autorisations de ${targetUser.first_name} ${targetUser.last_name}`,
        severity: changes.some(c => c.field === 'is_active') ? 'warning' : 'info',
        compliance_tag: changes.some(c => c.field === 'is_active') ? 'ACCOUNT_STATUS' : 'USER_UPDATE',
        ip_address: clientIp,
        changes,
        metadata: {
          target_user_id: targetUser.id,
          target_email: targetUser.email,
        },
      });
    }

    return res.json({
      success: true,
      message: 'Compte utilisateur mis à jour avec succès',
      data: targetUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

/**
 * Secure password reset: Never reveals existing password, dispatches reset email
 */
usersRouter.post('/:id/reset-password', authenticate, requirePermission('settings.manage'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const caller = req.user!;
    const database = db.getDb();
    const targetUser = database.users.find(u => u.id === req.params.id);

    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Set a randomized secure temporary pass
    const tempPassword = `JMF-${Math.random().toString(36).slice(-8)}!`;
    targetUser.password_hash = hashPassword(tempPassword);
    targetUser.updated_at = new Date().toISOString();
    await db.save();

    // Log the event in email logs and audit
    const emlId = db.generateId('eml');
    database.email_logs.unshift({
      id: emlId,
      to: targetUser.email,
      recipient_name: `${targetUser.first_name} ${targetUser.last_name}`,
      subject: 'Réinitialisation sécurisée de votre mot de passe JMF Mobility Services',
      body: `Bonjour ${targetUser.first_name},\n\nVotre mot de passe a été réinitialisé par un administrateur.\nVotre mot de passe temporaire est : ${tempPassword}\nNous vous invitons à vous connecter et à le changer dès votre première session.\n\nCordialement,\nÉquipe JMF Mobility Services`,
      type: 'PASSWORD_RESET',
      status: 'sent',
      retry_count: 0,
      created_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
    });

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '197.234.221.14';
    db.logActivity({
      company_id: targetUser.company_id,
      user_id: caller.id,
      entity_type: 'security',
      entity_id: targetUser.id,
      action: 'Réinitialisation de mot de passe administrateur',
      description: `Mot de passe réinitialisé de manière sécurisée pour ${targetUser.first_name} ${targetUser.last_name} (${targetUser.email})`,
      severity: 'warning',
      compliance_tag: 'PASSWORD_RESET',
      ip_address: clientIp,
      metadata: {
        target_user_id: targetUser.id,
        target_email: targetUser.email,
        initiated_by: caller.email,
      },
    });

    return res.json({
      success: true,
      message: `Un email avec les instructions sécurisées de réinitialisation a été envoyé à ${targetUser.email}`,
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
  }
});
