# ShakespeareElasticExpressSolidJs

<p align="center">
  <img src="https://img.shields.io/badge/-ElasticSearch-005571?style=for-the-badge&logo=elasticsearch" alt="ElasticSearch">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js">
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/SolidJS-2c4f7c?style=for-the-badge&logo=solid&logoColor=c8c9cb" alt="SolidJS">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS">
</p>

<b>A hobby project exploring Elasticsearch and SolidJs</b>

This project aims to provide a simple yet powerful example of how Elasticsearch and SolidJs can work together in a project. This project provides a website that allows users to search through the works of Shakespeare using Elasticsearch for the backend search engine and SolidJs for the frontend framework. 

## Prerequisites

This assumes you're running Windows.

To run this locally, first get Elasticsearch up and running:
- Head to the [Elasticsearch website](https://www.elastic.co/downloads/elasticsearch) and download Elasticsearch.
- Unzip and open `config/elasticsearch.yml` and disable xpack security: `xpack.security.enabled: false`
- Go back up and into `/bin` and run Elasticsearch - it should be running on port :9200.
- Open Postman and add the index to Elasticsearch:
  ```
  PUT localhost:9200/shakespeare
  {
    "mappings": {
      "properties": {
        "speaker": {"type": "keyword"},
        "play_name": {"type": "keyword"},
        "line_id": {"type": "integer"},
        "speech_number": {"type": "integer"}
      }
    }
  }
  ```
- Next, add the `shakespeare_6.0.json` data to the index by navigating to the folder containing the JSON, open CMD and run: 
  ```
  curl -H 'Content-Type: application/x-ndjson' -XPOST 'localhost:9200/shakespeare/_bulk?pretty' --data-binary @shakespeare.json
  ```
  
Now the Elasticsearch index should be ready.

## Getting Started

To get started with this project, you need to install the necessary packages:
- For both the server and the website, install packages with your preferred package manager.
- To start the server, run `pnpm start` - it should be running on port :4000.
- To start the website, run `pnpm dev` - it should be running on port :3000.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is unlicensed
