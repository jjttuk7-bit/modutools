import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './layout/MainLayout';
import HomePage from './routes/HomePage';
import PrivacyPage from './routes/PrivacyPage';
import GuidePage from './routes/GuidePage';
import AboutPage from './routes/AboutPage';
import TermsPage from './routes/TermsPage';
import BusinessHome from './routes/business/BusinessHome';
import BusinessToolPage from './routes/business/BusinessToolPage';
import QrHome from './routes/qr/QrHome';
import QrToolPage from './routes/qr/QrToolPage';
import SubmitHome from './routes/submit/SubmitHome';
import SubmitToolPage from './routes/submit/SubmitToolPage';
import ThumbnailHome from './routes/thumbnail/ThumbnailHome';
import ThumbnailToolPage from './routes/thumbnail/ThumbnailToolPage';
import ImageHome from './routes/image/ImageHome';
import ImageToolPage from './routes/image/ImageToolPage';
import ExcelHome from './routes/excel/ExcelHome';
import ExcelToolPage from './routes/excel/ExcelToolPage';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<Navigate to="/" replace />} />

          <Route path="business">
            <Route index element={<BusinessHome />} />
            <Route path=":toolId" element={<BusinessToolPage />} />
          </Route>

          <Route path="qr">
            <Route index element={<QrHome />} />
            <Route path=":toolId" element={<QrToolPage />} />
          </Route>

          <Route path="submit">
            <Route index element={<SubmitHome />} />
            <Route path=":toolId" element={<SubmitToolPage />} />
          </Route>

          <Route path="thumbnail">
            <Route index element={<ThumbnailHome />} />
            <Route path=":toolId" element={<ThumbnailToolPage />} />
          </Route>

          <Route path="image">
            <Route index element={<ImageHome />} />
            <Route path=":toolId" element={<ImageToolPage />} />
          </Route>

          <Route path="excel">
            <Route index element={<ExcelHome />} />
            <Route path=":toolId" element={<ExcelToolPage />} />
          </Route>

          <Route path="mask" element={<Navigate to="/submit/pdf-mask" replace />} />

          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="terms" element={<TermsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
