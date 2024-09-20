const router = require("express").Router();
const {
  obtenerDepartamentos,
  buscarObjetos,
  buscarObjetosPorId,
} = require(`../controllers/consultasApi`);

//---------------------SIRVE ---------------------//
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

router.get(`/detalle/:id`, async (req, res) => {
  const objetoId = req.params.id;
  try {
    const objeto = await buscarObjetosPorId(objetoId);
    if (objeto) {
      res.render(`detalle`, { objeto }); // Renderiza la vista de detalle con los datos del objeto
    } else {
      res.status(404).send("Objeto no encontrado");
    }
  } catch (error) {
    console.error(`Error al obtener el objeto con ID ${objetoId}:`, error);
    res.status(500).send("Error al cargar la página de detalle");
  }
});

module.exports = router;
