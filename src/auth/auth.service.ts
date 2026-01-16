import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const passMatch = await bcrypt.compare(password, user.password as string);
    if (!passMatch) throw new UnauthorizedException('Invalid Credentials');

    const token = await this.jwtService.signAsync({ id: user.id });

    return { token };
  }

  async register({ email, name, password }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);
    if (user) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await this.userService.createUser({
      email,
      password: hashedPassword,
      name,
    });

    delete newUser.password;

    return { user: newUser };
  }
}
