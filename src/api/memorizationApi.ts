import { apiClient } from './client';
import { Shlok } from './shlokApi';

export interface MemorizationProgress {
    _id: string;
    userId: string;
    chapterNumber: number;
    verseNumber: number;
    box: number;
    nextReviewDate: string;
}

export interface DueShlok extends Shlok {
    progress?: MemorizationProgress;
}

export const getDueShloks = async (): Promise<DueShlok[]> => {
    const response = await apiClient<{ data: DueShlok[] }>('/memorization/due');
    return response.data.data;
};

export const getAllMemorization = async (): Promise<MemorizationProgress[]> => {
    const response = await apiClient<{ data: MemorizationProgress[] }>('/memorization');
    return response.data.data;
};

export const updateProgress = async (chapter: number, verse: number, isCorrect: boolean) => {
    const response = await apiClient<{ data: { message: string; progress: MemorizationProgress } }>('/memorization/progress', {
        method: 'POST',
        data: JSON.stringify({ 
            chapterNumber: chapter, 
            verseNumber: verse, 
            isCorrect
        })
    });
    return response.data.data;
};

export const startMemorization = async (chapter: number, verse: number) => {
    const response = await apiClient<{ data: MemorizationProgress }>('/memorization/start', {
        method: 'POST',
        data: JSON.stringify({ 
            chapterNumber: chapter, 
            verseNumber: verse
        })
    });
    return response.data.data;
};

export const removeMemorization = async (chapter: number, verse: number) => {
    const response = await apiClient<{ data: any }>('/memorization/remove', {
        method: 'POST', // Using POST for remove as defined in controller (or DELETE? Controller uses removeProgress logic which usually is DELETE but route file matters)
        // Controller function is `removeProgress`, usually mapped to DELETE or POST. Assuming POST based on existing code.
        data: JSON.stringify({ 
            chapterNumber: chapter, 
            verseNumber: verse
        })
    });
    return response.data.data;
};
