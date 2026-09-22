import { Router, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { hashPassword } from '../db/seeds.js';
import { authenticate, createPersonalAccessToken, AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

// Demo accounts endpoint for easy evaluation and role switching
authRouter.get('/demo-accounts', (req, res) => {
  const database = db.getDb();
  const demoUsers = database.users.map(u => {
    const company = u.company_id ? database.companies.find(c => c.id === u.company_id) : null;
    return {
      id: u.id,
      email: u.email,
      name: `${u.first_name} ${u.last_name}`,
      role: u.role_id,
      company: company ? company.name : 'JMF Mobility Services (Global)',
      company_id: u.company_id,
      avatar: u.avatar_url,
    };
  });
  res.json({ users: demoUsers });
});

// Login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: 'Adresse email et mot de passe requis.' });
    return;
  }

  const database = db.getDb();
  const user = database.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !user.is_active) {
    res.status(401).json({ error: 'Identifiants invalides ou compte désactivé.' });
    return;
  }

  const hashedPassword = hashPassword(password);
  if (user.password_hash !== hashedPassword) {
    res.status(401).json({ error: 'Identifiants invalides.' });
    return;
  }

  // Update user last login
  user.last_login_at = new Date().toISOString();
  db.save();

  // Create personal access token (Sanctum)
  const { token } = createPersonalAccessToken(user.id, 'web_session');

  const company = user.company_id
    ? database.companies.find(c => c.id === user.company_id) || null
    : null;

  const permissions = database.role_permissions
    .filter(rp => rp.role_id === user.role_id)
    .map(rp => rp.permission_id);

  // Accessible companies (Super Admin can switch to any company)
  const accessibleCompanies = user.role_id === 'SUPER_ADMIN_JMF'
    ? database.companies
    : (company ? [company] : []);

  res.json({
    message: 'Connexion réussie',
    token,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role_id,
      avatar_url: user.avatar_url,
      company_id: user.company_id,
    },
    company,
    accessible_companies: accessibleCompanies,
    permissions,
  });
});

// Registration (S'enregistrer / Créer un compte)
authRouter.post('/register', (req, res) => {
  const { first_name, last_name, email, password, phone, company_name, role, fleet_size } = req.body;

  if (!first_name || !last_name || !email || !password) {
    res.status(422).json({ error: 'Prénom, nom, e-mail et mot de passe sont obligatoires.' });
    return;
  }

  const database = db.getDb();
  const existingUser = database.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existingUser) {
    res.status(409).json({ error: 'Un compte avec cette adresse e-mail existe déjà.' });
    return;
  }

  let companyId: string | null = null;
  let newCompany: any = null;
  if (company_name && company_name.trim()) {
    companyId = `comp_${Date.now()}`;
    newCompany = {
      id: companyId,
      name: company_name.trim(),
      legal_name: company_name.trim(),
      country: 'Bénin',
      currency: 'XOF',
      timezone: 'Africa/Porto-Novo',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    database.companies.push(newCompany);
  }

  const userId = `usr_${Date.now()}`;
  const userRole = role || 'COMPANY_ADMIN';
  const newUser: any = {
    id: userId,
    email: email.toLowerCase().trim(),
    password_hash: hashPassword(password),
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    phone: phone?.trim() || '+229 01 00 00 00',
    role_id: userRole,
    company_id: companyId,
    avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256`,
    is_active: true,
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  };

  database.users.push(newUser);
  db.save();

  const { token } = createPersonalAccessToken(userId, 'web_session');

  const permissions = database.role_permissions
    .filter(rp => rp.role_id === userRole)
    .map(rp => rp.permission_id);

  res.status(201).json({
    message: 'Compte créé avec succès',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone: newUser.phone,
      role: newUser.role_id,
      avatar_url: newUser.avatar_url,
      company_id: newUser.company_id,
    },
    company: newCompany,
    accessible_companies: newCompany ? [newCompany] : [],
    permissions,
  });
});

// Get Current Authenticated User (Me)
authRouter.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const database = db.getDb();
  const user = req.user!;
  const company = req.company;

  const accessibleCompanies = req.isSuperAdmin
    ? database.companies
    : (company ? [company] : []);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role_id,
      avatar_url: user.avatar_url,
      company_id: user.company_id,
    },
    company,
    accessible_companies: accessibleCompanies,
    permissions: req.permissions,
    is_super_admin: req.isSuperAdmin,
  });
});

// Logout (Revoke Token)
authRouter.post('/logout', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const plainToken = authHeader.substring(7).trim();
    const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');

    const database = db.getDb();
    database.personal_access_tokens = database.personal_access_tokens.filter(
      t => t.token_hash !== tokenHash
    );
    db.save();
  }

  res.json({ message: 'Déconnexion réussie. Jeton révoqué.' });
});

// Switch active company (for Super Admin)
authRouter.post('/switch-company', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { company_id } = req.body;

  if (!company_id) {
    res.status(422).json({ error: 'Identifiant d’entreprise requis.' });
    return;
  }

  const database = db.getDb();
  const targetCompany = database.companies.find(c => c.id === company_id);

  if (!targetCompany) {
    res.status(404).json({ error: 'Entreprise introuvable.' });
    return;
  }

  // Only Super Admin or authorized users can switch
  if (!req.isSuperAdmin && req.user!.company_id !== company_id) {
    res.status(403).json({ error: 'Vous n’êtes pas autorisé à accéder à cette entreprise.' });
    return;
  }

  res.json({
    message: 'Entreprise active mise à jour',
    company: targetCompany,
  });
});
