// src/pages/FakeDataGeneratorPage.jsx

import React, { useState, useCallback, useEffect } from 'react';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Label from '../components/atoms/Label';
import Input from '../components/atoms/Input';
import Spinner from '../components/atoms/Spinner';
import FakeDataDisplay from '../components/organisms/FakeDataDisplay';
import FakeDataList from '../components/organisms/FakeDataList';
import ConfirmDeleteModal from '../components/organisms/ConfirmDeleteModal';
import CustomSchemaBuilder from '../components/organisms/CustomSchemaBuilder'; // <-- Import new component
import { fakeDataService } from '../services/fakeDataService';
import { OPERATION_STATUSES } from '../constants';

const dataTypes = ['personal', 'business', 'finance', 'custom']; // <-- Add 'custom'
const locales = ['en_US', 'en_GB', 'fr_FR', 'de_DE', 'es_ES'];

const FakeDataGeneratorPage = () => {
    const [status, setStatus] = useState('idle');
    const [dataType, setDataType] = useState('personal');
    const [count, setCount] = useState(10);
    const [locale, setLocale] = useState('en_US');
    const [generatedData, setGeneratedData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [history, setHistory] = useState([]);

    const [customSchema, setCustomSchema] = useState([{ fieldName: 'id', fieldType: 'uuid4' }]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await fakeDataService.getHistory();
            setHistory(response.data.history);
        } catch (error) {
            console.error("Could not fetch generation history");
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleGenerate = async () => {
        setStatus('generating');
        setErrorMessage('');

        const options = {
            type: dataType,
            count,
            locale,
            ...(dataType === 'custom' && { customSchema }),
        };

        try {
            const response = await fakeDataService.generate(options);
            setGeneratedData(response.data);
            setStatus(OPERATION_STATUSES.SUCCESS);
            if (dataType !== 'custom') {
                await fetchHistory();
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Failed to generate data.');
            setStatus(OPERATION_STATUSES.ERROR);
        }
    };

    const handleDeleteClick = (id, name) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete.id) return;
        setIsDeleting(true);
        try {
            await fakeDataService.deleteHistory(itemToDelete.id);
            await fetchHistory();
        } catch (error) {
            console.error("Failed to delete history item", error);
        } finally {
            setShowDeleteModal(false);
            setItemToDelete({ id: null, name: '' });
            setIsDeleting(false);
        }
    };

    const loadFromHistory = (item) => {
        setDataType(item.dataType);
        setCount(item.count);
        setLocale(item.locale);
        window.scrollTo(0, 0);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Fake Data Generator</h1>
            <p className="text-muted-foreground mb-8">
                Create realistic placeholder data for your projects and mockups.
            </p>

            <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="md:col-span-1">
                        <Label htmlFor="data-type">Data Type</Label>
                        <select id="data-type" value={dataType} onChange={(e) => setDataType(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            {dataTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <Label htmlFor="count">Rows</Label>
                        <Input id="count" type="number" value={count} onChange={(e) => setCount(Math.min(500, Math.max(1, e.target.value)))} min="1" max="500" />
                    </div>
                    <div className="md:col-span-1">
                        <Label htmlFor="locale">Locale</Label>
                        <select id="locale" value={locale} onChange={(e) => setLocale(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            {locales.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <Button onClick={handleGenerate} disabled={status === 'generating'} className="w-full">
                            {status === 'generating' ? <Spinner /> : 'Generate'}
                        </Button>
                    </div>
                </div>

                {dataType === 'custom' && (
                    <CustomSchemaBuilder schema={customSchema} setSchema={setCustomSchema} />
                )}

                {status === OPERATION_STATUSES.ERROR && (
                    <p className="text-destructive text-center mt-4">{errorMessage}</p>
                )}
            </Card>

            <FakeDataDisplay data={generatedData} />

            {dataType !== 'custom' && <FakeDataList history={history} onDeleteClick={handleDeleteClick} onHistoryClick={loadFromHistory} />}

            <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} itemName={itemToDelete.name} isLoading={isDeleting} />
        </div>
    );
};

export default FakeDataGeneratorPage;