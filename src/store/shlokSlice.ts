import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shlok } from "../services/api";

interface Settings {
  fontSize: "small" | "medium" | "large";
  showEnglishTranslation: boolean;
  showHindiTranslation: boolean;
  theme: "light" | "dark";
}

interface ShlokState {
  favorites: Shlok[];
  settings: Settings;
  recentShloks: Shlok[];
}

const loadState = (): ShlokState => {
  try {
    const serializedState = localStorage.getItem("vedincharya_state");
    if (serializedState === null) {
      return {
        favorites: [],
        settings: {
          fontSize: "medium",
          showEnglishTranslation: true,
          showHindiTranslation: true,
          theme: "light",
        },
        recentShloks: [],
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      favorites: [],
      settings: {
        fontSize: "medium",
        showEnglishTranslation: true,
        showHindiTranslation: true,
        theme: "light",
      },
      recentShloks: [],
    };
  }
};

const initialState: ShlokState = loadState();

export const shlokSlice = createSlice({
  name: "shlok",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Shlok>) => {
      const shlok = action.payload;
      const index = state.favorites.findIndex(
        (s) => s.chapter === shlok.chapter && s.verse === shlok.verse
      );
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(shlok);
      }
      localStorage.setItem("vedincharya_state", JSON.stringify(state));
    },
    addToRecent: (state, action: PayloadAction<Shlok>) => {
      const shlok = action.payload;
      const existingIndex = state.recentShloks.findIndex(
        (s) => s.chapter === shlok.chapter && s.verse === shlok.verse
      );
      if (existingIndex >= 0) {
        state.recentShloks.splice(existingIndex, 1);
      }
      state.recentShloks.unshift(shlok);
      if (state.recentShloks.length > 10) {
        state.recentShloks.pop();
      }
      localStorage.setItem("vedincharya_state", JSON.stringify(state));
    },
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      localStorage.setItem("vedincharya_state", JSON.stringify(state));
    },
    addFavorite: (state, action: PayloadAction<Shlok>) => {
      const shlok = action.payload;
      if (
        !state.favorites.some(
          (s) => s.chapter === shlok.chapter && s.verse === shlok.verse
        )
      ) {
        state.favorites.push(shlok);
        localStorage.setItem("vedincharya_state", JSON.stringify(state));
      }
    },
    removeFavorite: (
      state,
      action: PayloadAction<{ chapter: number; verse: number }>
    ) => {
      state.favorites = state.favorites.filter(
        (s) =>
          !(
            s.chapter === action.payload.chapter &&
            s.verse === action.payload.verse
          )
      );
      localStorage.setItem("vedincharya_state", JSON.stringify(state));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.setItem("vedincharya_state", JSON.stringify(state));
    },
  },
});

export const {
  toggleFavorite,
  addToRecent,
  updateSettings,
  addFavorite,
  removeFavorite,
  clearFavorites,
} = shlokSlice.actions;
export default shlokSlice.reducer;
