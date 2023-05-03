import * as z from "zod";
import { search } from "./client";

const Response = z.object({
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
        highlight: z.object({
          text_entry: z.array(
            z.string()
          )
        })
      }),
    ),
  }),
});

const globalSearch = async (searchTerm: string) => {
  const query = {
    size: 10,
    query: {
      bool: {
        should: [
          {
            match: {
              play_name: {
                query: searchTerm,
                fuzziness: "AUTO",
              },
            },
          },
          {
            match: {
              text_entry: {
                query: searchTerm,
                fuzziness: "AUTO",
              },
            },
          },
        ],
      },
    },
    highlight: {
      fields: {
        text_entry: {}
      },
    },
  };

  const result = await search("shakespeare", query);

  const parsedResult = Response.parse(result);

  return parsedResult;
};

export { globalSearch };
