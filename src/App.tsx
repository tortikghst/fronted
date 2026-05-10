// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Публичные */}
                    <Route path="/start" element={<StartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Защищённые */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
                    </Route>

                    {/* Редиректы */}
                    <Route path="/" element={<Navigate to="/start" replace />} />
                    <Route path="*" element={<Navigate to="/start" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;