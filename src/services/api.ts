export interface Translation {
    description: string;
    author_name: string;
    language: string;
}

export interface Commentary {
    description: string;
    author_name: string;
    language: string;
}

export interface Shlok {
    _id: string;
    chapter: number;
    verse: number;
    slok: string;
    transliteration: string;
    tej?: { author: string; ht: string };
    siva?: { author: string; et: string; ec: string };
    purohit?: { author: string; et: string };
    chinmay?: { author: string; hc: string };
    san?: { author: string; et: string };
    adi?: { author: string; et: string };
    gambir?: { author: string; et: string };
    madhav?: { author: string; sc: string };
    anand?: { author: string; sc: string };
    rams?: { author: string; ht: string; hc: string };
    raman?: { author: string; sc: string; et: string };
    abhinav?: { author: string; sc: string; et: string };
    sankar?: { author: string; ht: string; sc: string; et: string };
    jaya?: { author: string; sc: string };
    vallabh?: { author: string; sc: string };
    ms?: { author: string; sc: string };
    srid?: { author: string; sc: string };
    dhan?: { author: string; sc: string };
    venkat?: { author: string; sc: string };
    puru?: { author: string; sc: string };
    neel?: { author: string; sc: string };
}

export interface Chapter {
    chapter_number: number;
    verses_count: number;
    name: string;
    translation: string;
    transliteration: string;
    meaning: {
        en: string;
        hi: string;
    };
    summary: {
        en: string;
        hi: string;
    };
}

const BASE_URL = "https://vedicscriptures.github.io";

export const getChapters = async (): Promise<Chapter[]> => {
    const response = await fetch(`${BASE_URL}/chapters`);
    if (!response.ok) {
        throw new Error("Failed to fetch chapters");
    }
    return response.json();
};

export const getChapter = async (chapterNumber: number): Promise<Chapter> => {
    const response = await fetch(`${BASE_URL}/chapter/${chapterNumber}`);
    if (!response.ok) {
        throw new Error("Failed to fetch chapter");
    }
    return response.json();
};

export const getShlok = async (chapter: number, verse: number): Promise<Shlok> => {
    const response = await fetch(`${BASE_URL}/slok/${chapter}/${verse}`);
    if (!response.ok) {
        throw new Error("Failed to fetch shlok");
    }
    return response.json();
};

// Helper to fetch all verses for a chapter (with concurrency limit)
export const getChapterVerses = async (chapter: number, versesCount: number): Promise<Shlok[]> => {
    const verses: Shlok[] = [];
    const batchSize = 10;
    
    for (let i = 1; i <= versesCount; i += batchSize) {
        const batchPromises = [];
        for (let j = i; j < i + batchSize && j <= versesCount; j++) {
            batchPromises.push(getShlok(chapter, j));
        }
        const batchResults = await Promise.all(batchPromises);
        verses.push(...batchResults);
    }
    
    return verses;
};
