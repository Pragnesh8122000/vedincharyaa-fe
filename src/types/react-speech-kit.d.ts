declare module "react-speech-kit" {
  export interface SpeechSynthesisOptions {
    onEnd?: () => void;
  }

  export interface SpeakOptions {
    text: string;
    voice?: SpeechSynthesisVoice;
    rate?: number;
    pitch?: number;
    volume?: number;
  }

  export function useSpeechSynthesis(options?: SpeechSynthesisOptions): {
    speak: (options: SpeakOptions) => void;
    cancel: () => void;
    speaking: boolean;
    supported: boolean;
    voices: SpeechSynthesisVoice[];
  };
}
