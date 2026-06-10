"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/auth', authRoutes_1.default);
// Register routes (apply auth for protected endpoints)
app.use('/projects', authMiddleware_1.authMiddleware, projectRoutes_1.default);
app.use('/projects', authMiddleware_1.authMiddleware, taskRoutes_1.default);
exports.default = app;
