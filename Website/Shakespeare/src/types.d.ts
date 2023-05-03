export interface ShakespearePlay {
    playName: string;
    actCount: number;
    sceneCount: number;
    lineCount: number;
  }
  
  export interface ShakespeareEntry {
    type: string;
    lineId: number;
    playName: string;
    speechNumber: number;
    lineNumber: string;
    speaker: string;
    textEntry: string;
  }

  export interface ShakespeareSearchResult {
    entry: ShakespeareEntry,
    highlight: {
      textEntry: string[]
    }
  }
  