import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getTemperatureLogs } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/HistoryChart.css';

Chart.register(...registerables);

interface ChartData {
    time: string;
    roomTemperature: number;
    humidity: number;
    productTemperature: number;
    comment: string;
}

const HistoryChart: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

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
        } catch (error: any) {
            handleFetchError(error);
        }
    };

    const handleFetchResponse = (data: any) => {
        if (data.length === 0) {
            setErrorMessage('該当の日付にはデータが登録されていません。');
            setChartData([]);
        } else {
            const formattedData: ChartData[] = data.map((item: any) => ({
                time: item.time,
                roomTemperature: item.roomTemperature,
                humidity: item.humidity,
                productTemperature: item.productTemperature,
                comment: item.comment,
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

    const lineData = {
        labels: chartData.map((d) => d.time),
        datasets: [
            {
                label: '室温',
                data: chartData.map((d) => d.roomTemperature),
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="history-chart-container">
            <h2>過去履歴</h2>
            <div className="form-group">
                <label htmlFor="date">日付を選択</label>
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
                        <th>時間</th>
                        <th>室温（℃）</th>
                        <th>湿度（%）</th>
                        <th>品温（℃）</th>
                        <th>コメント</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((dataPoint, index) => (
                        <tr key={index}>
                            <td>{dataPoint.time}</td>
                            <td>{dataPoint.roomTemperature}</td>
                            <td>{dataPoint.humidity}</td>
                            <td>{dataPoint.productTemperature}</td>
                            <td>{dataPoint.comment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {chartData.length > 0 && (
                <div className="chart-area">
                    <Line data={lineData} />
                </div>
            )}
        </div>
    );
};

export default HistoryChart;
