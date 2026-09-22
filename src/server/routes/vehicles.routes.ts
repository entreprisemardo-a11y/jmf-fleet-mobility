import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, AuthenticatedRequest, requirePermission } from '../middleware/auth.js';

export const vehiclesRouter = Router();

// GET /api/vehicles - List vehicles scoped by tenant
vehiclesRouter.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const database = db.getDb();
  const queryCompanyId = req.query.company_id as string | undefined;
  const companyId = queryCompanyId || (req.company ? req.company.id : req.user!.company_id);

  if (!companyId && !req.isSuperAdmin) {
    res.status(400).json({ error: 'Aucune entreprise active.' });
    return;
  }

  let vehicles = db.scopeByCompany(
    database.vehicles,
    companyId || null,
    req.isSuperAdmin || false,
    queryCompanyId
  );

  // Optional status filter
  const { status, search, type } = req.query;
  if (status && typeof status === 'string' && status !== 'all' && status !== 'ALL') {
    if (status === 'active') {
      vehicles = vehicles.filter(v => v.status === 'active');
    } else if (status === 'available') {
      vehicles = vehicles.filter(v => v.status === 'available' || (!v.current_driver_id && v.status === 'active'));
    } else if (status === 'maintenance') {
      vehicles = vehicles.filter(v => v.status === 'maintenance' || v.status === 'immobilized');
    } else if (status === 'retired') {
      vehicles = vehicles.filter(v => v.status === 'retired');
    } else {
      vehicles = vehicles.filter(v => v.status === status);
    }
  }
  if (type && typeof type === 'string') {
    vehicles = vehicles.filter(v => v.vehicle_type === type);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    vehicles = vehicles.filter(v => 
      v.registration_number.toLowerCase().includes(q) ||
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      (v.vin && v.vin.toLowerCase().includes(q))
    );
  }

  // Attach driver and site summary
  const enrichedVehicles = vehicles.map(v => {
    const driver = v.current_driver_id ? database.drivers.find(d => d.id === v.current_driver_id) : null;
    const site = v.site_id ? database.sites.find(s => s.id === v.site_id) : null;
    return {
      ...v,
      driver: driver ? { id: driver.id, name: `${driver.first_name} ${driver.last_name}`, phone: driver.phone } : null,
      site: site ? { id: site.id, name: site.name } : null,
    };
  });

  res.json({ data: enrichedVehicles, count: enrichedVehicles.length });
});

// GET /api/vehicles/:id - 360° Detailed Vehicle View
vehiclesRouter.get('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const vehicleId = req.params.id;
  const database = db.getDb();
  const vehicle = database.vehicles.find(v => v.id === vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Véhicule introuvable.' });
    return;
  }

  // Multi-tenant check
  if (!req.isSuperAdmin && vehicle.company_id !== req.user!.company_id) {
    res.status(403).json({ error: 'Accès interdit : ce véhicule appartient à une autre entreprise.' });
    return;
  }

  const driver = vehicle.current_driver_id ? database.drivers.find(d => d.id === vehicle.current_driver_id) : null;
  const site = vehicle.site_id ? database.sites.find(s => s.id === vehicle.site_id) : null;
  const costCenter = vehicle.cost_center_id ? database.cost_centers.find(cc => cc.id === vehicle.cost_center_id) : null;
  const assignments = database.vehicle_assignments.filter(va => va.vehicle_id === vehicle.id);
  const documents = database.documents.filter(d => d.vehicle_id === vehicle.id);
  const workOrders = database.work_orders.filter(wo => wo.vehicle_id === vehicle.id);
  const fuelEntries = database.fuel_entries.filter(fe => fe.vehicle_id === vehicle.id);
  const alerts = database.alerts.filter(a => a.vehicle_id === vehicle.id);

  res.json({
    data: {
      ...vehicle,
      driver,
      site,
      cost_center: costCenter,
      assignments,
      documents,
      work_orders: workOrders,
      fuel_entries: fuelEntries,
      alerts,
    },
  });
});

// POST /api/vehicles - Create a vehicle
vehiclesRouter.post('/', authenticate, requirePermission('vehicles.create'), (req: AuthenticatedRequest, res: Response) => {
  const {
    registration_number,
    vin,
    brand,
    model,
    version,
    vehicle_type,
    category,
    color,
    year,
    first_registration_date,
    energy_type,
    current_mileage,
    acquisition_mode,
    purchase_value,
    monthly_lease,
    supplier,
    site_id,
    current_driver_id,
  } = req.body;

  if (!registration_number || !brand || !model) {
    res.status(422).json({ error: 'L’immatriculation, la marque et le modèle sont obligatoires.' });
    return;
  }

  const companyId = req.company ? req.company.id : req.user!.company_id;
  if (!companyId) {
    res.status(400).json({ error: 'Aucune entreprise active.' });
    return;
  }

  const database = db.getDb();

  // Check duplicate registration in the same company
  const existing = database.vehicles.find(
    v => v.company_id === companyId && v.registration_number.toLowerCase() === registration_number.toLowerCase()
  );
  if (existing) {
    res.status(409).json({ error: `Un véhicule avec l’immatriculation ${registration_number} existe déjà dans cette entreprise.` });
    return;
  }

  const newVehicleId = db.generateId('veh');
  const now = new Date().toISOString();

  const newVehicle = {
    id: newVehicleId,
    company_id: companyId,
    site_id: site_id || undefined,
    cost_center_id: undefined,
    current_driver_id: current_driver_id || undefined,
    registration_number: registration_number.toUpperCase().trim(),
    vin: vin || '',
    brand,
    model,
    version: version || '',
    vehicle_type: vehicle_type || 'VP',
    category: category || 'Berline',
    color: color || 'Blanc',
    year: year ? parseInt(year, 10) : new Date().getFullYear(),
    first_registration_date: first_registration_date || now.split('T')[0],
    country: 'Bénin',
    energy_type: energy_type || 'Diesel',
    current_mileage: current_mileage ? parseFloat(current_mileage) : 0,
    fuel_level_percent: 100,
    status: 'active' as const,
    acquisition_mode: acquisition_mode || 'Achat comptant',
    purchase_value: purchase_value ? parseFloat(purchase_value) : 0,
    monthly_lease: monthly_lease ? parseFloat(monthly_lease) : 0,
    supplier: supplier || '',
    main_photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    notes: '',
    created_at: now,
    updated_at: now,
  };

  database.vehicles.push(newVehicle);

  // Log activity
  database.activity_logs.push({
    id: db.generateId('act'),
    company_id: companyId,
    user_id: req.user!.id,
    entity_type: 'vehicle',
    entity_id: newVehicleId,
    action: 'Nouveau véhicule enregistré',
    description: `Enregistrement du véhicule ${newVehicle.registration_number} (${newVehicle.brand} ${newVehicle.model}) par ${req.user!.first_name} ${req.user!.last_name}.`,
    created_at: now,
  });

  db.save();

  res.status(201).json({
    message: 'Véhicule enregistré avec succès.',
    data: newVehicle,
  });
});
