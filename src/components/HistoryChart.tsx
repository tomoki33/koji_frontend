import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getTemperatureLogs } from '../services/api'; // APIからデータを取得する関数をインポート
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
    const [selectedDate, setSelectedDate] = useState('');
    const [chartData, setChartData] = useState<ChartData[]>([]); // 初期値を空の配列に設定
    const [errorMessage, setErrorMessage] = useState<string>(''); // エラーメッセージの状態を追加

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);

        if (date) {
            fetchTemperatureData(date); // 日付を渡してデータを取得
        } else {
            setChartData([]);
            setErrorMessage(''); // 日付が空の場合はエラーメッセージをリセット
        }
    };

    const fetchTemperatureData = async (date: string) => {
        try {
            const response = await getTemperatureLogs(date); // APIからデータを取得
            const data = response.data;
            if (data.length === 0) {
                setErrorMessage('該当の日付にはデータが登録されていません。'); // データがない場合のエラーメッセージ
                setChartData([]); // データをクリア
            } else {
                const formattedData: ChartData[] = data.map((item: any) => ({
                    time: item.time,
                    roomTemperature: item.roomTemperature,
                    humidity: item.humidity,
                    productTemperature: item.productTemperature,
                    comment: item.comment,
                }));

                setChartData(formattedData);
                setErrorMessage(''); // エラーメッセージをリセット
            }
        } catch (error) {
            console.error('Error fetching temperature data', error);
            setErrorMessage('該当の日付にはデータが登録されていません。'); // エラーが発生した場合のメッセージ
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
                tension: 0.4,
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

            {/* エラーメッセージの表示 */}
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            {/* データを表形式で表示 */}
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

            {/* チャートを表示 */}
            {chartData.length > 0 && (
                <div className="chart-area">
                    <Line data={lineData} />
                </div>
            )}
        </div>
    );
};

export default HistoryChart;
