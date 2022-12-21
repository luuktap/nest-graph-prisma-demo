import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = hashSync(registerDto.password, 10);

    await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
      },
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { email },
    });

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      return false;
    }

    return user;
  }

  generateJwt(userId: number) {
    return this.jwtService.sign({ sub: userId });
  }
}
