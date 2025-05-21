import axios from 'axios';

// APIのベースURLを設定
const API_BASE_URL = 'https://h9hvhc8r20.execute-api.ap-northeast-1.amazonaws.com';

// ユーザー関連のAPI
export const createUser = async (userData: any) => {
    return await axios.post(`${API_BASE_URL}/users`, userData);
};

export const getUser = async (userId: string) => {
    return await axios.get(`${API_BASE_URL}/users/${userId}`);
};

// サイクル管理のAPI
export const createCycle = async (userId: string, cycleData: any) => {
    return await axios.post(`${API_BASE_URL}/users/${userId}/cycles`, cycleData);
};

export const getCycles = async (userId: string) => {
    return await axios.get(`${API_BASE_URL}/users/${userId}/cycles`);
};

export const getCycle = async (cycleId: string) => {
    return await axios.get(`${API_BASE_URL}/cycles/${cycleId}`);
};

export const updateCycle = async (cycleId: string, cycleData: any) => {
    return await axios.put(`${API_BASE_URL}/cycles/${cycleId}`, cycleData);
};

// 温度記録のAPI
export const createTemperatureLog = async (cycleId: string, logData: any) => {
    return await axios.post(`${API_BASE_URL}/cycles/${cycleId}/logs`, logData);
};

export const getTemperatureLogs = async (cycleId: string) => {
    return await axios.get(`${API_BASE_URL}/cycles/${cycleId}/logs`);
};

export const getTemperatureStats = async (cycleId: string) => {
    return await axios.get(`${API_BASE_URL}/cycles/${cycleId}/stats`);
};

export const getLatestTemperatureLog = async (cycleId: string) => {
    return await axios.get(`${API_BASE_URL}/cycles/${cycleId}/latest`);
};
