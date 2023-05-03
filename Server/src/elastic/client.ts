import { Client } from '@elastic/elasticsearch'

const client = new Client({ node: "http://localhost:9200"  }); //http://localhost:9200'

async function search(index: string, body: object) {

  try {
    const response = await client.search({
      index,
      body,
    })
    return response;

  } catch (error) {
    console.log(error)
  }
}

async function * scroll({ index, body, source }: { index: string; body: object; source: string[]; }) {

  const params = {
    index,
    scroll: '30s',
    size: 1000,
    _source: source,
    body
  }

  for await (const hit of scrollSearch(params)) {
    yield hit._source
  }
}

export { search, scroll }

async function * scrollSearch(params: any) {

  try {
    let response = await client.search(params)

    while (true) {
      const sourceHits = response.hits.hits

      if (sourceHits.length === 0) {
        break
      }

      for (const hit of sourceHits) {
        yield hit
      }

      if (!response._scroll_id) {
        break
      }

      response = await client.scroll({
        scroll_id: response._scroll_id,
        scroll: params.scroll
      })
    }
  } catch (error) {
    console.log(error);
  }
}