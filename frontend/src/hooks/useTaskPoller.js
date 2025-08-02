// src/hooks/useTaskPoller.js

import { useState, useEffect } from 'react';
import { OPERATION_STATUSES, POLLING_INTERVAL_MS, RESPONSE_STATUS } from '../constants';
import { config } from '../config/env';

const POLLING_INTERVAL = POLLING_INTERVAL_MS;

export const useTaskPoller = (taskId, checkStatusFunction) => {
    const [status, setStatus] = useState(OPERATION_STATUSES.PROCESSING);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let intervalId;

        if (taskId) {
            setStatus(OPERATION_STATUSES.PROCESSING);
            setResult(null);
            setErrorMessage('');

            intervalId = setInterval(async () => {
                try {
                    const { data } = await checkStatusFunction(taskId);

                    if (data.status === RESPONSE_STATUS.SUCCESS || data.status === OPERATION_STATUSES.COMPLETED) {
                        setStatus(OPERATION_STATUSES.SUCCESS);
                        // Handle different result structures
                        if (data.result) {
                            setResult(data.result);
                        } else if (data.resultText) {
                            setResult(data.resultText);
                        } else if (data.resultUrl) {
                            setResult(`${config.computeServiceUrl}${data.resultUrl}`);
                        }
                        clearInterval(intervalId);
                    } else if (data.status === RESPONSE_STATUS.FAILURE || data.status === OPERATION_STATUSES.FAILED) {
                        setStatus(OPERATION_STATUSES.ERROR);
                        setErrorMessage(data.errorMessage || data.error || 'Task failed on the server.');
                        clearInterval(intervalId);
                    }
                } catch (err) {
                    setStatus(OPERATION_STATUSES.ERROR);
                    setErrorMessage('Could not retrieve job status.');
                    clearInterval(intervalId);
                }
            }, POLLING_INTERVAL);
        }

        return () => clearInterval(intervalId);
    }, [taskId, checkStatusFunction]);

    return { status, result, errorMessage, setStatus };
};