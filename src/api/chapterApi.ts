import { apiClient } from './client';

export interface Chapter {
    chapterNumber: number;
    chapterName: string;
    translation: string;
    verseCount: number;
    summary: { en: string; hi: string };
}

export const getChapters = () => apiClient<Chapter[]>('/chapters');
export const getChapterVerses = (chapterNumber: number) => apiClient<any[]>(`/chapters/${chapterNumber}/verses`);
