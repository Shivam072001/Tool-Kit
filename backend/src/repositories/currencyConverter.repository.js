// src/repositories/converterHistory.repository.js

import { config } from "../config/env.js";
import currencyConverter from "../models/currencyConverter.model.js";

const { enableSoftDelete } = config;

class ConverterHistoryRepository {
    /**
     * Creates a new conversion history record.
     * @param {object} historyData - The conversion data.
     */
    async create(historyData) {
        const history = new currencyConverter(historyData);
        return await history.save();
    }

    /**
     * Finds all conversion history for a specific user.
     * @param {string} userId - The ID of the user.
     */
    async findByUserId(userId) {
        return await currencyConverter.find({ user: userId }).sort({ createdAt: -1 }).limit(20); // Limit to last 20 conversions
    }

    async deleteById(id, userId) {
        const useSoftDelete = enableSoftDelete === "true";
        const filter = { _id: id, user: userId };

        if (useSoftDelete) {
            return await currencyConverter.updateOne(filter, { deleted: true });
        } else {
            return await currencyConverter.deleteOne(filter);
        }
    }
}

export const currencyConverterRepository = new ConverterHistoryRepository();