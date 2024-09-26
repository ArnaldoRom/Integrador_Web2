const router = require("express").Router();
const {
  obtenerDepartamentos,
  buscarObjetos,
  buscarObjetosPorId,
} = require(`../controllers/consultasApi`);

//-------------RUTA PARA OBTENER LOS DEPARTAMENTOS ---------------//
/* Cuando se realiza la peticion GET a /departments, se llama a la funcion obtenerDepartamentos() el cual recupera la data que despues se envia en formato JSON a quien lo requiera */
router.get(`/departments`, async (req, res) => {
  try {
    const departamentos = await obtenerDepartamentos();
    res.json(departamentos);
  } catch (error) {
    console.error("Error al obtener departamentos: ", error);
  }
});

//-------------RUTA PARA BUSCAR LOS OBJETOS ------------------------//
/* Cuando se realiza la peticion  GET a /search con parametros  de consulta , se llama a la funcion buscarObjetos() el cual recupera dependiendo del parametro que se le envia la data que  se retorna en formato JSON a quien lo requiera*/
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

//-------------RUTA PARA OBTENER OBJETOS POR ID---------------------//
/* Cuando se realiza la peticion GET a /objects/:id , se extrae el ID del objeto de los parámetros de la ruta. Luego se llama a la función buscarObjetosPorId() y se envía el objeto como respuesta en formato JSON.*/
router.get(`/objects/:id`, async (req, res) => {
  const objetoId = req.params.id;
  try {
    const objeto = await buscarObjetosPorId(objetoId);
    res.json(objeto);
  } catch (error) {
    console.error(`Error al obtener objeto con ID ${objetoId}`, error);
  }
});

//-------------RUTA PARA RENDERIZAR LA VISTA DETALLE -----------------//
/* Cuando se realiza la peticion GET a /detalle/:id  se extrae el ID del objeto de los parametros de ruta . Luego se llama a la funcion buscarObjetosPorId() y si se encuentra el objeto se renderiza la vista detalle.*/
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
