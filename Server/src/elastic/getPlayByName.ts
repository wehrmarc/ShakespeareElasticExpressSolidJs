import * as z from "zod";
import { search } from "./client";

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
          text_entry: z.string()
        })
      })
    )
  })
})

const getPlayByName = async (playName: string) => {

  const esResponse = await search("shakespeare", {
    size: 10000,
    query: {
      match: {
        play_name: playName,
      },
    },
  });

  const validatedResponse = EsResponse.parse(esResponse);

  return validatedResponse;
};

export { getPlayByName };
