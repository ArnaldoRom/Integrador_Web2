const fetch = require("node-fetch");
const API_base = `https://collectionapi.metmuseum.org/public/collection/v1`;

async function obtenerDepartamentos() {
  const response = await fetch(`${API_base}/departments`);
  const data = await response.json();
  return data.departments;
}

async function buscarObjetos(dtos, palabra, loacalizacion, pagina = 1) {
  let noImg = `${API_base}/search?hasImagen=true`;

  if (dtos) noImg += `&departments=${dtos}`;
  if (palabra) noImg += `&q=${palabra}`;
  if (loacalizacion) noImg += `q=""&geoLocation=${loacalizacion}`;

  const response = await fetch(noImg);
  const data = await response.json();

  if (!data.objectIDs || data.objectIDs.length === 0) return [];

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
