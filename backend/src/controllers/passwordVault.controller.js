import { passwordVaultService } from '../services/passwordVault.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getVault = async (req, res, next) => {
    try {
        const vaultData = await passwordVaultService.getVault(req.user.id);
        res.status(200).json(new ApiResponse(200, vaultData));
    } catch (error) {
        next(error);
    }
};

export const saveVault = async (req, res, next) => {
    try {
        const { vaultData } = req.body;
        await passwordVaultService.saveVault(req.user.id, vaultData);
        res.status(200).json(new ApiResponse(200, null, 'Vault saved successfully.'));
    } catch (error) {
        next(error);
    }
};

// New controller for breach checking
export const checkPasswordBreach = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json(new ApiResponse(400, null, 'Password is required.'));
        }
        const result = await passwordVaultService.checkPwnedPassword(password);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
}