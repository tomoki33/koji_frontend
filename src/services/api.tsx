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
        config.headers['Authorization'] = `Bearer ${accessToken}`; // Bearerトークンを設定
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ユーザー関連のAPI
export const createUser = async (userData: any) => {
    return await apiClient.post(`/users`, userData);
};

export const getUser = async (userId: string) => {
    return await apiClient.get(`/users/${userId}`);
};

// サイクル管理のAPI
export const createCycle = async (userId: string, cycleData: any) => {
    return await apiClient.post(`/users/${userId}/cycles`, cycleData);
};

export const getCycles = async (userId: string) => {
    return await apiClient.get(`/users/${userId}/cycles`);
};

export const getCycle = async (cycleId: string) => {
    return await apiClient.get(`/cycles/${cycleId}`);
};

export const updateCycle = async (cycleId: string, cycleData: any) => {
    return await apiClient.put(`/cycles/${cycleId}`, cycleData);
};

// 温度記録のAPI
export const createTemperatureLog = async (cycleId: string, logData: any) => {
    try {
        return await apiClient.post(`/cycles/${cycleId}/logs`, logData);
    } catch (error:any) {
        // エラーの詳細をコンソールに出力
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error; // エラーを再スローして呼び出し元で処理できるようにする
    }
};

export const getTemperatureLogs = async (cycleId: string) => {
    return await apiClient.get(`/cycles/${cycleId}/logs`);
};

export const getTemperatureStats = async (cycleId: string) => {
    return await apiClient.get(`/cycles/${cycleId}/stats`);
};

export const getLatestTemperatureLog = async (cycleId: string) => {
    return await apiClient.get(`/cycles/${cycleId}/latest`);
};
