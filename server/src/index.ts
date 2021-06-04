import express from "express";
import { pool } from "./db/pool";
import { postsRouter } from "./routes/posts";
import { usersRouter } from "./routes/users";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(postsRouter);
app.use(usersRouter);

pool
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
