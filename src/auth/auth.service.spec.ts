import { Test, TestingModule } from '@nestjs/testing';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { AuthService } from './auth.service';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { accessToken } from '../testing/access-token.mock';
import { jwtPayloadMock } from '../testing/jwt-payload.mock';
import { resetToken } from '../testing/reset-token.mock';
import { authRegisterDTO } from '../testing/auth-register-dto.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  test('Validar a definição', () => {
    expect(authService).toBeDefined();
  });

  describe('Token', () => {
    test('method createToken', async () => {
      const result = authService.createToken(userEntityList[0]);
      expect(result).toEqual({ accessToken });
    });

    test('method checkToken', async () => {
      const result = authService.checkToken(accessToken);
      expect(result).toEqual(jwtPayloadMock);
    });

    test('method isValidtoken', async () => {
      const result = authService.isValidtoken(accessToken);
      expect(result).toEqual(true);
    });
  });

  describe('Autenticação', () => {
    test('method login', async () => {
      const result = await authService.login('jpr@teste.com', 'Ca12345*');
      expect(result).toEqual({ accessToken });
    });

    test('method forget', async () => {
      const result = await authService.forget('jpr@teste.com');
      expect(result).toEqual({ success: true });
    });

    test('method reset', async () => {
      const result = await authService.reset('Ca12345*', resetToken);
      expect(result).toEqual({ accessToken });
    });

    test('method register', async () => {
      const result = await authService.register(authRegisterDTO);
      expect(result).toEqual({ accessToken });
    });
  });
});
