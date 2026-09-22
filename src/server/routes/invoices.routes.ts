import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole, requirePermission, AuthenticatedRequest } from '../middleware/auth.js';
import { Invoice, InvoiceStatus } from '../db/types.js';

export const invoicesRouter = Router();

/**
 * List invoices with role-based scoping
 */
invoicesRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const database = db.getDb();
    let invoices = database.invoices || [];

    // Multi-tenant and role scoping
    if (user.role_id === 'SUPER_ADMIN_JMF') {
      const { company_id } = req.query;
      if (company_id && typeof company_id === 'string') {
        invoices = invoices.filter(inv => inv.company_id === company_id);
      }
    } else if (user.role_id === 'COMPANY_ADMIN' || user.role_id === 'FINANCE_MANAGER') {
      invoices = invoices.filter(inv => inv.company_id === user.company_id);
    } else if (user.role_id === 'CLIENT') {
      // Customer sees strictly their invoices or invoices tagged to their company/user
      invoices = invoices.filter(inv => inv.user_id === user.id || inv.company_id === user.company_id);
    } else {
      invoices = [];
    }

    // Filters
    const { status, service_type, search } = req.query;
    if (status && typeof status === 'string' && status !== 'ALL') {
      invoices = invoices.filter(inv => inv.status === status);
    }
    if (service_type && typeof service_type === 'string' && service_type !== 'ALL') {
      invoices = invoices.filter(inv => inv.service_type === service_type);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      invoices = invoices.filter(
        inv =>
          inv.invoice_number.toLowerCase().includes(q) ||
          inv.description.toLowerCase().includes(q) ||
          (inv.reference_mission && inv.reference_mission.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
});

/**
 * Get single invoice detail
 */
invoicesRouter.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const database = db.getDb();
    const invoice = database.invoices.find(inv => inv.id === req.params.id || inv.invoice_number === req.params.id);

    if (!invoice) {
      return res.status(404).json({ error: 'Facture introuvable' });
    }

    // Role check
    if (user.role_id !== 'SUPER_ADMIN_JMF') {
      if (user.role_id === 'CLIENT' && invoice.user_id !== user.id && invoice.company_id !== user.company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
      if (user.role_id !== 'CLIENT' && invoice.company_id !== user.company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
    }

    const company = database.companies.find(c => c.id === invoice.company_id);
    const clientUser = invoice.user_id ? database.users.find(u => u.id === invoice.user_id) : null;

    return res.json({
      success: true,
      data: {
        ...invoice,
        company,
        client_user: clientUser,
      },
    });
  } catch (error: any) {
    console.error('Error fetching invoice detail:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
});

/**
 * Create new invoice (Super Admin or Finance Manager)
 */
invoicesRouter.post('/', authenticate, requirePermission('invoices.manage'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      company_id,
      user_id,
      invoice_number,
      period,
      issue_date,
      due_date,
      service_type = 'fleet_management',
      reference_mission,
      description,
      quantity = 1,
      unit_price = 0,
      tax_rate = 18,
      discount = 0,
      currency = 'FCFA',
      status = 'PENDING',
      items_breakdown = [],
    } = req.body;

    if (!company_id || !description || unit_price <= 0) {
      return res.status(400).json({ error: 'Entreprise, description et montant unitaire valides sont obligatoires' });
    }

    const database = db.getDb();
    const finalInvNumber = invoice_number ? String(invoice_number).trim() : db.generateInvoiceNumber();
    const emefCode = `DGI-BJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 90000)}-MECeF`;
    const now = new Date().toISOString();

    const qty = Number(quantity) || 1;
    const price = Number(unit_price) || 0;
    const disc = Number(discount) || 0;
    const tax = Number(tax_rate) || 0;

    const amount_ht = Math.round(qty * price - disc);
    const amount_tva = Math.round(amount_ht * (tax / 100));
    const amount_ttc = amount_ht + amount_tva;

    const newInvoice: Invoice = {
      id: db.generateId('inv'),
      invoice_number: finalInvNumber,
      emef_code: emefCode,
      company_id,
      user_id: user_id || null,
      period: period || `Mois de ${new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`,
      issue_date: issue_date || now.slice(0, 10),
      due_date: due_date || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      service_type,
      reference_mission: reference_mission ? String(reference_mission).trim() : undefined,
      description: String(description).trim(),
      quantity: qty,
      unit_price: price,
      tax_rate: tax,
      discount: disc,
      amount_ht,
      amount_tva,
      amount_ttc,
      currency,
      status: status as InvoiceStatus,
      items_breakdown: items_breakdown.length > 0 ? items_breakdown : [
        { label: description, qty, unit_price: price, total: amount_ht }
      ],
      created_at: now,
      updated_at: now,
    };

    database.invoices.unshift(newInvoice);

    // If reference_mission corresponds to a convoy request, link it!
    if (reference_mission) {
      const convoyReq = database.convoy_requests.find(r => r.reference === reference_mission);
      if (convoyReq) {
        convoyReq.invoice_id = newInvoice.id;
        convoyReq.updated_at = now;
      }
    }

    await db.save();

    db.logActivity({
      company_id,
      user_id: user.id,
      entity_type: 'invoice',
      entity_id: newInvoice.id,
      action: 'Création facture',
      description: `Facture ${newInvoice.invoice_number} de ${amount_ttc.toLocaleString()} ${currency} créée pour ${company_id}`,
    });

    return res.status(201).json({
      success: true,
      message: 'Facture créée avec succès',
      data: newInvoice,
    });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de la facture' });
  }
});

/**
 * Update invoice status or payment details (Accounting compliance: no physical delete)
 */
invoicesRouter.patch('/:id', authenticate, requirePermission('invoices.manage'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const database = db.getDb();
    const invoice = database.invoices.find(inv => inv.id === req.params.id);

    if (!invoice) {
      return res.status(404).json({ error: 'Facture introuvable' });
    }

    const { status, payment_method, payment_date, transaction_ref, due_date, description, unit_price } = req.body;
    const now = new Date().toISOString();
    const changes: { field: string; old_value: any; new_value: any }[] = [];
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '197.234.221.14';

    if (status && status !== invoice.status) {
      changes.push({ field: 'status', old_value: invoice.status, new_value: status });
      invoice.status = status as InvoiceStatus;
      if (status === 'PAID') {
        const pMethod = payment_method || invoice.payment_method || 'Virement bancaire';
        const pDate = payment_date || now.slice(0, 10);
        const tRef = transaction_ref || `TRX-${Date.now()}`;
        if (invoice.payment_method !== pMethod) changes.push({ field: 'payment_method', old_value: invoice.payment_method, new_value: pMethod });
        if (invoice.payment_date !== pDate) changes.push({ field: 'payment_date', old_value: invoice.payment_date, new_value: pDate });
        invoice.payment_method = pMethod;
        invoice.payment_date = pDate;
        invoice.transaction_ref = tRef;
      }
    }
    if (due_date && due_date !== invoice.due_date) {
      changes.push({ field: 'due_date', old_value: invoice.due_date, new_value: due_date });
      invoice.due_date = due_date;
    }
    if (description && description !== invoice.description) {
      changes.push({ field: 'description', old_value: invoice.description, new_value: description });
      invoice.description = description;
    }
    if (unit_price !== undefined && unit_price !== invoice.unit_price) {
      changes.push({ field: 'unit_price', old_value: invoice.unit_price, new_value: unit_price });
      invoice.unit_price = Number(unit_price);
      invoice.amount_ht = Math.round(invoice.quantity * invoice.unit_price - invoice.discount);
      invoice.amount_tva = Math.round(invoice.amount_ht * (invoice.tax_rate / 100));
      invoice.amount_ttc = invoice.amount_ht + invoice.amount_tva;
    }

    invoice.updated_at = now;
    await db.save();

    db.logActivity({
      company_id: invoice.company_id,
      user_id: user.id,
      entity_type: 'invoice',
      entity_id: invoice.id,
      action: `Modification de facture ${invoice.invoice_number}`,
      description: `Facture ${invoice.invoice_number} (Réf MECeF: ${invoice.emef_code}) mise à jour. Modifications enregistrées : ${changes.map(c => `${c.field} (${c.old_value || 'aucun'} ➔ ${c.new_value})`).join(', ') || 'Actualisation'}`,
      severity: changes.some(c => c.field === 'status' || c.field === 'unit_price') ? 'warning' : 'info',
      compliance_tag: 'INVOICE_MODIFICATION',
      ip_address: clientIp,
      changes,
      metadata: {
        invoice_number: invoice.invoice_number,
        emef_code: invoice.emef_code,
        amount_ttc: invoice.amount_ttc,
        currency: invoice.currency,
        updated_by: user.email,
      },
    });

    return res.json({
      success: true,
      message: 'Facture mise à jour avec succès',
      data: invoice,
    });
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});
