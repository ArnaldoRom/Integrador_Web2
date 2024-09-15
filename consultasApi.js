const fetch = require("node-fetch");
const API_base = `https://collectionapi.metmuseum.org/public/collection/v1`;

async function obtenerDepartamentos() {
  const response = await fetch(`${API_base}/departments`);
  const data = await response.json();
  return data.departments;
}

async function buscarObjetos(dtos, palabra, localizacion, pagina = 1) {
  let urlBusqueda = `${API_base}/search?hasImages=true`;

  if (dtos) urlBusqueda += `&departmentId=${dtos}`;
  if (palabra) urlBusqueda += `&q=${palabra}`;
  if (localizacion) urlBusqueda += `&geoLocation=${localizacion}`;

  const response = await fetch(urlBusqueda);
  const data = await response.json();

  if (!data.objectIDs || data.objectIDs.length === 0) {
    return [];
  }

  const idsObjetos = data.objectIDs.slice((pagina - 1) * 20, pagina * 20);
  const objetos = await Promise.all(
    idsObjetos.map(async (id) => {
      const responseObjeto = await fetch(`${API_base}/objects/${id}`);
      const objetoData = await responseObjeto.json();
      return objetoData;
    })
  );

  return objetos.filter((obj) => obj.primaryImage);
}

module.exports = { obtenerDepartamentos, buscarObjetos };
