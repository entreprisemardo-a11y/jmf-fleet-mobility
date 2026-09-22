import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, AuthenticatedRequest, requirePermission } from '../middleware/auth.js';

export const companiesRouter = Router();

// List companies (Super Admin sees all, Company User sees only their company)
companiesRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const database = db.getDb();
  const companies = db.scopeByCompany(
    database.companies.map(c => ({ ...c, company_id: c.id })),
    req.user!.company_id,
    req.isSuperAdmin || false
  );

  res.json({ data: companies });
});

// Get Company by ID
companiesRouter.get('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const companyId = req.params.id;

  // Multi-tenant check
  if (!req.isSuperAdmin && req.user!.company_id !== companyId) {
    res.status(403).json({ error: 'Accès interdit aux données de cette entreprise.' });
    return;
  }

  const database = db.getDb();
  const company = database.companies.find(c => c.id === companyId);

  if (!company) {
    res.status(404).json({ error: 'Entreprise introuvable.' });
    return;
  }

  const sites = database.sites.filter(s => s.company_id === companyId);
  const departments = database.departments.filter(d => d.company_id === companyId);
  const costCenters = database.cost_centers.filter(cc => cc.company_id === companyId);

  res.json({
    data: {
      ...company,
      sites,
      departments,
      cost_centers: costCenters,
    },
  });
});

// Create Company (Super Admin only)
companiesRouter.post('/', authenticate, requirePermission('companies.manage'), (req: AuthenticatedRequest, res: Response) => {
  const { name, legal_name, registration_number, tax_number, email, phone, address, city, country, currency } = req.body;

  if (!name) {
    res.status(422).json({ error: 'Le nom de l’entreprise est requis.' });
    return;
  }

  const database = db.getDb();
  const newCompanyId = db.generateId('comp');
  const now = new Date().toISOString();

  const newCompany = {
    id: newCompanyId,
    name,
    legal_name: legal_name || name,
    registration_number: registration_number || '',
    tax_number: tax_number || '',
    email: email || '',
    phone: phone || '',
    address: address || '',
    city: city || 'Cotonou',
    country: country || 'Bénin',
    currency: currency || 'FCFA',
    timezone: 'Africa/Porto-Novo',
    logo_url: undefined,
    is_active: true,
    created_at: now,
    updated_at: now,
  };

  database.companies.push(newCompany);

  // Add default headquarters site
  database.sites.push({
    id: db.generateId('site'),
    company_id: newCompanyId,
    name: 'Siège Principal',
    code: 'HQ',
    city: newCompany.city,
    address: newCompany.address,
    is_headquarters: true,
    created_at: now,
  });

  // Log activity
  database.activity_logs.push({
    id: db.generateId('act'),
    company_id: newCompanyId,
    user_id: req.user!.id,
    entity_type: 'company',
    entity_id: newCompanyId,
    action: 'Nouvelle entreprise créée',
    description: `Création de l’entreprise ${name} par ${req.user!.first_name} ${req.user!.last_name}.`,
    created_at: now,
  });

  db.save();

  res.status(201).json({
    message: 'Entreprise créée avec succès.',
    data: newCompany,
  });
});
