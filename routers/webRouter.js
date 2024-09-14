const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/detalle", (req, res) => {
  res.render("detalle");
});

module.exports = router;
