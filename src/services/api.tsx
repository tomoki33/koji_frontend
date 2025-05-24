import axios from 'axios';

// APIのベースURLを設定
const API_BASE_URL = 'https://h9hvhc8r20.execute-api.ap-northeast-1.amazonaws.com';

// Axiosインスタンスを作成
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// リクエストインターセプターを追加して、トークンをヘッダーに設定
apiClient.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 温度記録のAPI
export const createTemperatureLog = async (cycleId: string, logData: any) => {
    return await apiClient.post(`/cycles/${cycleId}/logs`, logData);
};

export const getTemperatureLogs = async (cycleId: string) => {
    return await apiClient.get(`/cycles/${cycleId}/logs`);
};

export const getLatestTemperatureLog = async () => {
    return await apiClient.get(`/cycles/latest-log`);
};
