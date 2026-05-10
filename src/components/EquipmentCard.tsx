// src/components/EquipmentCard.tsx
import { useNavigate } from 'react-router-dom';
import type { Equipment } from '../api/types';
import './EquipmentCard.css';

interface EquipmentCardProps {
    equipment: Equipment;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
    const navigate = useNavigate();

    // Функция для получения URL изображения
    const getImageUrl = () => {
        if (!equipment.images) return '/src/image/ehf.png';
        
        // Если images - строка (как в вашем API)
        if (typeof equipment.images === 'string') {
            return equipment.images;
        }
        
        // Если images - массив (на будущее)
        if (Array.isArray(equipment.images) && equipment.images.length > 0) {
            return equipment.images[0];
        }
        
        return '/src/image/ehf.png';
    };

    return (
        <div
            className="equipment-card"
            onClick={() => navigate(`/equipment/${equipment.id}`)}
        >
            <div className="equipment-card__image-wrapper">
                <img
                    src={getImageUrl()}
                    alt={equipment.name}
                    className="equipment-card__image"
                    onError={(e) => {
                        // Если изображение не загрузилось, подставляем заглушку
                        (e.target as HTMLImageElement).src = '/src/image/ehf.png';
                    }}
                />
                {equipment.deliveryAvailable && (
                    <span className="equipment-card__badge">Доставка</span>
                )}
            </div>
            <div className="equipment-card__body">
                <h3 className="equipment-card__name">{equipment.name}</h3>
                <p className="equipment-card__city">📍 {equipment.city}</p>
                <div className="equipment-card__footer">
                    <span className="equipment-card__price">
                        {equipment.price.toLocaleString('ru-RU')} ₽<span>/день</span>
                    </span>
                    {equipment.category && typeof equipment.category === 'object' && (
                        <span className="equipment-card__category">{equipment.category.name}</span>
                    )}
                </div>
            </div>
        </div>
    );
}