import { apiClient } from './client';

export interface Chapter {
    chapterNumber: number;
    chapterName: string;
    translation: string;
    verseCount: number;
    summary: { en: string; hi: string };
}

export const getChapters = async () => (await apiClient<{ data: Chapter[] }>('/chapters')).data.data;
export const getChapterVerses = async (chapterNumber: number) => (await apiClient<{ data: any[] }>(`/chapters/${chapterNumber}/verses`)).data.data;
