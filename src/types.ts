export interface Shlok {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: {
    english: string;
    hindi: string;
  };
  meaning?: {
    english?: string;
    hindi?: string;
  };
  tags?: string[];
  words?: {
    sanskrit: string;
    meaning: string;
  }[];
}

export interface Chapter {
  chapter_number: number;
  name_sanskrit: string;
  name_translation: string;
  name_meaning: string;
  verses_count: number;
  summary?: {
    english: string;
    hindi: string;
  };
}

export interface VerseOption {
  value: number;
  label: string;
}

export interface ChapterOption {
  value: number;
  label: string;
}
