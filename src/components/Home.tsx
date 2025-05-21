import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
    const [selectedCycle, setSelectedCycle] = useState('');
    const navigate = useNavigate();

    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCycle(e.target.value);
    };

    const handleViewGraph = () => {
        if (selectedCycle) {
            navigate(`/chart?cycleId=${selectedCycle}`);
        } else {
            alert("サイクルを選択してください");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Koji Dashboard</h2>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="cycle">サイクル選択: </label>
                <select id="cycle" value={selectedCycle} onChange={handleCycleChange}>
                    <option value="">選択してください</option>
                    <option value="1">サイクル 1</option>
                    <option value="2">サイクル 2</option>
                    {/* 実際のデータで置き換えてください */}
                </select>
            </div>
            <button onClick={handleViewGraph}>View Graph</button>
        </div>
    );
};

export default Home;
