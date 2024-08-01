import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { updatePutUserDTO } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { UserController } from './user.controller';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { RoleGuard } from '../guards/role.guard';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock, userRepositoryMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .overrideGuard(RoleGuard)
      .useValue(guardMock)
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test('Validar a definição', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('Teste da aplicação dos Guards neste Controller', () => {
    test('Se os Guards estão aplicados', () => {
      const guards = Reflect.getMetadata('__guards__', UserController);

      expect(guards.length).toEqual(2);
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
      expect(new guards[1]()).toBeInstanceOf(RoleGuard);
    });
  });

  describe('Create', () => {
    test('method create', async () => {
      const result = await userController.create(createUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    test('method list', async () => {
      const result = await userController.list();
      expect(result).toEqual(userEntityList);
    });

    test('method show', async () => {
      const result = await userController.show(1);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    test('method update', async () => {
      const result = await userController.update(1, updatePutUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });

    test('method updatePartial', async () => {
      const result = await userController.updatePartial(1, updatePatchUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    test('method delete', async () => {
      const result = await userController.delete(1);
      expect(result).toEqual({ success: true });
    });
  });
});
