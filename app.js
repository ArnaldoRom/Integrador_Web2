/*-------------- MODULOS QUE REQUIERA LA APLICACION------- */
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const webRouter = require("./routers/webRouter");
const apiRouter = require("./routers/apiRouter");
const app = express();
const publicDir = path.join(__dirname, "public");

//Middleware para los archivos estaticos
app.use(express.static(publicDir));

//Configuracion del directorio de las vistas y PUG
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Ruta para renderizar la vista DETALLE
app.get("/detalle", (req, res) => {
  res.render("detalle", { titulo: "Detalle de Objeto" });
});

//Middleware para registrar las solicitudes HTTP en la consola del servidor
app.use(morgan("dev"));

//Usa las rutas que conectan a la API y las Paginas
app.use(apiRouter);
app.use(webRouter);

// Inicia el servidor y escucha el puerto 3000
app.listen(3000, () => {
  console.log("Tamo en linea perrro");
});
