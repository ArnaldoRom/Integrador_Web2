const fetch = require("node-fetch");
const { traducir } = require("../services/traductor");
const API_base = `https://collectionapi.metmuseum.org/public/collection/v1`;

// ------------------------ SIRVEEEE  --------------------//
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

async function buscarObjetos(dtos, palabra, localizacion, pagina = 1) {
  let urlBusqueda = `${API_base}/search?q=${palabra || ""}&hasImages=true`;

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
