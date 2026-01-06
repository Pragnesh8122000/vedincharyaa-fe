import { getAllMemorization, updateProgress, startMemorization, removeMemorization } from '../api/memorizationApi';

export const memorizationService = {
  getAll: async () => {
    return await getAllMemorization();
  },

  getById: async (shlokId: string) => {
    // Ideally user specific endpoint for single ID check
    const all = await getAllMemorization();
    return all.find((p) => {
        // Handle both formatted shlokId or separate fields matching
        return (p as any).shlokId === shlokId || (`${p.chapterNumber}-${p.verseNumber}` === shlokId);
    });
  },

  add: async (chapter: number, verse: number) => {
    return await startMemorization(chapter, verse);
  },

  remove: async (chapter: number, verse: number) => {
    return await removeMemorization(chapter, verse);
  },

  updateProgress: async (chapter: number, verse: number, isCorrect: boolean) => {
      return await updateProgress(chapter, verse, isCorrect);
  }
};
