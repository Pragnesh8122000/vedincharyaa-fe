import { apiClient } from './client';
import { Shlok } from './shlokApi';

export interface Favorite extends Shlok {
    favoriteId: string;
    addedAt: string;
}

export const getFavorites = () => apiClient<Favorite[]>('/favorites');
export const addFavorite = (shlokId: string) => apiClient<Favorite>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ shlokId })
});
export const removeFavorite = (shlokId: string) => apiClient<{ message: string }>(`/favorites/${shlokId}`, {
    method: 'DELETE'
});

export const clearFavorites = () => apiClient<{ message: string }>('/favorites', {
    method: 'DELETE'
});
