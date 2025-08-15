// src/pages/ConverterPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Card from '../components/atoms/Card.jsx';
import Input from '../components/atoms/Input.jsx';
import Label from '../components/atoms/Label.jsx';
import Spinner from '../components/atoms/Spinner.jsx';
import Button from '../components/atoms/Button.jsx';
import { currencyConverterService } from '../services/currencyConverterService.js';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import CurrencyConversionList from '../components/organisms/CurrencyConversionList.jsx';
import ConfirmDeleteModal from '../components/organisms/ConfirmDeleteModal.jsx';

const ConverterPage = () => {
    const [rates, setRates] = useState({});
    const [currencies, setCurrencies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [history, setHistory] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await currencyConverterService.getHistory();
            setHistory(response.data.history);
        } catch (err) {
            console.error("Could not fetch conversion history");
        }
    }, []);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await currencyConverterService.getCurrencyRates();
                const allRates = { ...response.data.rates, [response.data.base]: 1 };
                setRates(allRates);
                setCurrencies(Object.keys(allRates).sort());
                await fetchHistory();
            } catch (err) {
                setError('Could not load currency data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRates();
    }, [fetchHistory]);

    const convertedAmount = useMemo(() => {
        if (!rates[fromCurrency] || !rates[toCurrency] || !amount) return 0;
        const amountInUsd = parseFloat(amount) / rates[fromCurrency];
        const result = amountInUsd * rates[toCurrency];
        return result;
    }, [amount, fromCurrency, toCurrency, rates]);

    // Save conversion to history when the result changes
    useEffect(() => {
        if (convertedAmount > 0) {
            const timer = setTimeout(() => {
                currencyConverterService.saveConversion({
                    amount: parseFloat(amount),
                    fromCurrency,
                    toCurrency,
                    result: convertedAmount
                }).then(() => fetchHistory());
            }, 1500); // Debounce to avoid saving on every keystroke
            return () => clearTimeout(timer);
        }
    }, [convertedAmount, amount, fromCurrency, toCurrency, fetchHistory]);

    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handleDeleteClick = (id, name) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete.id) return;
        setIsDeleting(true);
        try {
            await currencyConverterService.deleteHistory(itemToDelete.id);
            await fetchHistory();
        } catch (error) {
            console.error("Failed to delete history item", error);
        } finally {
            setShowDeleteModal(false);
            setItemToDelete({ id: null, name: '' });
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center bg-destructive text-destructive-foreground p-4 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-primary-text">Currency Converter</h1>
            <p className="text-muted-foreground mb-8">Get real-time exchange rates and track your history.</p>

            <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                    <div className="md:col-span-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" />
                    </div>
                    <div className="md:col-span-1">
                        <Label htmlFor="from">From</Label>
                        <select id="from" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="hidden md:flex justify-center items-end pb-2">
                        <Button variant="ghost" className="p-2" onClick={handleSwapCurrencies}>
                            <ArrowsRightLeftIcon className="h-6 w-6 text-primary" />
                        </Button>
                    </div>
                    <div className="md:col-span-1">
                        <Label htmlFor="to">To</Label>
                        <select id="to" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-muted-foreground">{amount || 0} {fromCurrency} =</p>
                    <p className="text-4xl font-bold text-primary mt-2">{convertedAmount.toFixed(4)} {toCurrency}</p>
                    <p className="text-xs text-muted-foreground mt-2">Rates are based on USD and updated periodically.</p>
                </div>
            </Card>

            <CurrencyConversionList history={history} onDeleteClick={handleDeleteClick} />

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete.name}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default ConverterPage;