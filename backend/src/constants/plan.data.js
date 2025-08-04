import {
    SUBSCRIPTION_TIERS,
    PLAN_TYPES
} from '../constants/index.js';

export const plans = [{
    name: SUBSCRIPTION_TIERS.FREE,
    planType: PLAN_TYPES.USER,
    price: 0,
    benefits: {
        toolUsesPerDay: 2,
        llmCallsPerDay: 2,
        storageRetentionDays: 1,
        permanentStorageGB: 0,
        customApiKeys: false,
    },
}, {
    name: SUBSCRIPTION_TIERS.PRO,
    planType: PLAN_TYPES.USER,
    price: 19,
    benefits: {
        toolUsesPerDay: 20,
        llmCallsPerDay: 15,
        storageRetentionDays: 90,
        permanentStorageGB: 5,
        customApiKeys: false,
    },
}, {
    name: SUBSCRIPTION_TIERS.PRO,
    planType: PLAN_TYPES.STORAGE,
    price: 10,
    benefits: {
        toolUsesPerDay: 0,
        llmCallsPerDay: 0,
        storageRetentionDays: 150,
        permanentStorageGB: 10,
        customApiKeys: false,
    },
}, {
    name: SUBSCRIPTION_TIERS.ELITE,
    planType: PLAN_TYPES.USER,
    price: 49,
    benefits: {
        toolUsesPerDay: 999999,
        llmCallsPerDay: 50,
        storageRetentionDays: 365,
        permanentStorageGB: 20,
        customApiKeys: true,
    },
}, {
    name: SUBSCRIPTION_TIERS.ELITE,
    planType: PLAN_TYPES.STORAGE,
    price: 25,
    benefits: {
        toolUsesPerDay: 0,
        llmCallsPerDay: 25,
        storageRetentionDays: 730,
        permanentStorageGB: 50,
        customApiKeys: false,
    },
},];