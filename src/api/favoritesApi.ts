import { apiClient } from './client';
import { Shlok } from './shlokApi';

export interface Favorite extends Shlok {
    favoriteId: string;
    addedAt: string;
}

export const getFavorites = async () => (await apiClient<{ data: Favorite[] }>('/favorites')).data.data;

export const addFavorite = (shlokId: string) => apiClient<{ data: { shlokId: string } }>('/favorites', {
    method: 'POST',
    data: JSON.stringify({ shlokId })
}).then(res => res.data.data);

export const removeFavorite = (shlokId: string) => apiClient<{ data: { shlokId: string } }>(`/favorites/${shlokId}`, {
    method: 'DELETE'
}).then(res => res.data.data);

export const clearFavorites = () => apiClient<{ message: string }>('/favorites', {
    method: 'DELETE'
}).then(res => res.data); // data contains { message }
