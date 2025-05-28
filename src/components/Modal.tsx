import React from 'react';
import '../styles/Modal.css'; // モーダルのスタイルを追加

interface ModalProps {
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
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>データ詳細</h3>
                <p><strong>日付:</strong> {data.date}</p>
                <p><strong>時間:</strong> {data.time}</p>
                <p><strong>室温:</strong> {data.roomTemperature} ℃</p>
                <p><strong>湿度:</strong> {data.humidity} %</p>
                <p><strong>品温:</strong> {data.productTemperature} ℃</p>
                <p><strong>麹菌の品種:</strong> {data.kojiType}</p>
                <p><strong>お米の品種:</strong> {data.riceType}</p>
                <p><strong>コメント:</strong> {data.comment}</p>
                <button onClick={onClose}>閉じる</button>
            </div>
        </div>
    );
};

export default Modal;
