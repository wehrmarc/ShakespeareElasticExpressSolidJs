import * as z from "zod";
import { search } from "./client";
import { int2roman } from "../helpers/helpers";

const EsResponse = z.object({
  hits: z.object({
    total: z.object({
      value: z.number(),
    }),
    hits: z.array(
      z.object({
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

const getActOfPlay = async (playName: string, actNumber: number) => {
  const createBoundaryQuery = function (act: number) {
    return {
      size: 1,
      query: {
        bool: {
          must: [
            {
              match: { play_name: playName },
            },
            {
              match: { type: "act" },
            },
            {
              term: { "text_entry.keyword": `ACT ${int2roman(act)}` },
            },
          ],
        },
      },
    };
  };

  const lowerBoundaryResult = await search(
    "shakespeare",
    createBoundaryQuery(actNumber)
  );

  const parsedLowerBoundaryResult =
    EsResponse.parse(lowerBoundaryResult).hits.hits[0]._source;

  if (parsedLowerBoundaryResult.text_entry !== `ACT ${int2roman(actNumber)}`) {
    return [];
  }

  const upperBoundaryResult = await search(
    "shakespeare",
    createBoundaryQuery(actNumber + 1)
  );

  const parsedUpperBoundaryResult =
    EsResponse.parse(upperBoundaryResult).hits?.hits[0]?._source;

  const rangeQuery: any = createRangeMathcQuery(
    playName,
    parsedLowerBoundaryResult.line_id,
    parsedUpperBoundaryResult?.line_id ?? 1000000
  );

  const result = await search("shakespeare", rangeQuery);

  const parsedResult = EsResponse.parse(result);

  return parsedResult;
};

const createRangeMathcQuery = function (
  play_name: string,
  lowerBoundaryLineId: number,
  upperBoundaryLineId: number
): any {
  return {
    sort: [{ line_id: "asc" }],
    size: 10000,
    query: {
      bool: {
        must: [
          {
            match: {
              play_name,
            },
          },
          {
            range: {
              line_id: {
                gte: lowerBoundaryLineId,
                ...(upperBoundaryLineId > lowerBoundaryLineId
                  ? { lt: upperBoundaryLineId }
                  : {}),
              },
            },
          },
        ],
      },
    },
  };
};

export { getActOfPlay };
