import { Role } from '../enums/role.enum';
import { CreateUserDTO } from '../user/dto/create-user.dto';

export const createUserDTO: CreateUserDTO = {
  email: 'jpr@teste.com',
  name: 'João Rolim',
  password: 'Ca12345*',
  birthAt: '2000-01-01',
  role: Role.Admin,
};
