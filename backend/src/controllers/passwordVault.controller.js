// src/controllers/passwordVault.controller.js

import { passwordVaultService } from '../services/passwordVault.service.js';

export const getVault = async (req, res, next) => {
    try {
        const vaultData = await passwordVaultService.getVault(req.user.id);
        res.status(200).json({ status: 'success', data: vaultData });
    } catch (error) {
        next(error);
    }
};

export const saveVault = async (req, res, next) => {
    try {
        const { vaultData } = req.body;
        await passwordVaultService.saveVault(req.user.id, vaultData);
        res.status(200).json({ status: 'success', message: 'Vault saved successfully.' });
    } catch (error) {
        next(error);
    }
};

// New controller for breach checking
export const checkPasswordBreach = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ status: 'fail', message: 'Password is required.' });
        }
        const result = await passwordVaultService.checkPwnedPassword(password);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
}