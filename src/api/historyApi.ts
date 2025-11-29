import { apiClient } from './client';
import { Shlok } from './shlokApi';

export interface HistoryItem extends Shlok {
    historyId: string;
    viewedAt: string;
}

export const getHistory = () => apiClient<HistoryItem[]>('/history');
export const addHistory = (shlokId: string) => apiClient<HistoryItem>('/history', {
    method: 'POST',
    body: JSON.stringify({ shlokId })
});
