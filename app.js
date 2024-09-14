const express = require("express");
const morgan = require("morgan");
const path = require("path");
const webRouter = require("./routers/webRouter");
const apiRouter = require("./routers/apiRouter");

const app = express();
const publicStatic = path.join(__dirname, "/public");

app.set("views", "./view");
app.set("view engine", "pug");

app.use(express.static(publicStatic));

app.use(morgan("dev"));
app.use(apiRouter);
app.use(webRouter);

app.listen(3000, () => {
  console.log("Tamo en linea perrro");
});
