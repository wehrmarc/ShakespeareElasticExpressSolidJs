import express, { Express } from 'express';
import cors from "cors";
import router from "./routes"

const app: Express = express();
const PORT: string | number = process.env.PORT || 4000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use(router);

app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )