const router = require("express").Router();
const {
  obtenerDepartamentos,
  buscarObjetos,
  buscarObjetosPorId,
} = require(`../controllers/consultasApi`);

//---------------------SIRVE ---------------------//
router.get(`/departments`, async (req, res) => {
  try {
    const departamentos = await obtenerDepartamentos();
    res.json(departamentos);
  } catch (error) {
    console.error("Error al obtener departamentos: ", error);
  }
});

router.get(`/search`, async (req, res) => {
  const { q, pagina, departmentId, geoLocation } = req.query;
  const buscarPalabra = q || "";

  try {
    const objetos = await buscarObjetos(
      departmentId,
      buscarPalabra,
      geoLocation,
      pagina
    );
    res.json(objetos);
  } catch (error) {
    console.error("Error en la busqueda de objetos: ", error);
  }
});

router.get(`/objects/:id`, async (req, res) => {
  const objetoId = req.params.id;
  try {
    const objeto = await buscarObjetosPorId(objetoId);
    res.json(objeto);
  } catch (error) {
    console.error(`Error al obtener objeto con ID ${objetoId}`, error);
  }
});

router.get(`/detalle/:id`, async (req, res) => {
  const objetoId = req.params.id;
  try {
    const objeto = await buscarObjetosPorId(objetoId);
    if (objeto) {
      res.render(`detalle`, { objeto });
    } else {
      res.status(404).send("Objeto no encontrado");
    }
  } catch (error) {
    console.error(`Error al obtener el objeto con ID ${objetoId}:`, error);
  }
});

module.exports = router;
