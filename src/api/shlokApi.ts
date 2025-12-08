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

export const getShloks = async (params: { 
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
    
    return (await apiClient<{ data: ShlokResponse }>(`/shloks?${query.toString()}`)).data.data;
};

export const getShlok = async (chapter: number, verse: number) => (await apiClient<{ data: Shlok }>(`/shloks/${chapter}/${verse}`)).data.data;
