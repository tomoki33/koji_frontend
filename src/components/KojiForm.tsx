import React, { useState, useEffect } from 'react';
import '../styles/KojiForm.css';
import { createTemperatureLog, getTemperatureLogs } from '../services/api';

interface FormData {
    cycleId: string;
    time: string;
    roomTemperature: number;
    humidity: number;
    productTemperature: number;
    comment: string;
}

const KojiForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        cycleId: '',
        time: '',
        roomTemperature: 0,
        humidity: 0,
        productTemperature: 0,
        comment: '',
    });
    const [previousCycles, setPreviousCycles] = useState<string[]>([]);
    const [isFirstEntry, setIsFirstEntry] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        const fetchTemperatureLogs = async () => {
            try {
                await getTemperatureLogs(formData.cycleId);
            } catch (error) {
                console.error('Error fetching previous cycles', error);
            }
        };
        fetchTemperatureLogs();
    }, [formData.cycleId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycle = e.target.value;
        setFormData((prevData) => ({ ...prevData, cycleId: selectedCycle }));
        setIsFirstEntry(selectedCycle === 'new');
    };

    const roundTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const roundedMinutes = Math.round(minutes / 30) * 30;
        return `${hours}:${(roundedMinutes % 60).toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const finalTime = roundTime(formData.time);
            await createTemperatureLog(formData.cycleId, { ...formData, time: finalTime });
            setSuccessMessage('温度ログが正常に送信されました！');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    const isSubmitDisabled = !(
        formData.time &&
        formData.roomTemperature > 0 &&
        formData.humidity > 0 &&
        formData.productTemperature > 0 &&
        formData.cycleId
    );

    return (
        <form onSubmit={handleSubmit}>
            <select name="cycleId" onChange={handleCycleChange} required>
                <option value="new">新しい日付を入力</option>
                <option value="test">2025/01/01~</option>
                <option value="2">2025/05/09</option>
                <option value="3">2025/05/10</option>
                <option value="4">2025/05/11</option>
                <option value="5">2025/05/12</option>
                {previousCycles.map((cycle) => (
                    <option key={cycle} value={cycle}>{cycle}</option>
                ))}
            </select>
            {isFirstEntry && (
                <input
                    type="date"
                    name="cycleId"
                    onChange={(e) => {
                        const dateValue = e.target.value;
                        setFormData((prevData) => ({ ...prevData, cycleId: dateValue }));
                    }}
                    required
                />
            )}
            <input type="time" name="time" onChange={handleChange} placeholder="時間を入力" required />
            <input type="number" name="roomTemperature" onChange={handleChange} placeholder="室温(℃)" required />
            <input type="number" name="humidity" onChange={handleChange} placeholder="湿度(%)" required />
            <input type="number" name="productTemperature" onChange={handleChange} placeholder="品温(℃)" required />
            <textarea name="comment" onChange={handleChange} placeholder="コメント"></textarea>
            <button type="submit" disabled={isSubmitDisabled}>送信</button>
            {successMessage && <div className="success-message">{successMessage}</div>}
        </form>
    );
};

export default KojiForm;