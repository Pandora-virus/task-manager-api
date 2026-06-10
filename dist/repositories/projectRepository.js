"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
exports.projectRepository = {
    async findAll(userId) {
        return prisma_1.default.project.findMany({
            where: { userId },
            include: { tasks: true },
            orderBy: { createdAt: 'desc' }
        });
    },
    async findById(id) {
        return prisma_1.default.project.findUnique({
            where: { id },
            include: { tasks: true }
        });
    },
    async create(data) {
        return prisma_1.default.project.create({ data });
    },
    async update(id, data) {
        return prisma_1.default.project.update({ where: { id }, data });
    },
    async delete(id) {
        return prisma_1.default.project.delete({ where: { id } });
    }
};
