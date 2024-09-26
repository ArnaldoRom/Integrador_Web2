const router = require("express").Router();

//----------------- RUTAS DE LAS VISTAS ---------------------//

/* Cuando se realiza una solicitud GET a la raíz ("/"), se renderiza la vista principal de la pagina. */
router.get("/", (req, res) => {
  res.render("index");
});

/* Cuando se realiza una solicitud GET a "/detalle", se obtiene el ID del objeto desde los parámetros de consulta de la solicitud. Luego, se renderiza la vista "detalle" pasando el ID del objeto como un parámetro. */
router.get("/detalle", (req, res) => {
  const objetdoId = req.query.id;
  res.render("detalle", { objetdoId });
});

module.exports = router;
