import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create({ email, name, password, birthAt, role }: CreateUserDTO) {
    // Recebidos: console.log('create', { email, name, password, birthAt });

    if (await this.usersRepository.exists({ where: { email } })) {
      throw new BadRequestException(`Este email já está sendo usado.`);
    }

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    const data = { email, name, password, birthAt, role };

    const user = this.usersRepository.create(data);

    return this.usersRepository.save(user);
  }

  async list() {
    return this.usersRepository.find();
  }

  async show(id: number) {
    await this.exists(id);

    return this.usersRepository.findOneBy({ id });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    // Dados recebidos: console.log({ email, name, password, birthAt });

    await this.exists(id);

    // const birthDate = birthAt ? new Date(birthAt) : null;

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    await this.usersRepository.update(id, {
      email,
      name,
      password,
      birthAt,
      role,
    });

    return this.show(id);
  }

  async updatePartial(
    id: number,
    { email, name, password, birthAt, role }: UpdatePatchUserDTO,
  ) {
    // Dados recebidos: console.log({ email, name, password, birthAt });

    await this.exists(id);

    const data: any = {};

    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (email) {
      data.email = email;
    }

    if (name) {
      data.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(password, salt);
    }

    if (role) {
      data.role = role;
    }

    await this.usersRepository.update(id, data);

    return this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);

    await this.usersRepository.delete(id);

    return true;
  }

  async exists(id: number) {
    if (!(await this.usersRepository.exists({ where: { id } }))) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}
