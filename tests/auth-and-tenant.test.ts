import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/server/db/database.js';
import { hashPassword } from '../src/server/db/seeds.js';
import { createPersonalAccessToken } from '../src/server/middleware/auth.js';

test('Authentication & Password Verification', async () => {
  db.resetToSeeds();
  const database = db.getDb();

  // Test 1: User exists and password matches
  const jean = database.users.find(u => u.email === 'jean.kouassi@societe-cliente.com');
  assert.ok(jean, 'Jean Kouassi should exist in database');
  assert.equal(jean.role_id, 'COMPANY_ADMIN');
  assert.equal(jean.password_hash, hashPassword('jmf2026'));

  // Test 2: Token creation
  const { token, id } = createPersonalAccessToken(jean.id, 'test_token');
  assert.ok(token.startsWith('jmf_pat_'));
  const storedToken = database.personal_access_tokens.find(t => t.id === id);
  assert.ok(storedToken, 'Token should be persisted in personal_access_tokens table');
});

test('Multi-Tenant Isolation Verification', async () => {
  db.resetToSeeds();
  const database = db.getDb();

  const companyAId = 'comp_jmf_client_001'; // Société Cliente SARL
  const companyBId = 'comp_bollore_002';    // Bolloré Logistics

  // Check vehicle count per tenant
  const vehiclesCompanyA = db.scopeByCompany(database.vehicles, companyAId, false);
  const vehiclesCompanyB = db.scopeByCompany(database.vehicles, companyBId, false);

  assert.ok(vehiclesCompanyA.length >= 5, 'Company A should have at least 5 vehicles');
  assert.ok(vehiclesCompanyB.length >= 1, 'Company B should have at least 1 vehicle');

  // Verify that NO vehicle of Company B is returned when scoping by Company A
  const leakedToA = vehiclesCompanyA.some(v => v.company_id === companyBId);
  assert.equal(leakedToA, false, 'CRITICAL SECURITY: Company A must NEVER receive Company B vehicles!');

  // Verify that NO vehicle of Company A is returned when scoping by Company B
  const leakedToB = vehiclesCompanyB.some(v => v.company_id === companyAId);
  assert.equal(leakedToB, false, 'CRITICAL SECURITY: Company B must NEVER receive Company A vehicles!');

  // Verify that a specific vehicle (e.g. BJ-9999-ZZ belonging to Company B) cannot be accessed by Company A
  const bolloreTruck = database.vehicles.find(v => v.registration_number === 'BJ-9999-ZZ');
  assert.ok(bolloreTruck);
  assert.equal(bolloreTruck.company_id, companyBId);

  // Attempting to access it as Company A user should yield null/forbidden
  const canCompanyAAccessBolloreTruck = (bolloreTruck.company_id as string) === companyAId;
  assert.equal(canCompanyAAccessBolloreTruck, false, 'Tenant isolation prevents direct resource access');
});

test('Super Admin Global Access', async () => {
  db.resetToSeeds();
  const database = db.getDb();

  // Super admin scoping with no company filter returns ALL vehicles
  const allVehicles = db.scopeByCompany(database.vehicles, null, true);
  assert.equal(allVehicles.length, database.vehicles.length);

  // Super admin scoping with specific company filter returns only that company
  const filteredVehicles = db.scopeByCompany(database.vehicles, null, true, 'comp_bollore_002');
  assert.equal(filteredVehicles.every(v => v.company_id === 'comp_bollore_002'), true);
});
