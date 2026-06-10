"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
exports.taskRepository = {
    async findByProject(projectId) {
        return prisma_1.default.task.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });
    },
    async findById(id) {
        return prisma_1.default.task.findUnique({ where: { id } });
    },
    async create(data) {
        return prisma_1.default.task.create({ data });
    },
    async update(id, data) {
        return prisma_1.default.task.update({ where: { id }, data });
    },
    async delete(id) {
        return prisma_1.default.task.delete({ where: { id } });
    }
};
