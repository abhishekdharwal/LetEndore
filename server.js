import express from "express";
const app = express();
import router from "./routes.js";
import DbConnect from "./db.js";
const PORT = process.env.PORT || 3500;
DbConnect();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello from server ");
});
app.use("/api", router);
app.listen(PORT, () => {
  console.log(`MF working fine on ${PORT}`);
});
