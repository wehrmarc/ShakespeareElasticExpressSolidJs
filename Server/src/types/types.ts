import exp from "constants";

export interface ITest {
  name: string;
  description: string;
  status: boolean;
}

export interface ShakespearePlay {
  playName: string;
  actCount: number;
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
    textEntry: []
  }
}

export interface ShakespeareSearchResultFull {
  sceneNumber: number,
  actNumber: number,
  playName: string,
  entries: ShakespeareEntry[]
}

export interface ShardsResponse {
  total: number;
  successful: number;
  failed: number;
  skupped: number;
}

export interface Explanation {
  value: number;
  description: number;
  details: Explanation[];
}

export interface SearchResponse<T> {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: ShardsResponse;
  hits: {
    total: number;
    max_score: number;
    hits: Array<{
      _index: string;
      _type: string;
      _id: string;
      _score: number;
      _source: T;
      _version?: number;
      _explanation?: Explanation;
      fields?: any;
      highlight?: any;
      inner_hits?: any;
      matched_queries?: string[];
      sort?: string[];
    }>;
  };
  aggregations?: any;
}
