import * as z from "zod";
import { search } from "./client";

const AggregationBucket = z.object({
  key: z.string(),
  doc_count: z.number(),
  line_count: z.object({
    doc_count: z.number(),
  }),
  act_count: z.object({
    doc_count: z.number(),
  }),
});

const EsAggregationsResponse = z.object({
  took: z.number(),
  timed_out: z.boolean(),
  _shards: z.object({
    total: z.number(),
    successful: z.number(),
    skipped: z.number(),
    failed: z.number(),
  }),
  hits: z.object({
    total: z.object({
      value: z.number(),
      relation: z.string(),
    }),
    max_score: z.nullable(z.number()),
    hits: z.array(z.unknown()),
  }),
  aggregations: z.object({
    distinct_plays: z.object({
      doc_count_error_upper_bound: z.number(),
      sum_other_doc_count: z.number(),
      buckets: z.array(AggregationBucket),
    }),
  }),
});

const getListOfPlays = async () => {
  const esResponse = await search("shakespeare", {
    size: 0,
    aggs: {
      distinct_plays: {
        terms: {
          field: "play_name",
          size: 1000000,
          order: { _key: "asc" },
        },
        aggs: {
          act_count: {
            filter: {
              term: { "type.keyword": "act" },
            },
          },
          line_count: {
            filter: {
              term: { "type.keyword": "line" },
            },
          },
        },
      },
    },
  });

  // Validate the response using the Zod schema
  const validatedResponse = EsAggregationsResponse.parse(esResponse);

  // Access the properties of the validated response
  const plays = validatedResponse.aggregations.distinct_plays.buckets.map(
    (bucket) => ({
      play_name: bucket.key,
      act_count: bucket.act_count.doc_count || 0,
      line_count: bucket.line_count.doc_count || 0,
    })
  );

  return plays;
};

export { getListOfPlays };
