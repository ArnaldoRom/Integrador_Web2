const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index.pug");
});

router.get("/detalle", (req, res) => {
  const objetdoId = req.query.id;
  res.render("detalle", { objetdoId });
});

module.exports = router;
