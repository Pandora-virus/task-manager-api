"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
exports.authController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await authService_1.authService.register({ name, email, password });
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService_1.authService.login({ email, password });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
