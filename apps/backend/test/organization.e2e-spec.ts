import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '@/app/app.module';
import { setupTestDb, teardownTestDb } from './setup/test-db';
import { PrismaService } from '@/helper/prisma.service';

import { JwtService } from '@nestjs/jwt';
import { GlobalRole } from '@prisma/client';

describe('Organization & Restaurant Modules (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  
  let superAdminToken: string;
  let superAdminId: string;

  beforeAll(async () => {
    prisma = (await setupTestDb()) as any;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    jwtService = app.get(JwtService);

    // Setup Super Admin User
    const superAdminUser = await prisma.user.create({
      data: {
        email: `superadmin${Math.random()}@example.com`,
        password: 'hashed-password',
        name: 'Super Admin',
        role: GlobalRole.SUPER_ADMIN,
      },
    });
    superAdminId = superAdminUser.id;

    superAdminToken = await jwtService.signAsync({
      id: superAdminUser.id,
      email: superAdminUser.email,
      role: superAdminUser.role,
    });
  }, 30000); // 30s timeout for repl set setup

  afterAll(async () => {
    if (app) await app.close();
    await teardownTestDb();
  });

  describe('Organizations', () => {
    let orgId: string;

    it('/organizations (POST) - Create organization', async () => {
      const response = await request(app.getHttpServer())
        .post('/organizations')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          name: `Company ${Math.random()}`,
          ownerId: superAdminId,
        })
        .expect(201);

      expect(response.body.data.name).toBeDefined();
      expect(response.body.data.ownerId).toBe(superAdminId);
      orgId = response.body.data.id;
    });

    it('/organizations (GET) - List organizations', async () => {
      const response = await request(app.getHttpServer())
        .get('/organizations')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Restaurants', () => {
    let orgId: string;
    let restId: string;

    beforeAll(async () => {
      // Create a dedicated org for restaurant tests
      const org = await prisma.organization.create({
        data: {
          name: `Org ${Math.random()}`,
          ownerId: superAdminId,
        }
      });
      orgId = org.id;
    });

    it('/organizations/:orgId/restaurants (POST) - Create restaurant', async () => {
      const response = await request(app.getHttpServer())
        .post(`/organizations/${orgId}/restaurants`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          name: `Restaurant ${Math.random()}`,
          slug: `rest-${Math.random().toString(36).substring(7)}`,
          isActive: true,
        })
        .expect(201);

      expect(response.body.data.name).toBeDefined();
      expect(response.body.data.organizationId).toBe(orgId);
      restId = response.body.data.id;
    });

    it('/restaurants/:id (GET) - Get restaurant', async () => {
      const response = await request(app.getHttpServer())
        .get(`/restaurants/${restId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(restId);
    });

    it('/restaurants/:id (PATCH) - Update restaurant', async () => {
      const newName = 'Updated Name';
      const response = await request(app.getHttpServer())
        .patch(`/restaurants/${restId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ name: newName })
        .expect(200);

      expect(response.body.data.name).toBe(newName);
    });

    it('/restaurants/:id (DELETE) - Fail to delete if branches exist', async () => {
      // Create a dummy branch
      await prisma.branch.create({
        data: {
          restaurantId: restId,
          name: 'Main Branch',
          address: {
            line1: '123 Test St',
            city: 'Test City',
            state: 'TS',
            postalCode: '12345',
            country: 'Testland'
          },
        }
      });

      // Try to delete restaurant
      const response = await request(app.getHttpServer())
        .delete(`/restaurants/${restId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(409); // Conflict

      expect(response.body.message).toContain('active branches');
    });
  });
});
