"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
exports.userRepository = {
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({ where: { email } });
    },
    async create(data) {
        return prisma_1.default.user.create({ data });
    }
};
