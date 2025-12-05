import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user.service';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private usersService: UsersService) {}

  async validateUser(email: string, pass: string) {
    return this.usersService.validateUser(email, pass);
  }

  async login(user: any) {
    const payload = { email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }
}
