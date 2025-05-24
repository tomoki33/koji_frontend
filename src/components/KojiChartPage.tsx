import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getTemperatureLogs } from '../services/api'; // APIからデータを取得する関数をインポート
import '../styles/KojiChartPage.css';

Chart.register(...registerables);

interface ChartData {
    time: string;
    roomTemperature: number;
}

const KojiChartPage: React.FC = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [comment, setComment] = useState<string>('');
    const [cycleId, setCycleId] = useState<string>('');

    useEffect(() => {
        const fetchTemperatureData = async () => {
            try {
                const response = await getTemperatureLogs('test');
                const data = response.data; 
                console.log(data, 'data');
    
                const cycleId = data[0].SK.split('#')[1]; // '#'の前の文字を取得
                setCycleId(cycleId);
    
                const formattedData: ChartData[] = data.map((item: any) => ({
                    time: item.time, 
                    roomTemperature: item.roomTemperature,
                }));
    
                console.log(formattedData, 'chartData');
                setChartData(formattedData);
            } catch (error) {
                console.error('Error fetching temperature data', error);
            }
        };
    
        fetchTemperatureData();
    }, []);

    const lineData = {
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

    const today = new Date().toLocaleDateString();

    return (
        <div className="latest-chart-container">
            <h2>最新のチャート</h2>

            <div className="info-header">
                <div><strong>日付：</strong>{cycleId || '（未入力）'}</div>
                {/* <div><strong>コメント：</strong>{comment || '（未入力）'}</div> */}
            </div>

            <div className="chart-area">
                <Line data={lineData} />
            </div>

            {/* <div className="comment-section">
                <label htmlFor="comment">コメントを追加</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="コメントを入力してください"
                />
            </div> */}
        </div>
    );
};

export default KojiChartPage;
