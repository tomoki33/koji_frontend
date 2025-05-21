import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../styles/HistoryChart.css';

Chart.register(...registerables);

interface ChartData {
    time: string;
    roomTemperature: number;
}

// ダミーデータ（本番ではAPIから取得）
const dummyData: ChartData[] = [
    { time: '00:00', roomTemperature: 24 },
    { time: '01:00', roomTemperature: 25 },
    { time: '02:00', roomTemperature: 26 },
];

const HistoryChart: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);

        // 実際はAPIにdateを渡してデータ取得する想定
        if (date) {
            setChartData(dummyData);
        } else {
            setChartData([]);
        }
    };

    const lineData = {
        labels: chartData.map((d) => d.time),
        datasets: [
            {
                label: '室温',
                data: chartData.map((d) => d.roomTemperature),
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
        ],
    };

    return (
        <div className="history-chart-container">
            <h2>履歴からグラフを見る</h2>

            <div className="form-group">
                <label htmlFor="date">日付を選択</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>

            {chartData.length > 0 && (
                <div className="chart-area">
                    <Line data={lineData} />
                </div>
            )}
        </div>
    );
};

export default HistoryChart;
