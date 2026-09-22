import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/server/db/database.js';
import { emailService } from '../src/server/services/email.service.js';

test('Convoy Request Reference Generation & Uniqueness', async () => {
  db.resetToSeeds();
  const ref1 = db.generateConvoyReference();
  assert.ok(ref1.startsWith('JMF-CONV-'));
  assert.match(ref1, /^JMF-CONV-\d{4}-\d{6}$/);

  // Add dummy request and verify next reference increments
  db.getDb().convoy_requests.push({
    id: 'conv_temp',
    reference: ref1,
    company_id: null,
    user_id: null,
    status: 'NEW',
    vehicle_brand: 'Peugeot',
    vehicle_model: '208',
    vehicle_year: 2020,
    is_registered: true,
    vehicle_color: 'Blanc',
    vehicle_condition: 'good',
    requires_flatbed: false,
    pickup_address: 'Cotonou',
    pickup_city: 'Cotonou',
    pickup_country: 'Bénin',
    delivery_address: 'Porto-Novo',
    delivery_city: 'Porto-Novo',
    delivery_country: 'Bénin',
    desired_date: '2026-09-30',
    desired_time: '10:00',
    convoy_type: 'individual',
    convoy_mode: 'driver',
    client_name: 'Test Client',
    client_email: 'test@example.com',
    client_phone: '+229 01 23 45 67',
    client_country: 'Bénin',
    privacy_accepted: true,
    timeline: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const ref2 = db.generateConvoyReference();
  assert.notEqual(ref1, ref2, 'Consecutive references must be distinct');
});

test('RBAC Roles & CLIENT Isolation', async () => {
  db.resetToSeeds();
  const database = db.getDb();

  // Role CLIENT must exist
  const clientRole = database.roles.find(r => r.id === 'CLIENT');
  assert.ok(clientRole, 'Role CLIENT must be registered in roles');
  assert.equal(clientRole.is_system, true);

  // Permissions for CLIENT must be restricted
  const clientPermissions = database.role_permissions
    .filter(rp => rp.role_id === 'CLIENT')
    .map(rp => rp.permission_id);

  assert.ok(clientPermissions.includes('convoy.view'));
  assert.ok(clientPermissions.includes('invoices.view'));
  assert.equal(clientPermissions.includes('settings.manage'), false, 'Client must NEVER have settings.manage permission');
  assert.equal(clientPermissions.includes('companies.manage'), false, 'Client must NEVER have companies.manage permission');
});

test('Invoices Multi-Tenant and Calculation Rules', async () => {
  db.resetToSeeds();
  const database = db.getDb();

  const companyAId = 'comp_jmf_client_001';
  const companyBId = 'comp_bollore_002';

  const invA = db.scopeByCompany(database.invoices, companyAId, false);
  const invB = db.scopeByCompany(database.invoices, companyBId, false);

  assert.ok(invA.length >= 1, 'Company A should have invoices');
  assert.equal(invA.some(i => i.company_id === companyBId), false, 'Company A must NOT see Company B invoices');

  // Verify tax and total calculation on sample invoice
  const sample = database.invoices[0];
  assert.ok(sample);
  assert.equal(sample.amount_ht + sample.amount_tva, sample.amount_ttc, 'TTC must equal HT + TVA');
});

test('Automated Email Service Logging', async () => {
  db.resetToSeeds();
  const result = await emailService.sendEmail({
    to: 'test.dest@example.com',
    recipient_name: 'Test Destinataire',
    subject: 'Test Subject',
    body: 'Test Email Body',
    type: 'CONVOY_CONFIRMATION',
  });

  assert.equal(result.success, true);
  assert.ok(result.logId);

  const database = db.getDb();
  const logged = database.email_logs.find(e => e.id === result.logId);
  assert.ok(logged, 'Email log must be recorded in database');
  assert.equal(logged.to, 'test.dest@example.com');
  assert.equal(logged.status, 'sent');
});
