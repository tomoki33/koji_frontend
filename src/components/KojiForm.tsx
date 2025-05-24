import React, { useState } from 'react';
import '../styles/KojiForm.css';
import { createTemperatureLog, getLatestTemperatureLog } from '../services/api';

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
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [latestLog, setLatestLog] = useState<any>(null);
    const [isPastDateSelected, setIsPastDateSelected] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCycleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycle = e.target.value;
        setFormData((prevData) => ({ ...prevData, cycleId: selectedCycle }));

        if (selectedCycle === 'test') {
            setIsPastDateSelected(true);
            try {
                const latestLogResponse = await getLatestTemperatureLog();
                const latestCycleId = latestLogResponse.data.SK.split('#')[1];
                setLatestLog(latestCycleId);
                setFormData((prevData) => ({ ...prevData, cycleId: latestCycleId }));
            } catch (error) {
                console.error('Error fetching latest temperature log', error);
            }
        } else {
            setIsPastDateSelected(false);
            setLatestLog(null);
        }
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
                <option value="test">最新日付から選択</option>
            </select>

            {isPastDateSelected && latestLog ? (
                <input
                    type="text"
                    value={latestLog}
                    readOnly
                />
            ) : (
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