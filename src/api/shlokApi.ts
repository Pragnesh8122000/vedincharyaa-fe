import { apiClient } from './client';

export interface Shlok {
    id: string;
    chapterNumber: number;
    verseNumber: number;
    sanskritText: string;
    transliteration: string;
    translationEnglish: string;
    translationHindi: string;
    tags: string[];
}



export const getShloks = (params: { chapterNumber?: number; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.chapterNumber) query.append('chapterNumber', params.chapterNumber.toString());
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    
    return apiClient<Shlok[]>(`/shloks?${query.toString()}`);
};

export const getShlok = (chapter: number, verse: number) => apiClient<Shlok>(`/shloks/${chapter}/${verse}`);
