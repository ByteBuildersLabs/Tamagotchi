export interface Voice {
    id: string;
    name: string;
  }
  
  export interface TextToSpeechResponse {
    audio?: string;
    error?: string;
  }