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

// エラーハンドリングのための共通関数
const handleApiError = (error: any) => {
    if (error.response && error.response.status === 401) {
        // 401エラーの場合、ログアウト処理を実行
        sessionStorage.removeItem('accessToken'); // アクセストークンを削除
        // ここでログアウト処理を実行する関数を呼び出すことができます
        // 例: logoutUser();
    }
    throw error; // エラーを再スローして呼び出し元で処理できるようにする
};

// ユーザー関連のAPI
export const createUser = async (userData: any) => {
    return await apiClient.post(`/users`, userData).catch(handleApiError);
};

export const getUser = async (userId: string) => {
    return await apiClient.get(`/users/${userId}`).catch(handleApiError);
};

// サイクル管理のAPI
export const createCycle = async (userId: string, cycleData: any) => {
    return await apiClient.post(`/users/${userId}/cycles`, cycleData).catch(handleApiError);
};

export const getCycles = async (userId: string) => {
    return await apiClient.get(`/users/${userId}/cycles`).catch(handleApiError);
};

export const getCycle = async (cycleId: string) => {
    return await apiClient.get(`/cycles/${cycleId}`).catch(handleApiError);
};

export const updateCycle = async (cycleId: string, cycleData: any) => {
    return await apiClient.put(`/cycles/${cycleId}`, cycleData).catch(handleApiError);
};

// 温度記録のAPI
export const createTemperatureLog = async (cycleId: string, logData: any) => {
    try {
        return await apiClient.post(`/cycles/${cycleId}/logs`, logData);
    } catch (error:any) {
        handleApiError(error); // エラー処理を共通関数で行う
    }
};

export const getTemperatureLogs = async (cycleId: string) => {
    return await apiClient.get(`/cycles/${cycleId}/logs`).catch(handleApiError);
};

export const getTemperatureStats = async (cycleId: string) => {
    return await apiClient.get(`/cycles/${cycleId}/stats`).catch(handleApiError);
};

export const getLatestTemperatureLog = async () => {
    return await apiClient.get(`/cycles/latest-log`).catch(handleApiError);
};
