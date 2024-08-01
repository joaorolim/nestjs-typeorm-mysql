import { Role } from '../enums/role.enum';
import { UpdatePutUserDTO } from '../user/dto/update-put-user.dto';

export const updatePutUserDTO: UpdatePutUserDTO = {
  email: 'jpr@teste.com',
  name: 'João Rolim',
  password: 'Ca12345*',
  birthAt: '2000-01-01',
  role: Role.Admin,
};
