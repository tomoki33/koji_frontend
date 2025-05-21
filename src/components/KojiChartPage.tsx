import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../styles/KojiChartPage.css';

Chart.register(...registerables);

interface ChartData {
    time: string;
    roomTemperature: number;
}

const KojiChartPage: React.FC = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [comment, setComment] = useState<string>('');

    // 仮データ：実際はAPIなどで最新情報を取得
    useEffect(() => {
        const now = new Date();
        const mockData: ChartData[] = Array.from({ length: 5 }).map((_, i) => {
            const t = new Date(now.getTime() - (4 - i) * 60 * 60 * 1000); // 過去4時間分
            return {
                time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                roomTemperature: 22 + Math.floor(Math.random() * 4), // 仮の室温データ
            };
        });
        setChartData(mockData);
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
                <div><strong>日付：</strong>{today}</div>
                <div><strong>コメント：</strong>{comment || '（未入力）'}</div>
            </div>

            <div className="chart-area">
                <Line data={lineData} />
            </div>

            <div className="comment-section">
                <label htmlFor="comment">コメントを追加</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="コメントを入力してください"
                />
            </div>
        </div>
    );
};

export default KojiChartPage;
