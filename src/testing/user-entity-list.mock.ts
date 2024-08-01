import { Role } from '../enums/role.enum';
import { UserEntity } from '../user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    id: 1,
    name: 'João Rolim',
    email: 'jpr@teste.com',
    password: '$2b$10$ycd6VVcLb.gxYzYhd9KgDOVphSoEZup.Fek1p4EN24ssF2eH9quQ2',
    birthAt: new Date('2000-01-01'),
    role: Role.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Glaucio Daniel',
    email: 'glaucio@teste.com',
    password: '$2b$10$ycd6VVcLb.gxYzYhd9KgDOVphSoEZup.Fek1p4EN24ssF2eH9quQ2',
    birthAt: new Date('2000-01-01'),
    role: Role.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Djalma Sindaux',
    email: 'djalma@teste.com',
    password: '$2b$10$ycd6VVcLb.gxYzYhd9KgDOVphSoEZup.Fek1p4EN24ssF2eH9quQ2',
    birthAt: new Date('2000-01-01'),
    role: Role.User,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
