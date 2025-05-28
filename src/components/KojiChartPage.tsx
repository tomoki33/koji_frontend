import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getTemperatureLogs, getLatestTemperatureLog } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/KojiChartPage.css';

Chart.register(...registerables);

interface ChartData {
    time: string;
    roomTemperature: number;
    productTemperature: number;
    humidity: number;
}

const KojiChartPage: React.FC = () => {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [cycleId, setCycleId] = useState<string>('');

    useEffect(() => {
        const fetchTemperatureData = async () => {
            try {
                const latestResponse = await getLatestTemperatureLog();
                const response = await getTemperatureLogs(latestResponse.data.SK.split('#')[1]);
                const data = response.data;

                const cycleId = data[0].SK.split('#')[1];
                setCycleId(cycleId);

                const formattedData: ChartData[] = data.map((item: any) => ({
                    time: item.time,
                    roomTemperature: item.roomTemperature,
                    productTemperature: item.productTemperature,
                    humidity: item.humidity,
                }));

                setChartData(formattedData);
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    navigate('/');
                }
                console.error('Error fetching temperature data', error);
            }
        };

        fetchTemperatureData();
    }, [navigate]);

    const lineDataRoomTemperature = {
        labels: chartData.map(d => d.time),
        datasets: [
            {
                label: '室温（℃）',
                data: chartData.map(d => d.roomTemperature),
                borderColor: '#00bcd4',
                backgroundColor: 'rgba(0,188,212,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const lineDataProductTemperature = {
        labels: chartData.map(d => d.time),
        datasets: [
            {
                label: '品温（℃）',
                data: chartData.map(d => d.productTemperature),
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255,152,0,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const lineDataHumidity = {
        labels: chartData.map(d => d.time),
        datasets: [
            {
                label: '湿度（%）',
                data: chartData.map(d => d.humidity),
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76,175,80,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    return (
        <div className="latest-chart-container">
            <h2>最新のチャート</h2>

            <div className="info-header">
                <div><strong>日付：</strong>{cycleId || '（未入力）'}</div>
            </div>

            <div className="chart-area">
                <h3>室温チャート</h3>
                <Line data={lineDataRoomTemperature} />
                <h3>品温チャート</h3>
                <Line data={lineDataProductTemperature} />
                <h3>湿度チャート</h3>
                <Line data={lineDataHumidity} />
            </div>
        </div>
    );
};

export default KojiChartPage;
