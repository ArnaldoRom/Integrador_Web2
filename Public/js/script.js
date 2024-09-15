const formulario = document.getElementById("formulario");
const lista = document.getElementById("departamentos");
const resultado = document.getElementById("resultado");
const palabra = document.getElementById("texto");
const pais = document.getElementById("pais");
const botonPaginas = document.getElementById("paginas");

const API_base = `https://collectionapi.metmuseum.org/public/collection/v1`;
let paginaActual = 1;
let ultimaBusquedaUrl = "";
let objetosBusqueda = [];

async function obtenerDepartamentos() {
  const response = await fetch(`/departments`);
  const data = await response.json();

  data.forEach((departementos) => {
    const option = document.createElement("option");
    option.value = departementos.departmentId;
    option.textContent = departementos.displayName;
    lista.appendChild(option);
  });
}

async function crearBusqueda(event) {
  event.preventDefault();

  const idDepto = lista.value;
  const texto = palabra.value.trim();
  const localizacion = pais.value.trim();

  let conImg = `${API_base}/search?q=${texto || ""}&hasImages=true`;

  if (idDepto) conImg += `&departmentId=${idDepto}`;
  if (localizacion) conImg += `&geoLocation=${localizacion}`;

  ultimaBusquedaUrl = conImg;
  paginaActual = 1;

  await buscarApi(conImg);
}

async function buscarApi(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.objectIDs || data.objectIDs.length === 0) {
    resultado.innerHTML = "<p>No se encontraron resultados.</p>";
    botonPaginas.innerHTML = "";
    return;
  }

  objetosBusqueda = data.objectIDs;

  paginasConObjetos();
  paginacion(objetosBusqueda.length);
}

async function paginasConObjetos() {
  resultado.innerHTML = "";

  const idsObjetos = objetosBusqueda.slice(
    (paginaActual - 1) * 20,
    paginaActual * 20
  );

  for (const id of idsObjetos) {
    const responseObjeto = await fetch(`${API_base}/objects/${id}`);
    const objeto = await responseObjeto.json();

    const div = document.createElement(`div`);
    div.classList.add("resultados_contenedor");

    if (objeto.primaryImage) {
      const img = document.createElement(`img`);
      img.src = objeto.primaryImage;
      img.alt = objeto.title;
      img.classList.add("img");

      const h3 = document.createElement("h3");
      h3.textContent = objeto.title;

      const p1 = document.createElement("p");
      p1.textContent = objeto.culture || "Informacion No disponible";

      const p2 = document.createElement("p");
      p2.textContent = objeto.dynasty || "Informacion No disponible";

      div.appendChild(img);
      div.appendChild(h3);
      div.appendChild(p1);
      div.appendChild(p2);
    }
    resultado.appendChild(div);
  }
}

function paginacion(objetosTotales) {
  botonPaginas.innerHTML = "";

  const paginasTotales = Math.ceil(objetosTotales / 20);

  for (let i = 1; i <= paginasTotales; i++) {
    const boton = document.createElement("button");
    boton.textContent = i;
    boton.disable = i === paginaActual;

    boton.addEventListener("click", async () => {
      paginaActual = i;
      paginasConObjetos();
    });
    botonPaginas.appendChild(boton);
  }
}

formulario.addEventListener("submit", crearBusqueda);
window.onload = obtenerDepartamentos;
