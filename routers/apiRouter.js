const router = require("express").Router();
const { obtenerDepartamentos, buscarObjetos } = require(`../consultasApi`);

router.get(`/departments`, async (req, res) => {
  const departamentos = await obtenerDepartamentos();
  res.json(departamentos);
});

router.get(`/search`, async (req, res) => {
  const { dtos, palabra, localizacion, pagina } = req.query;

  const objetos = await buscarObjetos(dtos, palabra, localizacion, pagina);
  res.json(objetos);
});

module.exports = router;
