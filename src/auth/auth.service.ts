import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createToken(user: UserEntity) {
    // Math.floor(Date.now() / 1000) + 60 * 60; --> 1 hora no futuro
    // Math.floor(Date.now() / 1000) + 60; --> 1 minuto no futuro

    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
          // notBefore: "60 seconds",
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });

      return data;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  isValidtoken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    // console.log(process.env);

    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha inválidos!');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Oopss.. E-mail e/ou senha inválidos!');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('E-mail inválido ou inexistente!');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: this.audience,
        // notBefore: "60 seconds",
      },
    );

    await this.mailer.sendMail({
      to: 'pjrolim@yahoo.com.br',
      subject: 'Recuperação de senha',
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });

    return { success: true };
  }

  async reset(password: string, token: string) {
    try {
      const data: any = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: 'forget',
      });

      console.log(data);

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token inválido ou expirado!');
      }

      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);

      await this.usersRepository.update(Number(data.id), {
        password,
      });

      const user = await this.userService.show(Number(data.id));

      console.log(user);

      // TODO: Enviar e-mail de confirmação
      return this.createToken(user);
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async register(data: AuthRegisterDTO) {
    // Se por acaso vier algum Role, deleta por segurança.
    // E como padrão, será cadastrado como ROLE.USER
    delete data.role;

    const user = await this.userService.create(data);

    return this.createToken(user);
  }
}
