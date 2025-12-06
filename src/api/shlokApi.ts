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
    audioUrl?: string;
    words?: {
        sanskrit: string;
        meaning: string;
    }[];
}



export interface Pagination {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    nextPage: number | null;
}

export interface ShlokResponse {
    items: Shlok[];
    pagination: Pagination;
}

export const getShloks = (params: { 
    chapterNumber?: number; 
    chapterNumbers?: string;
    tags?: string;
    search?: string; 
    page?: number; 
    limit?: number 
}) => {
    const query = new URLSearchParams();
    if (params.chapterNumber) query.append('chapterNumber', params.chapterNumber.toString());
    if (params.chapterNumbers) query.append('chapterNumbers', params.chapterNumbers);
    if (params.tags) query.append('tags', params.tags);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    
    return apiClient<ShlokResponse>(`/shloks?${query.toString()}`);
};

export const getShlok = (chapter: number, verse: number) => apiClient<Shlok>(`/shloks/${chapter}/${verse}`);
