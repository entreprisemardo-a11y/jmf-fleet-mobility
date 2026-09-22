import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole, requirePermission, AuthenticatedRequest } from '../middleware/auth.js';
import { emailService } from '../services/email.service.js';
import { ConvoyRequest, ConvoyStatus } from '../db/types.js';
import { hashPassword } from '../utils/password.js';

export const convoyRouter = Router();

/**
 * Public Endpoint: Submit new convoy request (no auth required)
 */
convoyRouter.post('/public', async (req: Request, res: Response) => {
  try {
    const {
      _hp, // Honeypot field (must be blank)
      vehicle_brand,
      vehicle_model,
      vehicle_year,
      vehicle_plate,
      is_registered = true,
      vehicle_color,
      vehicle_condition = 'good',
      condition_details,
      requires_flatbed = false,
      pickup_address,
      pickup_city,
      pickup_country,
      delivery_address,
      delivery_city,
      delivery_country,
      desired_date,
      desired_time,
      convoy_type = 'individual',
      convoy_mode = 'driver',
      access_instructions,
      client_name,
      client_company,
      client_email,
      client_phone,
      client_country,
      special_instructions,
      privacy_accepted,
    } = req.body;

    // 1. Anti-bot honeypot check
    if (_hp) {
      return res.status(400).json({ error: 'Validation bot failed' });
    }

    // 2. Strict input validation
    if (!vehicle_brand || !vehicle_model || !vehicle_year) {
      return res.status(400).json({ error: 'Les informations du véhicule (marque, modèle, année) sont obligatoires' });
    }
    if (!pickup_address || !pickup_city || !pickup_country) {
      return res.status(400).json({ error: 'L’adresse, la ville et le pays de prise en charge sont obligatoires' });
    }
    if (!delivery_address || !delivery_city || !delivery_country) {
      return res.status(400).json({ error: 'L’adresse, la ville et le pays de livraison sont obligatoires' });
    }
    if (!desired_date || !desired_time) {
      return res.status(400).json({ error: 'La date et l’heure souhaitées sont obligatoires' });
    }
    if (!client_name || !client_email || !client_phone || !client_country) {
      return res.status(400).json({ error: 'Les informations du demandeur (nom, email, téléphone, pays) sont obligatoires' });
    }
    if (!privacy_accepted) {
      return res.status(400).json({ error: 'Vous devez accepter la politique de confidentialité pour soumettre la demande' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(client_email)) {
      return res.status(400).json({ error: 'Format d’adresse email invalide' });
    }

    // 3. Generate unique reference and ID
    const reference = db.generateConvoyReference();
    const id = db.generateId('conv');
    const now = new Date().toISOString();

    // Check if client email matches an existing user or company
    const database = db.getDb();
    const matchedUser = database.users.find(u => u.email.toLowerCase() === client_email.toLowerCase());
    const matchedCompanyId = matchedUser?.company_id || null;

    const newRequest: ConvoyRequest = {
      id,
      reference,
      company_id: matchedCompanyId,
      user_id: matchedUser ? matchedUser.id : null,
      status: 'NEW',

      vehicle_brand: String(vehicle_brand).trim(),
      vehicle_model: String(vehicle_model).trim(),
      vehicle_year: Number(vehicle_year),
      vehicle_plate: vehicle_plate ? String(vehicle_plate).trim() : undefined,
      is_registered: Boolean(is_registered),
      vehicle_color: String(vehicle_color).trim(),
      vehicle_condition: vehicle_condition as any,
      condition_details: condition_details ? String(condition_details).trim() : undefined,
      requires_flatbed: Boolean(requires_flatbed) || vehicle_condition === 'non_running' || vehicle_condition === 'breakdown',

      pickup_address: String(pickup_address).trim(),
      pickup_city: String(pickup_city).trim(),
      pickup_country: String(pickup_country).trim(),
      delivery_address: String(delivery_address).trim(),
      delivery_city: String(delivery_city).trim(),
      delivery_country: String(delivery_country).trim(),
      desired_date: String(desired_date).trim(),
      desired_time: String(desired_time).trim(),
      convoy_type: convoy_type as any,
      convoy_mode: convoy_mode as any,
      access_instructions: access_instructions ? String(access_instructions).trim() : undefined,

      client_name: String(client_name).trim(),
      client_company: client_company ? String(client_company).trim() : undefined,
      client_email: String(client_email).trim().toLowerCase(),
      client_phone: String(client_phone).trim(),
      client_country: String(client_country).trim(),

      special_instructions: special_instructions ? String(special_instructions).trim() : undefined,
      privacy_accepted: true,

      internal_notes: 'Demande créée depuis le formulaire public',
      timeline: [
        {
          id: db.generateId('tl'),
          status: 'NEW',
          label: 'Nouvelle demande de convoyage reçue',
          note: 'Soumission en ligne validée par le système',
          author: 'Système JMF',
          created_at: now,
        },
      ],

      created_at: now,
      updated_at: now,
    };

    database.convoy_requests.unshift(newRequest);
    await db.save();

    // 4. Log audit activity
    db.logActivity({
      company_id: matchedCompanyId,
      user_id: matchedUser?.id,
      entity_type: 'convoy_request',
      entity_id: newRequest.id,
      action: 'Demande de convoyage soumise',
      description: `Nouvelle demande de convoyage réf ${newRequest.reference} soumise par ${newRequest.client_name}`,
      metadata: { reference: newRequest.reference, vehicle: `${newRequest.vehicle_brand} ${newRequest.vehicle_model}` },
    });

    // 5. Send automated confirmation emails (Client & Internal Team)
    await emailService.sendConvoyClientConfirmation(newRequest);
    await emailService.sendConvoyAdminNotification(newRequest);

    return res.status(201).json({
      success: true,
      message: 'Votre demande de convoyage a été enregistrée avec succès',
      reference: newRequest.reference,
      request: newRequest,
    });
  } catch (error: any) {
    console.error('Error submitting convoy request:', error);
    return res.status(500).json({ error: 'Une erreur est survenue lors du traitement de votre demande' });
  }
});

/**
 * Authenticated: List convoy requests
 */
convoyRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const database = db.getDb();
    let requests = database.convoy_requests || [];

    // Role-based filtering
    if (user.role_id === 'SUPER_ADMIN_JMF') {
      // Super admin sees all
    } else if (user.role_id === 'COMPANY_ADMIN' || user.role_id === 'FLEET_MANAGER') {
      // Company admin sees requests for their company or matched client email domain
      requests = requests.filter(r => r.company_id === user.company_id || r.client_email.endsWith(user.email.split('@')[1]));
    } else if (user.role_id === 'CLIENT') {
      // Customer sees strictly their own requests
      requests = requests.filter(r => r.user_id === user.id || r.client_email.toLowerCase() === user.email.toLowerCase());
    } else if (user.role_id === 'DRIVER') {
      // Driver sees missions assigned to them
      const driver = database.drivers.find(d => d.user_id === user.id);
      if (driver) {
        requests = requests.filter(r => r.assigned_driver_id === driver.id);
      } else {
        requests = [];
      }
    } else {
      requests = [];
    }

    // Optional query filters
    const { status, search } = req.query;
    if (status && typeof status === 'string' && status !== 'ALL') {
      requests = requests.filter(r => r.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      requests = requests.filter(
        r =>
          r.reference.toLowerCase().includes(q) ||
          r.client_name.toLowerCase().includes(q) ||
          r.client_email.toLowerCase().includes(q) ||
          r.client_phone.includes(q) ||
          `${r.vehicle_brand} ${r.vehicle_model}`.toLowerCase().includes(q) ||
          (r.vehicle_plate && r.vehicle_plate.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error: any) {
    console.error('Error fetching convoy requests:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des demandes de convoyage' });
  }
});

/**
 * Authenticated: Get single convoy request
 */
convoyRouter.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const database = db.getDb();
    const request = database.convoy_requests.find(r => r.id === req.params.id || r.reference === req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Demande de convoyage introuvable' });
    }

    // Access control
    if (user.role_id !== 'SUPER_ADMIN_JMF') {
      if (user.role_id === 'CLIENT' && request.user_id !== user.id && request.client_email.toLowerCase() !== user.email.toLowerCase()) {
        return res.status(403).json({ error: 'Accès non autorisé à cette demande' });
      }
      if (user.role_id === 'COMPANY_ADMIN' && request.company_id && request.company_id !== user.company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }

    // Fetch linked driver info if assigned
    let assignedDriver = null;
    if (request.assigned_driver_id) {
      assignedDriver = database.drivers.find(d => d.id === request.assigned_driver_id) || null;
    }

    // Fetch linked invoice if any
    let linkedInvoice = null;
    if (request.invoice_id) {
      linkedInvoice = database.invoices.find(i => i.id === request.invoice_id) || null;
    }

    return res.json({
      success: true,
      data: {
        ...request,
        assigned_driver: assignedDriver,
        linked_invoice: linkedInvoice,
      },
    });
  } catch (error: any) {
    console.error('Error fetching convoy detail:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du détail' });
  }
});

/**
 * Authenticated: Update convoy request (Status, assignment, notes, quote)
 */
convoyRouter.patch('/:id', authenticate, requirePermission('convoy.manage'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const database = db.getDb();
    const request = database.convoy_requests.find(r => r.id === req.params.id || r.reference === req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Demande de convoyage introuvable' });
    }

    const {
      status,
      internal_notes,
      assigned_driver_id,
      quote_amount,
      invoice_id,
      timeline_note,
    } = req.body;

    const oldStatus = request.status;
    const now = new Date().toISOString();

    if (status && status !== oldStatus) {
      request.status = status as ConvoyStatus;
      const statusLabels: Record<ConvoyStatus, string> = {
        NEW: 'Nouvelle demande',
        ANALYZING: 'En cours d’analyse',
        QUOTE_SENT: 'Devis envoyé',
        ACCEPTED: 'Devis accepté',
        PLANNED: 'Mission planifiée',
        IN_PROGRESS: 'Mission en cours',
        COMPLETED: 'Convoyage terminé avec succès',
        REJECTED: 'Demande refusée',
        CANCELLED: 'Demande annulée',
      };

      request.timeline.push({
        id: db.generateId('tl'),
        status: status as ConvoyStatus,
        label: statusLabels[status as ConvoyStatus] || status,
        note: timeline_note || `Statut mis à jour par ${user.first_name} ${user.last_name}`,
        author: `${user.first_name} ${user.last_name}`,
        created_at: now,
      });
    }

    if (internal_notes !== undefined) {
      request.internal_notes = internal_notes;
    }
    if (assigned_driver_id !== undefined) {
      request.assigned_driver_id = assigned_driver_id;
    }
    if (quote_amount !== undefined) {
      request.quote_amount = Number(quote_amount);
    }
    if (invoice_id !== undefined) {
      request.invoice_id = invoice_id;
    }

    request.updated_at = now;
    await db.save();

    db.logActivity({
      company_id: request.company_id,
      user_id: user.id,
      entity_type: 'convoy_request',
      entity_id: request.id,
      action: 'Mise à jour convoyage',
      description: `Demande de convoyage ${request.reference} mise à jour (Statut: ${request.status})`,
    });

    return res.json({
      success: true,
      message: 'Demande de convoyage mise à jour avec succès',
      data: request,
    });
  } catch (error: any) {
    console.error('Error updating convoy request:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

/**
 * Authenticated: Link convoy request to client account or create user
 */
convoyRouter.post('/:id/link-client', authenticate, requirePermission('convoy.manage'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const database = db.getDb();
    const request = database.convoy_requests.find(r => r.id === req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Demande de convoyage introuvable' });
    }

    const { user_id, create_new_user, company_id } = req.body;

    if (user_id) {
      // Link to existing user
      const existingUser = database.users.find(u => u.id === user_id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
      request.user_id = existingUser.id;
      request.company_id = existingUser.company_id || company_id || request.company_id;
    } else if (create_new_user) {
      // Create user with CLIENT role
      const [first_name, ...lastParts] = request.client_name.split(' ');
      const last_name = lastParts.join(' ') || first_name;
      const newUserId = db.generateId('usr');
      const now = new Date().toISOString();

      const createdUser = {
        id: newUserId,
        company_id: company_id || 'comp_jmf_client_001',
        first_name,
        last_name,
        email: request.client_email,
        password_hash: hashPassword('jmf2026'),
        phone: request.client_phone,
        role_id: 'CLIENT' as const,
        is_active: true,
        created_at: now,
        updated_at: now,
      };

      database.users.push(createdUser);
      request.user_id = createdUser.id;
      request.company_id = createdUser.company_id;
    }

    request.updated_at = new Date().toISOString();
    await db.save();

    db.logActivity({
      company_id: request.company_id,
      user_id: user.id,
      entity_type: 'convoy_request',
      entity_id: request.id,
      action: 'Liaison compte client',
      description: `Demande de convoyage ${request.reference} rattachée au compte ${request.user_id}`,
    });

    return res.json({
      success: true,
      message: 'Demande rattachée au compte client avec succès',
      data: request,
    });
  } catch (error: any) {
    console.error('Error linking client:', error);
    return res.status(500).json({ error: 'Erreur lors de la liaison' });
  }
});
