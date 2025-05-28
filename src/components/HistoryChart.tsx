import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getTemperatureLogs, getCycleLog } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/HistoryChart.css';
import Modal from './Modal';
import EditModal from './EditModal';

Chart.register(...registerables);

interface ChartData {
    date: string;
    time: string;
    roomTemperature: number;
    humidity: number;
    productTemperature: number;
    comment: string;
    kojiType: string; // 麹菌の品種
    riceType: string; // お米の品種
}

const HistoryChart: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [modalData, setModalData] = useState<ChartData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<ChartData | null>(null);
    const [cycleId, setCycleId] = useState<string | null>(null);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        setChartData([]); // Clear previous data
        if (date) {
            fetchTemperatureData(date);
        } else {
            setErrorMessage('');
        }
    };

    const fetchTemperatureData = async (date: string) => {
        try {
            const response = await getTemperatureLogs(date);
            handleFetchResponse(response.data);
            if (response.data.length > 0) {
                const latestData = response.data[0];
                setFormData({
                    date: latestData.date,
                    time: latestData.time,
                    roomTemperature: latestData.roomTemperature,
                    humidity: latestData.humidity,
                    productTemperature: latestData.productTemperature,
                    comment: latestData.comment,
                    kojiType: latestData.kojiType,
                    riceType: latestData.riceType,
                });
            }
        } catch (error: any) {
            handleFetchError(error);
        }
    };

    const handleFetchResponse = (data: any) => {
        if (data.length === 0) {
            setErrorMessage('該当の日付にはデータが登録されていません。');
            setChartData([]);
        } else {
            // SKの値をcycleIdとして保存
            const cycleIdValue = data[0].SK.split('#')[1]; // 最初のアイテムからSKを取得
            setCycleId(cycleIdValue); // cycleIdに保存

            const formattedData: ChartData[] = data.map((item: any) => ({
                date: item.date,
                time: item.time,
                roomTemperature: item.roomTemperature,
                humidity: item.humidity,
                productTemperature: item.productTemperature,
                comment: item.comment,
                kojiType: item.kojiType, // 麹菌の品種
                riceType: item.riceType, // お米の品種
            }));
            setChartData(formattedData);
            setErrorMessage('');
        }
    };

    const handleFetchError = (error: any) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            navigate('/');
        }
        console.error('Error fetching temperature data', error);
        setErrorMessage('該当の日付にはデータが登録されていません。');
    };

    const lineDataRoomTemperature = {
        labels: chartData.map((d) => d.time),
        datasets: [
            {
                label: '室温（℃）',
                data: chartData.map((d) => d.roomTemperature),
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const lineDataProductTemperature = {
        labels: chartData.map((d) => d.time),
        datasets: [
            {
                label: '品温（℃）',
                data: chartData.map((d) => d.productTemperature),
                borderColor: 'rgba(255,152,0,1)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const lineDataHumidity = {
        labels: chartData.map((d) => d.time),
        datasets: [
            {
                label: '湿度（%）',
                data: chartData.map((d) => d.humidity),
                borderColor: 'rgba(76,175,80,1)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const openModal = async (data: ChartData) => {
        if (cycleId) {
            try {
                const response = await getCycleLog(cycleId, data.date, data.time);
                const cycleLogData = response.data;

                setModalData(cycleLogData);
                setIsModalOpen(true);
            } catch (error: any) {
                console.error('Error fetching cycle log:', error);
                setErrorMessage('サイクルログの取得中にエラーが発生しました。');
                if (error.response && error.response.status === 401) {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    navigate('/');
                }
            }
        } else {
            setErrorMessage('Cycle ID is not available.');
        }
    };

    const openEditModal = async (data: ChartData) => {
        // Set the formData based on the selected data point
        setFormData(data);

        // Ensure cycleId is set correctly from the current state
        if (cycleId) {
            await fetchTemperatureData(data.date); // Fetch temperature data if needed
            setIsEditModalOpen(true); // Open the edit modal
        } else {
            setErrorMessage('Cycle ID is not available.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setModalData(null);
    };

    const handleSave = (updatedData: ChartData) => {
        setChartData((prevData) =>
            prevData.map((item) =>
                item.date === updatedData.date && item.time === updatedData.time ? updatedData : item
            )
        );
        closeEditModal();
    };

    const onSave = async () => {
        if (cycleId) {
            await fetchTemperatureData(cycleId); // 最新のデータを取得
        }
    };

    return (
        <div className="history-chart-container">
            <h2>過去履歴</h2>
            <div className="form-group">
                <label htmlFor="date">開始日付を選択</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <table className="data-table">
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>時間</th>
                        <th>データ詳細</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((dataPoint, index) => (
                        <tr key={index}>
                            <td>{dataPoint.date}</td>
                            <td>{dataPoint.time}</td>
                            <td>
                                <button onClick={() => openModal(dataPoint)}>詳細を見る</button>
                                <button className="edit-button" onClick={() => openEditModal(dataPoint)}>編集</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {chartData.length > 0 && (
                <div className="chart-area">
                    <h3>室温チャート</h3>
                    <Line data={lineDataRoomTemperature} />
                    <h3>品温チャート</h3>
                    <Line data={lineDataProductTemperature} />
                    <h3>湿度チャート</h3>
                    <Line data={lineDataHumidity} />
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={closeModal} data={modalData} />
            <EditModal isOpen={isEditModalOpen} onClose={closeEditModal} data={formData} cycleId={cycleId} onSave={onSave} />
        </div>
    );
};

export default HistoryChart;
