import { app } from "./app";

const port = Number(process.env.PORT ?? 9000);
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
