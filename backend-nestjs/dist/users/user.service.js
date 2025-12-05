"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor() {
        this.users = [];
    }
    async createDefaultAdminIfNotExists(email, password) {
        const exists = this.users.find(u => u.email === email);
        if (!exists) {
            const hash = await bcrypt.hash(password, 10);
            this.users.push({ email, passwordHash: hash, role: 'admin' });
            console.log('Admin user created:', email);
        }
    }
    async validateUser(email, password) {
        const u = this.users.find(x => x.email === email);
        if (!u)
            return null;
        const ok = await bcrypt.compare(password, u.passwordHash);
        return ok ? { email: u.email, role: u.role } : null;
    }
    // For demo: return all users (no persistence)
    async list() {
        return this.users.map(u => ({ email: u.email, role: u.role }));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
