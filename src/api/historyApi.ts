import { apiClient } from './client';
import { Shlok } from './shlokApi';

export interface HistoryItem extends Shlok {
    historyId: string;
    viewedAt: string;
}

export const getHistory = async () => (await apiClient<{ data: HistoryItem[] }>('/history')).data.data;
export const addHistory = (shlokId: string) => apiClient<{ data: HistoryItem }>('/history', {
    method: 'POST',
    data: JSON.stringify({ shlokId })
}).then(res => res.data.data);
