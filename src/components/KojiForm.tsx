import React, { useState, useEffect } from 'react';
import '../styles/KojiForm.css';
import { createTemperatureLog,getTemperatureLogs } from '../services/api';

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
    const [dateInput, setDateInput] = useState<string>('');

    useEffect(() => {
            try {
            //ユーザIDを使用して温度ログを取得  
                getTemperatureLogs(formData.cycleId)
            } catch (error) {
                console.error('Error fetching previous cycles', error);
            }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCycle = e.target.value;
        setFormData({ ...formData, cycleId: selectedCycle });
        setIsFirstEntry(selectedCycle === 'new'); // 'new'を選択した場合は初回入力
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            createTemperatureLog(formData.cycleId, formData)
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    // 送信ボタンの活性化条件
    const isSubmitDisabled = !(
        formData.time &&
        formData.roomTemperature > 0 && // 0より大きいことを確認
        formData.humidity > 0 && // 0より大きいことを確認
        formData.productTemperature > 0 && // 0より大きいことを確認
        formData.cycleId
    );

    return (
        <form onSubmit={handleSubmit}>
            <select name="cycleId" onChange={handleCycleChange} required>
                <option value="new">新しい日付を入力</option>
                <option value="test">2025/01/01~</option>
                <option value="test2">2025/05/09</option>
                <option value="test3">2025/05/10</option>
                <option value="test4">2025/05/11</option>
                <option value="test5">2025/05/12</option>
                {previousCycles.map((cycle) => (
                    <option key={cycle} value={cycle}>{cycle}</option>
                ))}
            </select>
            {isFirstEntry && (
                <input
                    type="date"
                    name="cycleId"
                    onChange={(e) => {
                        setDateInput(e.target.value);
                        setFormData({ ...formData, cycleId: e.target.value }); // cycleIdに日付を設定
                    }}
                    required
                />
            )}
            <input type="text" name="time" onChange={handleChange} placeholder="時間" required />
            <input type="number" name="roomTemperature" onChange={handleChange} placeholder="室温" required />
            <input type="number" name="humidity" onChange={handleChange} placeholder="湿度" required />
            <input type="number" name="productTemperature" onChange={handleChange} placeholder="品温" required />
            <textarea name="comment" onChange={handleChange} placeholder="コメント"></textarea>
            <button type="submit" disabled={isSubmitDisabled}>送信</button>
        </form>
    );
};

export default KojiForm;