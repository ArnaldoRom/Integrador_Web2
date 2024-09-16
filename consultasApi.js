const fetch = require("node-fetch");
const { traducir } = require("./traductor");
const API_base = `https://collectionapi.metmuseum.org/public/collection/v1`;

async function obtenerDepartamentos() {
  const response = await fetch(`${API_base}/departments`);
  const data = await response.json();

  return data.departments;
}

async function buscarObjetos(dtos, palabra, localizacion, pagina = 1) {
  let urlBusqueda = `${API_base}/search?q=${palabra || ""}&hasImages=true`;

  if (dtos) urlBusqueda += `&departmentId=${dtos}`;
  if (localizacion) urlBusqueda += `&geoLocation=${localizacion}`;

  try {
    const response = await fetchWithRetry(urlBusqueda);
    const data = await response.json();

    if (!data.objectIDs || data.objectIDs.length === 0) {
      return [];
    }

    const idsObjetos = data.objectIDs.slice((pagina - 1) * 20, pagina * 20);

    const objetos = [];

    await Promise.all(
      idsObjetos.map(async (id) => {
        try {
          const detalle = await fetchWithRetry(`${API_base}/objects/${id}`);
          if (detalle) {
            const objetoData = await detalle.json();
            if (objetoData.primaryImage) {
              objetos.push(objetoData);
            }
          } else {
            console.log(`No se encontro el Objeto: ${id}`);
          }
        } catch (error) {
          console.error(`Error al obtener objeto con ID: ${id}`);
        }
      })
    );

    return objetos.filter((obj) => obj !== null);
  } catch (error) {
    console.error(`Error en la busqueda de Objetos`, error);
    return [];
  }
}

async function buscarObjetosPorId(id) {
  const response = await fetchWithRetry(`${API_base}/objects/${id}`);

  if (!response) {
    return null;
  }
  const objeto = await response.json();

  if (objeto) {
    objeto.title = await traducir(objeto.title);
    objeto.culture = await traducir(objeto.culture);
    objeto.dynasty = await traducir(objeto.dynasty);
  }
  return objeto;
}

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`Objeto no encontrado: ${url}`);
          return null; // Si el objeto no existe, devolvemos null
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error(`Error en intento ${i + 1}: ${error.message}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error; // Si se superan los intentos, lanzar el error
      }
    }
  }
}

module.exports = { obtenerDepartamentos, buscarObjetos, buscarObjetosPorId };
