import React, { useState, useEffect } from 'react';
import '../styles/Modal.css'; // モーダルのスタイルを追加
import { updateTemperatureLog, getTemperatureLogs } from '../services/api';
import { useNavigate } from 'react-router-dom';


interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        date: string;
        time: string;
        roomTemperature: number;
        humidity: number;
        productTemperature: number;
        comment: string;
        kojiType: string; // 麹菌の品種
        riceType: string; // お米の品種
    } | null;
    cycleId: string | null;
    onSave: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, data, cycleId, onSave }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        roomTemperature: 0,
        humidity: 0,
        productTemperature: 0,
        comment: '',
        kojiType: '',
        riceType: '',
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // dataが変更されたときにformDataを更新
    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    // Success message auto-clear effect
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000); // 3秒後にメッセージを消す

            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [successMessage]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (cycleId) {
                await updateTemperatureLog(cycleId, formData);
                setSuccessMessage('データが正常に保存されました。');
                onSave();
            }
        } catch (error: any) {
            console.error('Cycle ID is not available.');
            if (error.response && error.response.status === 401) {
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                navigate('/');
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>データ編集</h3>
                <form onSubmit={handleSubmit}>
                    <label>日付:</label>
                    <input type="text" value={formData.date} readOnly />
                    <label>時間:</label>
                    <input type="text" name="time" value={formData.time} readOnly />
                    <label>室温:</label>
                    <input type="number" name="roomTemperature" value={formData.roomTemperature} onChange={handleChange} required />
                    <label>湿度:</label>
                    <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} required />
                    <label>品温:</label>
                    <input type="number" name="productTemperature" value={formData.productTemperature} onChange={handleChange} required />
                    <label>麹菌の品種:</label>
                    <input type="text" name="kojiType" value={formData.kojiType} onChange={handleChange} required />
                    <label>お米の品種:</label>
                    <input type="text" name="riceType" value={formData.riceType} onChange={handleChange} required />
                    <label>コメント:</label>
                    <textarea name="comment" value={formData.comment} onChange={handleChange}></textarea>
                    <button type="submit">保存</button>
                </form>
                {successMessage && <div className="success-message">{successMessage}</div>}
                <button className="close-button" onClick={onClose}>閉じる</button>
            </div>
        </div>
    );
};

export default EditModal;
