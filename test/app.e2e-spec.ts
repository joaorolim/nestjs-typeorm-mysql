import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { authRegisterDTO } from './../src/testing/auth-register-dto.mock';
import { Role } from '../src/enums/role.enum';
import dataSource from './../typeorm/data-source';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  const emailTesteAdmin: string = 'admin@teste.com';
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('1) Registrar um novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDTO);

    console.log('1)', response.body);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
  });

  it('2) Tentar fazer login com o novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authRegisterDTO.email,
        password: authRegisterDTO.password,
      });

    console.log('2)', response.body);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessToken = response.body.accessToken;
  });

  it('3) Obter os dados do usuário logado', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    console.log('3)', response.body);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.id).toEqual('number');
    expect(response.body.role).toEqual(Role.User);
  });

  it('4) Registrar um novo usuário como admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...authRegisterDTO, role: Role.Admin, email: emailTesteAdmin });

    console.log('4)', response.body);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessToken = response.body.accessToken;
  });

  it('5) Validar se usuario não conseguiu se registrar como admin (continua como user)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    console.log('5)', response.body);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.id).toEqual('number');
    expect(response.body.role).toEqual(Role.User);

    userId = response.body.id;
  });

  it('6) Tentar ver a lista de todos os usuários', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    console.log('6)', response.body);

    expect(response.statusCode).toEqual(403);
    expect(response.body.error).toEqual('Forbidden');
  });

  it('7) Alterando manualmente o perfil do usuário para admin', async () => {
    const ds = await dataSource.initialize();
    const queryRunner = ds.createQueryRunner();

    await queryRunner.query(
      `UPDATE users SET role = '${Role.Admin}' WHERE id = ${userId};`,
    );

    const rows = await queryRunner.query(
      `SELECT * FROM users WHERE id = ${userId};`,
    );

    dataSource.destroy();

    console.log('7)', rows);

    expect(rows.length).toEqual(1);
    expect(rows[0].email).toEqual(emailTesteAdmin);
    expect(rows[0].id).toEqual(userId);
    expect(rows[0].role).toEqual(Role.Admin);
  });

  it('8) Tentar ver a lista de todos os usuários, agora com acesso de Admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    console.log('8)', response.body);

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(2);
  });
});
