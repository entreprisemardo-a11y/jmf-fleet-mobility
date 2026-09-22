import {
  UserProfile,
  Company,
  DashboardData,
  VehicleSummary,
  RoleId,
} from '../types/index.js';

// Local storage keys
const STORAGE_KEY_VEHICLES = 'jmf_local_vehicles';
const STORAGE_KEY_ACTIVE_TENANT = 'jmf_active_tenant_id';
const STORAGE_KEY_USER = 'jmf_cached_user';

// Mock Companies
export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp_jmf_client_001',
    name: 'Société Cliente SARL',
    legal_name: 'Société Cliente SARL Bénin',
    registration_number: 'RB/COT/21 B 14234',
    tax_number: 'IFU 0202110293849',
    email: 'contact@societe-cliente.com',
    phone: '+229 21 31 45 00',
    address: 'Boulevard de la Marina, Lot 45',
    city: 'Cotonou',
    country: 'Bénin',
    currency: 'FCFA',
    timezone: 'Africa/Porto-Novo',
    logo_url: '/assets/logo-client.png',
    is_active: true,
  },
  {
    id: 'comp_bollore_002',
    name: 'Bolloré Transport & Logistics',
    legal_name: 'Bolloré Africa Logistics Bénin SA',
    registration_number: 'RB/COT/18 B 87654',
    tax_number: 'IFU 0199834729103',
    email: 'contact.benin@bollore-logistics.com',
    phone: '+229 21 30 12 50',
    address: 'Zone Portuaire, Rue du Port',
    city: 'Cotonou',
    country: 'Bénin',
    currency: 'FCFA',
    timezone: 'Africa/Porto-Novo',
    logo_url: '/assets/logo-bollore.png',
    is_active: true,
  },
];

// Mock Users
export const MOCK_USERS: (UserProfile & { password_plain: string })[] = [
  {
    id: 'usr_jean_kouassi',
    email: 'jean.kouassi@societe-cliente.com',
    first_name: 'Jean',
    last_name: 'KOUASSI',
    phone: '+229 97 00 11 22',
    role: 'COMPANY_ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    company_id: 'comp_jmf_client_001',
    password_plain: 'jmf2026',
  },
  {
    id: 'usr_super_admin',
    email: 'admin@jmf-mobility.com',
    first_name: 'Super Admin',
    last_name: 'JMF',
    phone: '+229 01 23 45 67',
    role: 'SUPER_ADMIN_JMF',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    company_id: 'comp_jmf_client_001',
    password_plain: 'admin123',
  },
  {
    id: 'usr_marc_allagbe',
    email: 'marc.allagbe@bollore-logistics.com',
    first_name: 'Marc',
    last_name: 'ALLAGBE',
    phone: '+229 95 11 22 33',
    role: 'COMPANY_ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    company_id: 'comp_bollore_002',
    password_plain: 'bollore2026',
  },
  {
    id: 'usr_client_martin',
    email: 'martin.adjovi@afrique-transit.com',
    first_name: 'Martin',
    last_name: 'ADJOVI',
    phone: '+229 97 12 34 56',
    role: 'CLIENT',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
    company_id: 'comp_jmf_client_001',
    password_plain: 'client2026',
  },
];

// Initial Vehicles strictly matching VehicleSummary type
const INITIAL_VEHICLES: VehicleSummary[] = [
  {
    id: 'veh_peugeot_3008',
    company_id: 'comp_jmf_client_001',
    registration_number: 'BJ-1234-CD',
    vin: 'VF3MCYHZRKS123456',
    brand: 'Peugeot',
    model: '3008',
    version: 'Allure Pack 1.5 BlueHDi 130ch EAT8',
    vehicle_type: 'VP',
    category: 'SUV Compact',
    color: 'Gris Platinium Métallisé',
    year: 2023,
    energy_type: 'Diesel',
    current_mileage: 56780,
    fuel_level_percent: 65,
    status: 'active',
    acquisition_mode: 'LLD (Location Longue Durée 36 mois)',
    purchase_value: 24500000,
    monthly_lease: 650000,
    supplier: 'CFAO Motors Bénin',
    main_photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    driver: { id: 'drv_1', name: 'Pierre DOSSOU', phone: '+229 97 12 34 56' },
    site: { id: 'site_1', name: 'Siège - Cotonou' },
  },
  {
    id: 'veh_renault_master',
    company_id: 'comp_jmf_client_001',
    registration_number: 'BJ-5678-EF',
    vin: 'VF1MA000456789012',
    brand: 'Renault',
    model: 'Master Fourgon',
    version: 'Grand Confort L2H2 dCi 135',
    vehicle_type: 'VUL',
    category: 'Utilitaire Fourgon',
    color: 'Blanc Glacier',
    year: 2022,
    energy_type: 'Diesel',
    current_mileage: 112400,
    fuel_level_percent: 40,
    status: 'active',
    acquisition_mode: 'Achat Comptant',
    purchase_value: 18900000,
    monthly_lease: 0,
    supplier: 'SOCAR Bénin',
    main_photo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800',
    driver: { id: 'drv_2', name: 'Koffi AMAN', phone: '+229 96 23 45 67' },
    site: { id: 'site_2', name: 'Agence Port de Cotonou' },
  },
  {
    id: 'veh_toyota_hilux',
    company_id: 'comp_jmf_client_001',
    registration_number: 'BJ-9012-GH',
    vin: 'MROFR22G500345678',
    brand: 'Toyota',
    model: 'Hilux Double Cabine',
    version: '2.4 D-4D 4x4 Légende BVM',
    vehicle_type: 'VUL',
    category: 'Pick-up Tout-Terrain',
    color: 'Gris Sidéral',
    year: 2024,
    energy_type: 'Diesel',
    current_mileage: 24300,
    fuel_level_percent: 85,
    status: 'active',
    acquisition_mode: 'Crédit-Bail',
    purchase_value: 29500000,
    monthly_lease: 720000,
    supplier: 'CFAO Motors Bénin',
    main_photo: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=800',
    driver: { id: 'drv_3', name: 'Mathieu KPADONOU', phone: '+229 95 34 56 78' },
    site: { id: 'site_3', name: 'Agence Abomey-Calavi' },
  },
  {
    id: 'veh_iveco_daily',
    company_id: 'comp_jmf_client_001',
    registration_number: 'BJ-3456-IJ',
    vin: 'ZCFC35A2405678901',
    brand: 'Iveco',
    model: 'Daily 35S16',
    version: 'Caisse Frigorifique Bi-Température',
    vehicle_type: 'VUL',
    category: 'Fourgon Frigorifique',
    color: 'Blanc',
    year: 2021,
    energy_type: 'Diesel',
    current_mileage: 145600,
    fuel_level_percent: 20,
    status: 'maintenance',
    acquisition_mode: 'LLD',
    purchase_value: 32000000,
    monthly_lease: 850000,
    supplier: 'Iveco Cotonou',
    main_photo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
    driver: { id: 'drv_4', name: 'Michel HOUNGBO', phone: '+229 97 45 67 89' },
    site: { id: 'site_2', name: 'Agence Port de Cotonou' },
  },
  {
    id: 'veh_hyundai_santa_fe',
    company_id: 'comp_jmf_client_001',
    registration_number: 'BJ-7890-KL',
    vin: 'KMHSH81WPPU123987',
    brand: 'Hyundai',
    model: 'Santa Fe',
    version: 'Executive 2.2 CRDi 4WD BVA',
    vehicle_type: 'VP',
    category: 'SUV Direction',
    color: 'Noir Ébène',
    year: 2023,
    energy_type: 'Diesel',
    current_mileage: 42100,
    fuel_level_percent: 70,
    status: 'active',
    acquisition_mode: 'Achat Comptant',
    purchase_value: 36000000,
    monthly_lease: 0,
    supplier: 'Hyundai Bénin',
    main_photo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    driver: { id: 'drv_5', name: 'Jean KOUASSI', phone: '+229 97 00 11 22' },
    site: { id: 'site_1', name: 'Siège - Cotonou' },
  },
  {
    id: 'veh_bollore_truck_1',
    company_id: 'comp_bollore_002',
    registration_number: 'BJ-9999-ZZ',
    vin: 'WDB9340321L999888',
    brand: 'Mercedes-Benz',
    model: 'Actros 3340',
    version: 'Tracteur Routier 6x4 400ch',
    vehicle_type: 'Poids lourd',
    category: 'Tracteur Routier',
    color: 'Bleu Nuit',
    year: 2020,
    energy_type: 'Diesel',
    current_mileage: 210000,
    fuel_level_percent: 50,
    status: 'active',
    acquisition_mode: 'LLD Flotte Industrielle',
    purchase_value: 68000000,
    monthly_lease: 1450000,
    supplier: 'Mercedes-Benz Cotonou',
    main_photo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
    driver: { id: 'drv_6', name: 'Marc ALLAGBE', phone: '+229 95 11 22 33' },
    site: { id: 'site_4', name: 'Base Port Bolloré' },
  },
  {
    id: 'veh_suzuki_vitara',
    company_id: 'comp_jmf_client_001',
    registration_number: 'BJ-4567-MN',
    vin: 'TSMEYD21S00987654',
    brand: 'Suzuki',
    model: 'Vitara AllGrip',
    version: '1.4 Boosterjet Hybrid Style 4WD',
    vehicle_type: 'VP',
    category: 'SUV Pool & Missions',
    color: 'Blanc Nacré',
    year: 2024,
    energy_type: 'Hybride',
    current_mileage: 12400,
    fuel_level_percent: 95,
    status: 'available',
    acquisition_mode: 'Achat Comptant',
    purchase_value: 19800000,
    monthly_lease: 0,
    supplier: 'CFAO Motors Bénin',
    main_photo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    driver: null,
    site: { id: 'site_1', name: 'Siège - Cotonou (Pool)' },
  },
  {
    id: 'veh_toyota_corolla',
    company_id: 'comp_jmf_client_001',
    registration_number: 'BJ-6789-OP',
    vin: 'JTNKW3HE90J123890',
    brand: 'Toyota',
    model: 'Corolla Berline',
    version: '1.8 Hybrid Dynamic Business',
    vehicle_type: 'VP',
    category: 'Berline Pool Déplacements',
    color: 'Gris Argent',
    year: 2023,
    energy_type: 'Hybride',
    current_mileage: 28900,
    fuel_level_percent: 75,
    status: 'available',
    acquisition_mode: 'LLD 36 mois',
    purchase_value: 21500000,
    monthly_lease: 520000,
    supplier: 'CFAO Motors Bénin',
    main_photo: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
    driver: null,
    site: { id: 'site_2', name: 'Agence Port de Cotonou' },
  },
  {
    id: 'veh_peugeot_406_reforme',
    company_id: 'comp_jmf_client_001',
    registration_number: 'BJ-0123-AA',
    vin: 'VF38BRHZF81234901',
    brand: 'Peugeot',
    model: '406 HDi Berline',
    version: '2.0 HDi 110 SR Confort',
    vehicle_type: 'VP',
    category: 'Véhicule Réformé',
    color: 'Bleu de Chine',
    year: 2012,
    energy_type: 'Diesel',
    current_mileage: 382400,
    fuel_level_percent: 10,
    status: 'retired',
    acquisition_mode: 'Amorti 100% • Réformé',
    purchase_value: 12500000,
    monthly_lease: 0,
    supplier: 'Ancien parc JMF',
    main_photo: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=800',
    driver: null,
    site: { id: 'site_1', name: 'Parc Réformes - Cotonou' },
  },
];

class LocalDatabase {
  private getStoredVehicles(): VehicleSummary[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VEHICLES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some((v: VehicleSummary) => v.id === 'veh_suzuki_vitara')) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    this.saveVehicles(INITIAL_VEHICLES);
    return INITIAL_VEHICLES;
  }

  private saveVehicles(vehicles: VehicleSummary[]) {
    try {
      localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(vehicles));
    } catch {}
  }

  public getActiveTenant(): string {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_TENANT) || 'comp_jmf_client_001';
    } catch {
      return 'comp_jmf_client_001';
    }
  }

  public setActiveTenant(tenantId: string) {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TENANT, tenantId);
    } catch {}
  }

  public login(email: string, pass: string): {
    token: string;
    user: UserProfile;
    company: Company | null;
    accessible_companies: Company[];
    permissions: string[];
  } {
    const foundUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!foundUser || foundUser.password_plain !== pass) {
      throw new Error('Identifiants incorrects. Veuillez vérifier votre adresse e-mail et mot de passe.');
    }

    const isSuperAdmin = foundUser.role === 'SUPER_ADMIN_JMF';
    const accessibleCompanies = isSuperAdmin
      ? MOCK_COMPANIES
      : MOCK_COMPANIES.filter((c) => c.id === foundUser.company_id);

    const activeTenantId = this.getActiveTenant();
    let currentCompany = accessibleCompanies.find((c) => c.id === activeTenantId);
    if (!currentCompany && accessibleCompanies.length > 0) {
      currentCompany = accessibleCompanies[0];
      this.setActiveTenant(currentCompany.id);
    }

    const { password_plain, ...profile } = foundUser;

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    } catch {}

    return {
      token: `jmf_token_${foundUser.id}_${Date.now()}`,
      user: profile,
      company: currentCompany || null,
      accessible_companies: accessibleCompanies,
      permissions: [
        'vehicles.view',
        'vehicles.create',
        'vehicles.edit',
        'maintenance.view',
        'fuel.view',
        'documents.view',
        'reports.view',
      ],
    };
  }

  public register(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    company_name?: string;
    role?: RoleId;
    fleet_size?: string;
  }): {
    token: string;
    user: UserProfile;
    company: Company | null;
    accessible_companies: Company[];
    permissions: string[];
  } {
    const existing = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (existing) {
      throw new Error('Un compte avec cette adresse email existe déjà.');
    }

    let company: Company | null = null;
    let companyId: string | null = null;
    if (data.company_name && data.company_name.trim()) {
      companyId = `comp_${Date.now()}`;
      company = {
        id: companyId,
        name: data.company_name.trim(),
        country: 'Bénin',
        currency: 'XOF',
        timezone: 'Africa/Porto-Novo',
        is_active: true,
      };
      MOCK_COMPANIES.push(company);
    }

    const userId = `usr_${Date.now()}`;
    const role: RoleId = data.role || 'COMPANY_ADMIN';
    const newUser = {
      id: userId,
      email: data.email.trim().toLowerCase(),
      password_plain: data.password,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      phone: data.phone || '+229 01 00 00 00',
      role,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      company_id: companyId,
    };

    MOCK_USERS.push(newUser);

    const { password_plain, ...profile } = newUser;
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    } catch {}

    const token = `jmf_token_${userId}_${Date.now()}`;
    if (companyId) {
      this.setActiveTenant(companyId);
    }

    return {
      token,
      user: profile,
      company,
      accessible_companies: company ? [company] : [],
      permissions: [
        'vehicles.view',
        'vehicles.create',
        'vehicles.edit',
        'maintenance.view',
        'fuel.view',
        'documents.view',
        'reports.view',
      ],
    };
  }

  public getMe(): {
    user: UserProfile;
    company: Company | null;
    accessible_companies: Company[];
    permissions: string[];
    is_super_admin: boolean;
  } {
    let user: UserProfile = MOCK_USERS[0];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) user = JSON.parse(stored);
    } catch {}

    const isSuperAdmin = user.role === 'SUPER_ADMIN_JMF';
    const accessibleCompanies = isSuperAdmin
      ? MOCK_COMPANIES
      : MOCK_COMPANIES.filter((c) => c.id === user.company_id);

    const activeTenantId = this.getActiveTenant();
    const currentCompany =
      accessibleCompanies.find((c) => c.id === activeTenantId) || accessibleCompanies[0] || null;

    return {
      user,
      company: currentCompany,
      accessible_companies: accessibleCompanies,
      permissions: [
        'vehicles.view',
        'vehicles.create',
        'vehicles.edit',
        'maintenance.view',
        'fuel.view',
        'documents.view',
        'reports.view',
      ],
      is_super_admin: isSuperAdmin,
    };
  }

  public switchCompany(companyId: string): { company: Company } {
    const company = MOCK_COMPANIES.find((c) => c.id === companyId);
    if (!company) throw new Error('Entreprise introuvable');
    this.setActiveTenant(companyId);
    return { company };
  }

  public getDashboardKpis(): DashboardData {
    const tenantId = this.getActiveTenant();
    const currentCompany = MOCK_COMPANIES.find((c) => c.id === tenantId) || MOCK_COMPANIES[0];

    return {
      company: currentCompany,
      kpis: {
        totalVehicles: 125,
        activeVehicles: 115,
        maintenanceVehicles: 7,
        immobilizedVehicles: 3,
        retiredVehicles: 0,
        expiredDocuments: 18,
        expiringSoonDocuments: 23,
        totalMileage: 184520,
        totalFuelLiters: 26200,
        avgConsumptionL100: 14.2,
        avgCostPerKm: 508,
        totalOperatingCosts: 28450000,
        activeMissions: 2,
        pendingConvoys: 3,
      },
      operationalSummary: {
        activeMissionsCount: 2,
        activeMissions: [
          {
            id: 'odm_1',
            reference: 'ODM-2026-0842-JMF',
            vehicleReg: 'BJ-9012-GH',
            vehicleModel: 'Toyota Hilux 4x4',
            driverName: 'Pierre DOSSOU',
            departureCity: 'Cotonou',
            destinationCity: 'Parakou',
            estimatedKm: 1150,
            status: 'ACTIVE',
          },
          {
            id: 'odm_2',
            reference: 'ODM-2026-0843-JMF',
            vehicleReg: 'BJ-3456-IJ',
            vehicleModel: 'Iveco Daily Frigo',
            driverName: 'Koffi AMAN',
            departureCity: 'Cotonou',
            destinationCity: 'GDIZ Glo-Djigbé',
            estimatedKm: 110,
            status: 'ACTIVE',
          },
        ],
        maintenanceCount: 7,
        maintenanceBreakdown: {
          urgent: 1,
          inProgress: 2,
          scheduled: 4,
        },
        pendingConvoysCount: 3,
        pendingConvoysBreakdown: {
          newRequests: 2,
          analyzing: 1,
          quoteSent: 0,
        },
      },
      statusDistribution: [
        { name: 'Actifs', count: 115, percent: 92, color: '#10B981' },
        { name: 'En maintenance', count: 7, percent: 6, color: '#F59E0B' },
        { name: 'Immobilisés', count: 3, percent: 2, color: '#EF4444' },
        { name: 'Réformés', count: 0, percent: 0, color: '#9CA3AF' },
      ],
      costBreakdown: [
        { name: 'Carburant', amount: 14225000, percent: 50, color: '#0052CC' },
        { name: 'Maintenance & Pièces', amount: 7397000, percent: 26, color: '#10B981' },
        { name: 'Assurances & Visites', amount: 3129500, percent: 11, color: '#8B5CF6' },
        { name: 'Pneumatiques', amount: 2276000, percent: 8, color: '#F59E0B' },
        { name: 'Divers / Péages', amount: 1422500, percent: 5, color: '#6B7280' },
      ],
      fuelWeeklyConsumption: [
        { week: 'Semaine 35', liters: 3420 },
        { week: 'Semaine 36', liters: 3890 },
        { week: 'Semaine 37', liters: 4120 },
        { week: 'Semaine 38', liters: 3750 },
        { week: 'Semaine 39', liters: 4450 },
        { week: 'Semaine 40', liters: 3980 },
      ],
      upcomingMaintenance: [
        {
          id: 'wo_1',
          vehicle_registration: 'BJ-1234-CD',
          intervention: 'Révision générale 60 000 km',
          due_date: '2026-09-24',
          remaining_km: 3220,
          status: 'Planifiée',
        },
        {
          id: 'wo_2',
          vehicle_registration: 'BJ-5678-EF',
          intervention: 'Plaquettes & disques frein',
          due_date: '2026-09-22',
          remaining_km: 850,
          status: 'Urgente',
        },
        {
          id: 'wo_3',
          vehicle_registration: 'BJ-3456-IJ',
          intervention: 'Remplacement groupe froid',
          due_date: '2026-09-21',
          remaining_km: 0,
          status: 'En cours',
        },
      ],
      alertCategoriesCount: [
        {
          type: 'DOCUMENT_EXPIRING',
          icon: 'FileX2',
          title: 'Documents réglementaires',
          count: 18,
          label: 'Documents expirés',
          date: 'Aujourd’hui',
        },
        {
          type: 'OVERCONSUMPTION',
          icon: 'Fuel',
          title: 'Surconsommation carburant',
          count: 4,
          label: 'Véhicules anormaux',
          date: 'Dernières 24h',
        },
        {
          type: 'MAINTENANCE_OVERDUE',
          icon: 'Wrench',
          title: 'Retard de maintenance',
          count: 3,
          label: 'Ordres en souffrance',
          date: 'Cette semaine',
        },
      ],
      recentActivities: [
        {
          id: 'act_1',
          action: 'Plein de carburant enregistré',
          description: '65L Diesel • BJ-1234-CD par Pierre DOSSOU',
          time: 'Il y a 35 min',
        },
        {
          id: 'act_2',
          action: 'Compteur kilométrique mis à jour',
          description: '112 400 km • BJ-5678-EF par Koffi AMAN',
          time: 'Il y a 2h',
        },
        {
          id: 'act_3',
          action: 'Véhicule enregistré dans le parc',
          description: 'Toyota Hilux 4x4 • BJ-9012-GH par Jean KOUASSI',
          time: 'Hier, 11:20',
        },
      ],
      telematics: {
        isDemoMode: true,
        provider: 'JMF Telematics Gateway IoT',
        circulatingCount: 42,
        vehicles: [
          {
            id: 'v1',
            registration: 'BJ-1234-CD',
            model: 'Peugeot 3008',
            lat: 6.357,
            lng: 2.435,
            speed: 48,
            status: 'moving',
            location: 'Boulevard de la Marina, Cotonou',
          },
          {
            id: 'v2',
            registration: 'BJ-5678-EF',
            model: 'Renault Master',
            lat: 6.368,
            lng: 2.428,
            speed: 0,
            status: 'idle',
            location: 'Terminal à conteneurs, Port de Cotonou',
          },
          {
            id: 'v3',
            registration: 'BJ-9012-GH',
            model: 'Toyota Hilux',
            lat: 6.375,
            lng: 2.415,
            speed: 62,
            status: 'moving',
            location: 'Carrefour Étoile Rouge, Cotonou',
          },
          {
            id: 'v4',
            registration: 'BJ-7890-KL',
            model: 'Hyundai Santa Fe',
            lat: 6.348,
            lng: 2.408,
            speed: 0,
            status: 'stopped',
            location: 'Parking Direction Générale, Cotonou',
          },
        ],
      },
    };
  }

  public getVehicles(filters?: { status?: string; category?: string; search?: string }): {
    data: VehicleSummary[];
    total: number;
  } {
    const tenantId = this.getActiveTenant();
    let list = this.getStoredVehicles().filter((v) => v.company_id === tenantId);

    if (filters?.status && filters.status !== 'all' && filters.status !== 'ALL') {
      if (filters.status === 'active') {
        list = list.filter((v) => v.status === 'active');
      } else if (filters.status === 'available') {
        list = list.filter((v) => v.status === 'available' || (!v.driver && v.status === 'active'));
      } else if (filters.status === 'maintenance') {
        list = list.filter((v) => v.status === 'maintenance' || v.status === 'immobilized');
      } else if (filters.status === 'retired') {
        list = list.filter((v) => v.status === 'retired');
      } else {
        list = list.filter((v) => v.status === filters.status);
      }
    }
    if (filters?.category && filters.category !== 'all' && filters.category !== 'ALL') {
      list = list.filter((v) => v.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (v) =>
          v.registration_number.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          (v.driver && v.driver.name.toLowerCase().includes(q))
      );
    }

    return {
      data: list,
      total: list.length,
    };
  }

  public getVehicleDetail(id: string): { data: any } {
    const all = this.getStoredVehicles();
    const v = all.find((item) => item.id === id) || all[0];

    return {
      data: {
        id: v.id,
        company_id: v.company_id,
        registration_number: v.registration_number,
        vin: v.vin || 'VF3MCYHZRKS123456',
        brand: v.brand,
        model: v.model,
        version: v.version || 'Allure Pack 1.5 BlueHDi 130ch EAT8',
        category: v.category || 'SUV Compact',
        vehicle_type: v.vehicle_type || 'VP',
        year: v.year || 2023,
        energy_type: v.energy_type || 'Diesel',
        color: v.color || 'Gris Platinium Métallisé',
        current_mileage: v.current_mileage || 56780,
        fuel_level_percent: v.fuel_level_percent || 65,
        status: v.status,
        main_photo: v.main_photo || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
        acquisition_mode: v.acquisition_mode || 'LLD (Location Longue Durée 36 mois)',
        purchase_value: v.purchase_value || 24500000,
        monthly_lease: v.monthly_lease || 650000,
        supplier: v.supplier || 'CFAO Motors Bénin',
        driver: v.driver || { id: 'drv_1', name: 'Pierre DOSSOU', phone: '+229 97 12 34 56' },
        site: v.site || { id: 'site_1', name: 'Siège - Cotonou' },
        documents: [
          {
            id: 'doc_1',
            type: 'CARTE_GRISE',
            title: 'Certificat d’immatriculation (Carte Grise)',
            document_number: 'CG-COT-2023-897',
            issue_date: '2023-04-20',
            expiry_date: '2028-04-20',
            issuer: 'ANaTT Bénin',
            status: 'VALID',
            days_until_expiry: 570,
          },
          {
            id: 'doc_2',
            type: 'ASSURANCE',
            title: 'Police d’assurance Tous Risques Flotte',
            document_number: 'NSIA-FLOTTE-2026-092',
            issue_date: '2025-10-01',
            expiry_date: '2026-09-30',
            issuer: 'NSIA Assurances Bénin',
            status: 'EXPIRING_SOON',
            days_until_expiry: 10,
          },
          {
            id: 'doc_3',
            type: 'VISITE_TECHNIQUE',
            title: 'Contrôle technique périodique',
            document_number: 'CT-BENIN-2026-4412',
            issue_date: '2026-03-15',
            expiry_date: '2027-03-15',
            issuer: 'CNSR Bénin (Centre National de Sécurité Routière)',
            status: 'VALID',
            days_until_expiry: 176,
          },
        ],
        maintenance_history: [
          {
            id: 'maint_1',
            operation_type: 'Révision générale & vidange 50 000 km',
            mileage: 50120,
            date: '2026-06-12',
            cost: 185000,
            workshop: 'Atelier JMF Akpakpa',
            status: 'COMPLETED',
          },
          {
            id: 'maint_2',
            operation_type: 'Changement plaquettes de freins avant',
            mileage: 42300,
            date: '2026-02-18',
            cost: 95000,
            workshop: 'Atelier JMF Akpakpa',
            status: 'COMPLETED',
          },
        ],
        fuel_history: [
          {
            id: 'fuel_1',
            date: '2026-09-18',
            liters: 55,
            total_cost: 38500,
            mileage: 56780,
            station: 'TotalEnergies Marina Cotonou',
          },
          {
            id: 'fuel_2',
            date: '2026-09-10',
            liters: 52,
            total_cost: 36400,
            mileage: 55900,
            station: 'Oryx Étoile Rouge Cotonou',
          },
        ],
      },
    };
  }

  public createVehicle(data: any): VehicleSummary {
    const tenantId = this.getActiveTenant();
    const newVehicle: VehicleSummary = {
      id: `veh_${Date.now()}`,
      company_id: tenantId,
      registration_number: data.registration_number || `BJ-${Math.floor(1000 + Math.random() * 9000)}-XX`,
      vin: data.vin || `VF3MC${Date.now()}`,
      brand: data.brand || 'Peugeot',
      model: data.model || '3008',
      version: data.version || 'Standard',
      vehicle_type: data.vehicle_type || 'VP',
      category: data.category || 'SUV',
      color: data.color || 'Blanc',
      year: parseInt(data.year) || 2024,
      energy_type: data.energy_type || 'Diesel',
      current_mileage: parseInt(data.current_mileage) || 0,
      fuel_level_percent: 100,
      status: 'active',
      acquisition_mode: data.acquisition_mode || 'Achat',
      purchase_value: parseInt(data.purchase_value) || 0,
      monthly_lease: parseInt(data.monthly_lease) || 0,
      supplier: data.supplier || 'CFAO Motors Bénin',
      main_photo:
        data.main_photo ||
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      driver: data.driver_name
        ? { id: `drv_${Date.now()}`, name: data.driver_name, phone: '+229 97 00 00 00' }
        : null,
      site: data.site_name ? { id: `site_${Date.now()}`, name: data.site_name } : null,
    };

    const vehicles = this.getStoredVehicles();
    vehicles.unshift(newVehicle);
    this.saveVehicles(vehicles);
    return newVehicle;
  }
}

export const localDb = new LocalDatabase();
