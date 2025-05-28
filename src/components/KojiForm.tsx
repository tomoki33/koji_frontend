import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/KojiForm.css';
import { createTemperatureLog, getLatestTemperatureLog } from '../services/api';

interface FormData {
    cycleId: string;
    date: string;
    time: string;
    kojiType: string;
    riceType: string;
    roomTemperature: number;
    humidity: number;
    productTemperature: number;
    comment: string;
}

const KojiForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        cycleId: '',
        date: '',
        time: '',
        kojiType: '',
        riceType: '',
        roomTemperature: 0,
        humidity: 0,
        productTemperature: 0,
        comment: '',
    });
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [latestLog, setLatestLog] = useState<string | null>(null);
    const [isPastDateSelected, setIsPastDateSelected] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isNewKojiSelected, setIsNewKojiSelected] = useState<boolean>(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCycleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycle = e.target.value;
        setFormData((prevData) => ({ ...prevData, cycleId: selectedCycle }));
        setSelectedDate('');

        if (selectedCycle === 'new') {
            setIsNewKojiSelected(true);
            resetLogSelection();
        } else {
            setIsNewKojiSelected(false);
            if (selectedCycle === 'test') {
                const latestDate = await fetchLatestLog();
                if (latestDate) {
                    setSelectedDate(latestDate);
                    setFormData((prevData) => ({ ...prevData, cycleId: latestDate }));
                }
            } else {
                resetLogSelection();
            }
        }
    };

    const fetchLatestLog = async () => {
        setIsPastDateSelected(true);
        try {
            const latestLogResponse = await getLatestTemperatureLog();
            const latestCycleId = latestLogResponse.data.SK.split('#')[1];
            setLatestLog(latestCycleId);
            return latestCycleId;
        } catch (error) {
            handleApiError(error);
            return null;
        }
    };

    const resetLogSelection = () => {
        setIsPastDateSelected(false);
        setLatestLog(null);
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
        } catch (error: any) {
            handleApiError(error);
        }
    };

    const handleApiError = (error: any) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            navigate('/');
        }
        console.error('Error submitting form', error);
    };

    const isSubmitDisabled = !(
        formData.time &&
        formData.roomTemperature > 0 &&
        formData.humidity > 0 &&
        formData.productTemperature > 0 &&
        formData.cycleId &&
        formData.kojiType &&
        formData.riceType
    );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value;
        setFormData((prevData) => ({ ...prevData, cycleId: dateValue, date: dateValue }));
        setSelectedDate(dateValue);
    };

    const generateDateOptions = () => {
        if (!selectedDate) return [];

        const options = [];
        const startDate = new Date(selectedDate);

        if (isNaN(startDate.getTime())) {
            console.error('Invalid start date:', selectedDate);
            return [];
        }

        options.push({
            value: startDate.toISOString().split('T')[0],
            label: `${startDate.toLocaleDateString()}`,
        });

        for (let i = 1; i <= 2; i++) {
            const nextDate = new Date(startDate);
            nextDate.setDate(startDate.getDate() + i);
            options.push({
                value: nextDate.toISOString().split('T')[0],
                label: `${nextDate.toLocaleDateString()}`,
            });
        }
        return options;
    };

    return (
        <form onSubmit={handleSubmit}>
            <select name="cycleId" onChange={handleCycleChange} required>
                <option value="new">新しい麹を作成</option>
                <option value="test">作成途中のものから選択</option>
            </select>

            {isPastDateSelected && latestLog ? (
                <div>
                    <label>開始日付:</label>
                    <input type="text" value={latestLog} readOnly />
                </div>
            ) : (
                <div>
                    <label htmlFor="date">開始日付:</label>
                    <input
                        type="date"
                        name="cycleId"
                        value={selectedDate}
                        onChange={handleDateChange}
                        required
                    />
                </div>
            )}

            {!isNewKojiSelected && (
                <>
                    <label htmlFor="day">日付選択:</label>
                    <select name="day" required onChange={(e) => setFormData((prevData) => ({ ...prevData, date: e.target.value }))}>
                        {generateDateOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </>
            )}

            <label htmlFor="time">時間:</label>
            <input type="time" name="time" onChange={handleChange} placeholder="時間を入力" required />
            <label htmlFor="kojiType">麹菌の品種:</label>
            <input
                type="text"
                name="kojiType"
                onChange={handleChange}
                placeholder="麹菌の品種を入力"
                required
            />

            <label htmlFor="riceType">お米の品種:</label>
            <input
                type="text"
                name="riceType"
                onChange={handleChange}
                placeholder="お米の品種を入力"
                required
            />

            <label htmlFor="roomTemperature">室温:</label>
            <input
                type="number"
                name="roomTemperature"
                onChange={handleChange}
                placeholder="(℃)"
                step="0.1"
                required
            />

            <label htmlFor="humidity">湿度:</label>
            <input
                type="number"
                name="humidity"
                onChange={handleChange}
                placeholder="(%)"
                step="0.1"
                required
            />

            <label htmlFor="productTemperature">品温:</label>
            <input
                type="number"
                name="productTemperature"
                onChange={handleChange}
                placeholder="(℃)"
                step="0.1"
                required
            />


            <label htmlFor="comment">コメント:</label>
            <textarea name="comment" onChange={handleChange} placeholder="記入してください"></textarea>

            <button type="submit" disabled={isSubmitDisabled}>送信</button>
            {successMessage && <div className="success-message">{successMessage}</div>}
        </form>
    );
};

export default KojiForm;