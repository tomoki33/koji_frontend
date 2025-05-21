import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import KojiForm from './components/KojiForm';
import Login from './Login';
import KojiChart from './components/KojiChartPage';
import Home from './components/Home';
import './styles/App.css'; // CSSは下に記載
import KojiChartPage from './components/KojiChartPage';
import HistoryChart from './components/HistoryChart';

const App: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Sample data for the chart
    const chartData = [
        { time: '2023-01-01', roomTemperature: 20 },
        { time: '2023-01-02', roomTemperature: 22 },
        { time: '2023-01-03', roomTemperature: 21 },
        // Add more data points as needed
    ];

    return (
        <Router>
            <div className="app-container">
                <header>
                    <h1>米麹アプリ</h1>
                    <div className="hamburger" onClick={toggleMenu}>
                        ☰
                    </div>
                </header>

                {menuOpen && (
                    <nav className="menu">
                        <ul>
                            <li><Link to="/history" onClick={toggleMenu}>過去履歴</Link></li>
                            {/* <li><Link to="/login" onClick={toggleMenu}>ログイン</Link></li> */}
                            <li><Link to="/input-form" onClick={toggleMenu}>データ入力フォーム</Link></li>
                            <li><Link to="/chart" onClick={toggleMenu}>最新チャート</Link></li>
                        </ul>
                    </nav>
                )}

                <main>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/input-form" element={<KojiForm />} />
                        <Route path="/chart" element={<KojiChartPage />} />
                        <Route path="/" element={<Login />} />
                        <Route path="/history" element={<HistoryChart />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
