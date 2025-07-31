// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import ShortURLPage from './pages/ShortURLPage';
import BackgroundRemoverPage from './pages/BackgroundRemoverPage';
import QRCodeGeneratorPage from './pages/QRCodeGeneratorPage';
import FileCompressorPage from './pages/FileCompressionPage';
import FileConverterPage from './pages/FileConverterPage';
import DocumentSummarizerPage from './pages/SummarizeDocumentPage';
import PasswordManagerPage from './pages/PasswordManagerPage';
import SharedPasswordPage from './pages/SharedPasswordPage';
import CurrencyConverterPage from './pages/CurrencyConverterPage';
import GrammarCheckerPage from './pages/GrammarCheckerPage';
import TextDiffPage from './pages/TextDiffPage';
import VoiceToTextPage from './pages/VoiceToTextPage';
import ColorToolsPage from './pages/ColorToolsPage';
import TemporaryEmailPage from './pages/TemporaryEmailPage';
import MetadataInspectorPage from './pages/MetadataInspectorPage';
import FakeDataGeneratorPage from './pages/FakeDataGeneratorPage';
import RegexTesterPage from './pages/RegexTesterPage';
import { BASE_ROUTE, ROUTES } from './constants';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes with Main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={BASE_ROUTE + ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={BASE_ROUTE + ROUTES.URL_SHORTENER} element={<ShortURLPage />} />
            <Route path={BASE_ROUTE + ROUTES.FILE_COMPRESSOR} element={<FileCompressorPage />} />
            <Route path={BASE_ROUTE + ROUTES.FILE_CONVERTER} element={<FileConverterPage />} />
            <Route path={BASE_ROUTE + ROUTES.BACKGROUND_REMOVER} element={<BackgroundRemoverPage />} />
            <Route path={BASE_ROUTE + ROUTES.QR_CODE_GENERATOR} element={<QRCodeGeneratorPage />} />
            <Route path={BASE_ROUTE + ROUTES.DOCUMENT_SUMMARIZER} element={<DocumentSummarizerPage />} />
            <Route path={BASE_ROUTE + ROUTES.PASSWORD_MANAGER} element={<PasswordManagerPage />} />
            <Route path={ROUTES.SHARED_PASSWORD} element={<SharedPasswordPage />} />
            <Route path={BASE_ROUTE + ROUTES.CURRENCY_CONVERTER} element={<CurrencyConverterPage />} />
            <Route path={BASE_ROUTE + ROUTES.GRAMMAR_CHECKER} element={<GrammarCheckerPage />} />
            <Route path={BASE_ROUTE + ROUTES.TEXT_DIFF} element={<TextDiffPage />} />
            <Route path={BASE_ROUTE + ROUTES.VOICE_TO_TEXT} element={<VoiceToTextPage />} />
            <Route path={BASE_ROUTE + ROUTES.COLOR_TOOLS} element={<ColorToolsPage />} />
            <Route path={BASE_ROUTE + ROUTES.TEMP_EMAIL} element={<TemporaryEmailPage />} />
            <Route path={BASE_ROUTE + ROUTES.METADATA_INSPECTOR} element={<MetadataInspectorPage />} />
            <Route path={BASE_ROUTE + ROUTES.FAKE_DATA_GENERATOR} element={<FakeDataGeneratorPage />} />
            <Route path={BASE_ROUTE + ROUTES.REGEX_TESTER} element={<RegexTesterPage />} />
          </Route>
        </Route>

        {/* Fallback route now correctly points to the main dashboard */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </Router>
  );
}

export default App;