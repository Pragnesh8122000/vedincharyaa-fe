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
    const response = await apiClient<DueShlok[]>('/memorization/due');
    return response;
};

export const updateProgress = async (chapter: number, verse: number, isCorrect: boolean) => {
    const response = await apiClient<{ message: string; progress: MemorizationProgress }>('/memorization/progress', {
        method: 'POST',
        body: JSON.stringify({ 
            chapterNumber: chapter, 
            verseNumber: verse, 
            isCorrect,
            // TODO: Get real userId
            userId: 'dummy_user_id'
        })
    });
    return response;
};

export const startMemorization = async (chapter: number, verse: number) => {
    const response = await apiClient<MemorizationProgress>('/memorization/start', {
        method: 'POST',
        body: JSON.stringify({ 
            chapterNumber: chapter, 
            verseNumber: verse,
            userId: 'dummy_user_id'
        })
    });
    return response;
};
