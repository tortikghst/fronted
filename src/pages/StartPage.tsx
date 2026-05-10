// src/pages/StartPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './StartPage.css';

export default function StartPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        navigate('/main', { replace: true });
        return null;
    }

    return (
        <div className="start-page">
            <div className="start-decor-circle" />

            <nav className="start-nav">
                <button
                    className="start-nav-btn start-nav-btn--secondary"
                    onClick={() => navigate('/login')}
                >
                    Вход
                </button>
                <button
                    className="start-nav-btn start-nav-btn--primary"
                    onClick={() => navigate('/register')}
                >
                    Регистрация
                </button>
            </nav>

            <div className="start-hero">
                <h1 className="start-title">GostEvent</h1>
                <p className="start-subtitle">Аренда оборудования для мероприятий!</p>
            </div>

            <div className="start-hero-image">
                <img src="/src/image/ehf.png" alt="Мебель для мероприятий" />
            </div>
        </div>
    );
}