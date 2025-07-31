// src/services/fileService.js
import axiosInstance from "../lib/axiosInstance";

export const textService = {
    uploadForSummarization: async (file, onUploadProgress) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post(
            "/text/summarize-document",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress,
            }
        );
        return response.data;
    },

    /**
     * (New method)
     */
    submitForGrammarCheck: async (text) => {
        const response = await axiosInstance.post("/text/check-grammar", { text });
        return response.data;
    },

    /**
     * Checks the status of a compression task.
     * @param {string} taskId - The ID of the task to check.
     */
    checkJobStatus: async (taskId) => {
        const response = await axiosInstance.get(`/text/status/${taskId}`);
        return response.data;
    },

    delete: async (id) => {
        return await axiosInstance.delete(`/text/${id}`);
    },
};
