import {
  ShakespearePlay,
  ShakespeareEntry,
  ShakespeareSearchResult,
  ShakespeareSearchResultFull,
} from "../../types";
import { EndpointService } from "../api/endpoint.service";

const api = new EndpointService("http://localhost:4000");

async function getListOfPlays(): Promise<ShakespearePlay[]> {
  return await api.get(`shakespeare/list`);
}

async function getActOfPlay(requestObj: {
  playName: string;
  actNumber: number;
}): Promise<ShakespeareEntry[]> {
  return await api.post("shakespeare/act", requestObj);
}

async function getPlay(requestObj: {
  playName: string;
}): Promise<ShakespeareEntry[]> {
  return await api.post("shakespeare/play", requestObj);
}

async function search(term: string): Promise<ShakespeareSearchResult[]> {
  return await api.get(`shakespeare?search=${term}`);
}

async function getSearchResults(requestObj: {
  playName: string;
  lineId: number;
}): Promise<ShakespeareSearchResultFull> {
  return await api.post("shakespeare", requestObj);
}

export default {
  getListOfPlays,
  getPlay,
  getActOfPlay,
  search,
  getSearchResults,
};
