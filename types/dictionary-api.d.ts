export interface DictionaryResponse {
  word: string
  phonetic: string
  phonetics: { text: string; audio?: string, sourceUrl?: string }[]
  origin: string
  meanings: {
    partOfSpeech: string; 
    definitions: { 
      definition: string; 
      example?: string; 
      synonyms?: string[]; 
      antonyms?: string[] 
    }[]
  }[]
}

// export interface Definition {
//   word: string;
//   partOfSpeech: string;
//   definition: string;
//   example: string;
// }

export interface Definition {
  word: string;
  phonetics: { 
    text: string; 
    audio?: string; 
    sourceUrl?: string; 
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms?: string[];
      antonyms?: string[];
      example?: string;
    }[];
  }[];
}