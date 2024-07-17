import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password, birthAt, role }: CreateUserDTO) {
    // Recebidos: console.log('create', { email, name, password, birthAt });

    const birthDate = birthAt ? new Date(birthAt) : null;

    const salt = await bcrypt.genSalt();

    // console.log({ salt, password });

    password = await bcrypt.hash(password, salt);

    const data = { email, name, password, birthAt: birthDate, role };

    return this.prisma.user.create({ data });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(
    id: number,
    { email, name, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    // Dados recebidos: console.log({ email, name, password, birthAt });

    await this.exists(id);

    const birthDate = birthAt ? new Date(birthAt) : null;

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    return this.prisma.user.update({
      where: { id },
      data: { email, name, password, birthAt: birthDate, role },
    });
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

    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.exists(id);

    return this.prisma.user.delete({ where: { id } });
  }

  async exists(id: number) {
    if (!(await this.prisma.user.count({ where: { id } }))) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }
  }
}
