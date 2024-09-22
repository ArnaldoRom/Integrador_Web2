const express = require("express");
const morgan = require("morgan");
const path = require("path");
const webRouter = require("./routers/webRouter");
const apiRouter = require("./routers/apiRouter");
const app = express();
const publicDir = path.join(__dirname, "/public");

app.use(express.static(publicDir));

app.set("views", "./view");
app.set("views engine", "pug");

app.get("/detalle", (req, res) => {
  res.render("detalle", { titulo: "Detalle de Objeto" });
});

app.use(morgan("dev"));

app.use(apiRouter);
app.use(webRouter);

app.listen(3000, () => {
  console.log("Tamo en linea perrro");
});
