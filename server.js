import express from "express";
const app = express();
import router from "./routes.js";
import DbConnect from "./db.js";
import path from "path";
import cors from "cors";
const PORT = process.env.PORT || 3500;
DbConnect();
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));
app.use(express.static("." + "/public"));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile("signup.html", { root: "./views" });
});
app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./views" });
});
app.use("/api", router);
app.listen(PORT, () => {
  console.log(`MF working fine on ${PORT}`);
});
