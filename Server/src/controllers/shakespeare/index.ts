import { Response, Request } from "express";
import { getListOfPlays } from "../../elastic/getListOfPlays";
import { globalSearch } from "../../elastic/globalSearch";
import { getPlayByName } from "../../elastic/getPlayByName";
import { getActOfPlay } from "../../elastic/getActOfPlay";
import {
  ShakespeareEntry,
  ShakespearePlay,
  ShakespeareSearchResult,
  ShakespeareSearchResultFull,
} from "../../types/types";
import _ from "lodash";
import { getActAndSceneFromSearchResult } from "../../elastic/getActAndSceneFromSearchResult";
import { extractRomanNumeral, roman2int } from "../../helpers/helpers";

const search = async (req: Request, res: Response): Promise<void> => {
  if (!req.query || !req.query.search) {
    res.status(400).json([]);
    return;
  }

  const entries = await globalSearch(String(req.query.search));

  const mappedEntries = entries.hits.hits.map(
    (e) =>
      ({
        entry: {
          type: e._source.type,
          lineId: e._source.line_id,
          playName: e._source.play_name,
          speechNumber: e._source.speech_number,
          lineNumber: e._source.line_number,
          speaker: e._source.speaker,
          textEntry: e._source.text_entry,
        } as ShakespeareEntry,
        highlight: {
          textEntry: e.highlight.text_entry,
        },
      } as ShakespeareSearchResult)
  );

  res.status(200).json(mappedEntries);
};

const listPlays = async (req: Request, res: Response): Promise<void> => {
  const plays = await getListOfPlays();

  const mappedPlays = plays.map(
    (p) =>
      ({
        playName: p.play_name,
        actCount: p.act_count,
        lineCount: p.line_count,
      } as ShakespearePlay)
  );

  res.status(200).json(mappedPlays);
};

const getPlay = async (req: Request, res: Response): Promise<void> => {
  if (!req.body || !req.body?.play_name) {
    res.status(400).json([]);
    return;
  }

  const entreisInPlay = await getPlayByName(String(req.body.play_name));

  const mappedEntries = entreisInPlay.hits.hits.map(
    (e) =>
      ({
        type: e._source.type,
        lineId: e._source.line_id,
        playName: e._source.play_name,
        speechNumber: e._source.speech_number,
        lineNumber: e._source.line_number,
        speaker: e._source.speaker,
        textEntry: e._source.text_entry,
      } as ShakespeareEntry)
  );

  res.status(200).json(mappedEntries);
};

const getAct = async (req: Request, res: Response): Promise<void> => {
  if (_.isEmpty(req.body) || !req.body.playName || !req.body.actNumber) {
    res.status(400).json([]);
    return;
  }

  const entriesInAct = await getActOfPlay(
    req.body.playName,
    req.body.actNumber
  );

  if (Array.isArray(entriesInAct)) {
    res.status(200).json([]);
    return;
  }

  const mappedEntries = entriesInAct.hits.hits.map(
    (e) =>
      ({
        type: e._source.type,
        lineId: e._source.line_id,
        playName: e._source.play_name,
        speechNumber: e._source.speech_number,
        lineNumber: e._source.line_number,
        speaker: e._source.speaker,
        textEntry: e._source.text_entry,
      } as ShakespeareEntry)
  );

  res.status(200).json(mappedEntries);
};

const getSearchResult = async (req: Request, res: Response): Promise<void> => {
  if (_.isEmpty(req.body) || !req.body.playName || !req.body.lineId) {
    res.status(400).json([]);
    return;
  }

  const actAndSceneResult = await getActAndSceneFromSearchResult(
    req.body.playName,
    req.body.lineId
  );

  if (actAndSceneResult.hits?.hits.length === 0) res.status(200).json([]);

  const sortedResults = actAndSceneResult.hits.hits.sort(
    (a, b) => b._source.line_id - a._source.line_id
  );

  const bestActEntry = sortedResults.find(
    (entry) => entry._source.type === "act"
  );
  
  const actNumber = bestActEntry
    ? roman2int(extractRomanNumeral(bestActEntry?._source.text_entry ?? "I") ?? "I")
    : 1;

  const entriesInAct = await getActOfPlay(req.body.playName, actNumber);

  if (Array.isArray(entriesInAct)) {
    res.status(200).json([]);
    return;
  }

  const mappedEntries = entriesInAct.hits.hits.map(
    (e) =>
      ({
        type: e._source.type,
        lineId: e._source.line_id,
        playName: e._source.play_name,
        speechNumber: e._source.speech_number,
        lineNumber: e._source.line_number,
        speaker: e._source.speaker,
        textEntry: e._source.text_entry,
      } as ShakespeareEntry)
  );

  const bestSceneEntry = sortedResults.find(
    (entry) => entry._source.type === "scene"
  );

  const sceneNumber = bestSceneEntry
    ? roman2int(extractRomanNumeral(bestSceneEntry?._source.text_entry ?? "I") ?? "I")
    : 1;

  const searchResult: ShakespeareSearchResultFull = {
    playName: req.body.playName,
    sceneNumber,
    actNumber,
    entries: mappedEntries
  };

  res.status(200).json(searchResult);
};

export { search, listPlays, getPlay, getAct, getSearchResult };
