const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();
const publicStatic = path.join(__dirname, "/public");

app.set("views", "./view");
app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(express.static(publicStatic));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Tamo en linea perrro");
});
