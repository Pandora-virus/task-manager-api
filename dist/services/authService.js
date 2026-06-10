"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const JWT_SECRET = process.env.JWT_SECRET || 'secret-dev';
exports.authService = {
    async register(data) {
        const { name, email, password } = data;
        if (!name)
            throw new Error('Nome é obrigatório');
        if (!email)
            throw new Error('Email é obrigatório');
        if (!password)
            throw new Error('Senha é obrigatória');
        const existingUser = await userRepository_1.userRepository.findByEmail(email);
        if (existingUser)
            throw new Error('Email já cadastrado');
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await userRepository_1.userRepository.create({ name, email, password: hashedPassword });
        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    },
    async login(data) {
        const { email, password } = data;
        if (!email)
            throw new Error('Email é obrigatório');
        if (!password)
            throw new Error('Senha é obrigatória');
        const user = await userRepository_1.userRepository.findByEmail(email);
        if (!user)
            throw new Error('Email ou senha inválidos');
        const passwordMatches = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatches)
            throw new Error('Email ou senha inválidos');
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h'
        });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
};
