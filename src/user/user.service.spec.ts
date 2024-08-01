import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { createUserDTO } from '../testing/create-user-dto.mock';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { updatePutUserDTO } from '../testing/update-put-user-dto.mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';

describe('UserService', () => {
  let userService: UserService;
  let usersRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(UserEntity));
  });

  test('Validar a definição', () => {
    expect(userService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('Create', () => {
    test('method create', async () => {
      jest.spyOn(usersRepository, 'exists').mockResolvedValueOnce(false);
      const result = await userService.create(createUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Read', () => {
    test('method list', async () => {
      const result = await userService.list();
      expect(result).toEqual(userEntityList);
    });

    test('method show', async () => {
      const result = await userService.show(1);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Update', () => {
    test('method update', async () => {
      const result = await userService.update(1, updatePutUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });

    test('method updatePartial', async () => {
      const result = await userService.updatePartial(1, updatePatchUserDTO);
      expect(result).toEqual(userEntityList[0]);
    });
  });

  describe('Delete', () => {
    test('method delete', async () => {
      const result = await userService.delete(1);
      expect(result).toEqual(true);
    });
  });
});
