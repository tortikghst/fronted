// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="main-layout">
            <main className="main-layout__content">
                <Outlet />
            </main>
        </div>
    );
}