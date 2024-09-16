const router = require("express").Router();
const {
  obtenerDepartamentos,
  buscarObjetos,
  buscarObjetosPorId,
} = require(`../consultasApi`);

router.get(`/departments`, async (req, res) => {
  const departamentos = await obtenerDepartamentos();
  res.json(departamentos);
});

router.get(`/search`, async (req, res) => {
  const { q, pagina, departmentId, geoLocation } = req.query;
  const buscarPalabra = q || "";

  const objetos = await buscarObjetos(
    departmentId,
    buscarPalabra,
    geoLocation,
    pagina
  );
  res.json(objetos);
});

router.get(`/objects/:id`, async (req, res) => {
  const objetoId = req.params.id;
  const objeto = await buscarObjetosPorId(objetoId);
  res.json(objeto);
});

module.exports = router;
