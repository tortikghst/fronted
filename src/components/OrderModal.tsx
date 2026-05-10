// src/components/OrderModal.tsx
import { useState } from 'react';
import { ordersApi } from '../api/ordersApi';
import type { Equipment } from '../api/types';
import './OrderModal.css'; // создадим ниже

interface OrderModalProps {
    equipment: Equipment;
    onClose: () => void;
    onSuccess: () => void;
}

export default function OrderModal({ equipment, onClose, onSuccess }: OrderModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [eventType, setEventType] = useState('CONFERENCE');
    const [eventCity, setEventCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalPrice = equipment.price * quantity * Math.max(1, Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) || 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!startDate || !endDate || !eventCity) {
            setError('Заполните все поля');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setError('Дата окончания должна быть позже даты начала');
            return;
        }

        setLoading(true);
        try {
            await ordersApi.create({
                items: [{
                    equipmentId: equipment.id,
                    quantity,
                    startDate,
                    endDate,
                }],
                eventType,
                eventCity,
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Ошибка при создании заказа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal" onClick={e => e.stopPropagation()}>
                <button className="order-modal__close" onClick={onClose}>✕</button>

                <h2 className="order-modal__title">Арендовать: {equipment.name}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="order-modal__field">
                        <label>Количество</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <div className="order-modal__row">
                        <div className="order-modal__field">
                            <label>Дата начала</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="order-modal__field">
                            <label>Дата окончания</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                min={startDate || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div className="order-modal__field">
                        <label>Тип мероприятия</label>
                        <select value={eventType} onChange={e => setEventType(e.target.value)}>
                            <option value="CONFERENCE">Конференция</option>
                            <option value="WEDDING">Свадьба</option>
                            <option value="CONCERT">Концерт</option>
                            <option value="CORPORATE">Корпоратив</option>
                            <option value="BIRTHDAY">День рождения</option>
                            <option value="OTHER">Другое</option>
                        </select>
                    </div>

                    <div className="order-modal__field">
                        <label>Город мероприятия</label>
                        <input
                            type="text"
                            value={eventCity}
                            onChange={e => setEventCity(e.target.value)}
                            placeholder="Москва"
                            required
                        />
                    </div>

                    <div className="order-modal__total">
                        Итого: <strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong>
                    </div>

                    {error && <div className="order-modal__error">{error}</div>}

                    <button
                        type="submit"
                        className="order-modal__submit"
                        disabled={loading}
                    >
                        {loading ? 'Оформление...' : 'Подтвердить аренду'}
                    </button>
                </form>
            </div>
        </div>
    );
}