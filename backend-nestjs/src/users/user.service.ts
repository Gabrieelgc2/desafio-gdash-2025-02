import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface User {
  email: string;
  passwordHash: string;
  role: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async createDefaultAdminIfNotExists(email: string, password: string) {
    const exists = this.users.find(u => u.email === email);
    if (!exists) {
      const hash = await bcrypt.hash(password, 10);
      this.users.push({ email, passwordHash: hash, role: 'admin' });
      console.log('Admin user created:', email);
    }
  }

  async validateUser(email: string, password: string) {
    const u = this.users.find(x => x.email === email);
    if (!u) return null;
    const ok = await bcrypt.compare(password, u.passwordHash);
    return ok ? { email: u.email, role: u.role } : null;
  }

  // For demo: return all users (no persistence)
  async list() {
    return this.users.map(u => ({ email: u.email, role: u.role }));
  }
}
