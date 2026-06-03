import { Navigate, Route, Routes } from 'react-router-dom';
import LoginSelector from './components/LoginSelector.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import { useUserEmail } from './state/userEmail.js';

export default function App() {
  const userEmail = useUserEmail();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/documents" replace />} />
      <Route
        path="/documents"
        element={userEmail ? <DocumentsPage /> : <LoginSelector />}
      />
      <Route
        path="/documents/:id"
        element={userEmail ? <EditorPage /> : <LoginSelector />}
      />
      <Route path="*" element={<Navigate to="/documents" replace />} />
    </Routes>
  );
}

