const fetch = require("node-fetch");
const { traducir } = require("../services/traductor");
const API_base = `https://collectionapi.metmuseum.org/public/collection/v1`;

//---------------- FUNCION PARA OBTENER DEPARTAMENTOS ------------//
/* Solicita a la Api los deportamentos disponmibles y devuelve una lista de los disponibles */
async function obtenerDepartamentos() {
  try {
    const response = await fetch(`${API_base}/departments`);
    if (!response.ok) {
      throw new Error(
        `Error al obtener los departamentos: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.departments;
  } catch (error) {
    console.error(`Se produjo un error al obtener departamentos: `, error);
    return [];
  }
}

//---------------- FUNCION PARA BUSCAR OBJETOS  -----------------------//
/* Se solicita a la API los datos de los objetos que se decean obtener . Filtrados ya sea por Departamento , Palabra Clave o Localizacion. */
async function buscarObjetos(dtos, palabra, localizacion, pagina = 1) {
  let urlBusqueda = `${API_base}/search?hasImages=true&q=${palabra || ""}`;

  if (dtos) urlBusqueda += `&departmentId=${dtos}`;
  if (localizacion) urlBusqueda += `&geoLocation=${localizacion}`;

  try {
    const response = await fetch(urlBusqueda);
    const data = await response.json();

    if (!data.objectIDs || data.objectIDs.length === 0) {
      return { total: 0, objetos: [] };
    }

    const total = data.objectIDs.length;
    const objetos = await Promise.all(
      data.objectIDs.map(async (id) => obtenerObjetosPorId(id))
    );

    return { total: total, objetos: objetos.filter((obj) => obj !== null) };
  } catch (error) {
    console.error("Error en la búsqueda de objetos:", error);
    return { total: 0, objetos: [] };
  }
}

//---------------- FUNCION PARA BUSCAR OBJETOS POR  SU ID --------//
/* Se obtiene un objeto especifico para poder realizar la traduccion de sus atributos TITLE, CULTURE y DYNASTY. Retornando el objeto con la informacion ya traducida */
async function buscarObjetosPorId(id) {
  try {
    const objeto = await obtenerObjetosPorId(id);
    if (objeto) {
      objeto.title = await traducir(objeto.title);
      objeto.culture = await traducir(objeto.culture);
      objeto.dynasty = await traducir(objeto.dynasty);
    }
    return objeto;
  } catch (error) {
    console.error(`Error al buscar objeto por ID (${id}): `, error);
    return null;
  }
}

//---------------- FUNCION PARA OBTENER OBJETOS POR  SU ID --------//
/*  Se solicita a la Api los datos de un objeto filtrado por su ID. Esto se realiza para obtener todos los atributos del objeto disponible */
async function obtenerObjetosPorId(id) {
  try {
    const response = await fetch(`${API_base}/objects/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {}
  return null;
}

module.exports = { obtenerDepartamentos, buscarObjetos, buscarObjetosPorId };
