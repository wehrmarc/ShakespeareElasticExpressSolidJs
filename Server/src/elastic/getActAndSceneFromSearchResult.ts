import * as z from "zod";
import { search } from "./client";

const EsResponse = z.object({
  hits: z.object({
    total: z.object({
      value: z.number(),
    }),
    hits: z.array(
      z.object({
        _score: z.number(),
        _source: z.object({
          type: z.string(),
          line_id: z.number(),
          play_name: z.string(),
          speech_number: z.number(),
          line_number: z.string(),
          speaker: z.string(),
          text_entry: z.string(),
        }),
      })
    ),
  }),
});

const getActAndSceneFromSearchResult = async (
  playName: string,
  lineId: number
) => {
  const esResponse = await search("shakespeare", {
    size: 1000,
    query: {
      bool: {
        must: [
          {
            match: {
              play_name: playName,
            },
          },
          {
            range: {
              line_id: {
                gte: Math.max(lineId - 1000, 1),
                lte: lineId,
              },
            },
          },
        ],
        should: [
          {
            match: {
              type: "act",
            },
          },
          {
            match: {
              type: "scene",
            },
          },
        ],
        minimum_should_match: 1,
        boost: 1.0,
      },
    },
    sort: [
      {
        _score: {
          order: "asc",
        },
      },
      {
        _id: {
          order: "asc",
        },
      },
    ],
  });

  const validatedResponse = EsResponse.parse(esResponse);

  return validatedResponse;
};

export { getActAndSceneFromSearchResult };
