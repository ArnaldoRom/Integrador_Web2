const formulario = document.getElementById("formulario");
const lista = document.getElementById("departamentos");
const resultado = document.getElementById("resultado");
const palabra = document.getElementById("texto");
const pais = document.getElementById("pais");
const botonPaginas = document.getElementById("paginas");

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

  let conImg = `/search?q=${texto || ""}&hasImages=true`;

  if (idDepto) conImg += `&departmentId=${idDepto}`;
  if (localizacion) conImg += `&geoLocation=${localizacion}`;

  ultimaBusquedaUrl = conImg;
  paginaActual = 1;

  await buscarApi(ultimaBusquedaUrl);
}

async function buscarApi(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    resultado.innerHTML = "<p>No se encontraron resultados.</p>";
    botonPaginas.innerHTML = "";
    return;
  }

  objetosBusqueda = data.map((objeto) => objeto.objectID);

  await paginasConObjetos();
  paginacion(objetosBusqueda.length);
}

async function paginasConObjetos() {
  resultado.innerHTML = "";

  const idsObjetos = objetosBusqueda.slice(
    (paginaActual - 1) * 20,
    paginaActual * 20
  );

  const objetos = [];

  await Promise.all(
    idsObjetos.map(async (id) => {
      try {
        const responseObjeto = await fetch(`/objects/${id}`);
        const objeto = await responseObjeto.json();
        if (objeto.primaryImage) {
          objetos.push(objeto);
        }
      } catch (error) {
        console.error(`Error al obtener objeto con ID: ${id}`);
      }
    })
  );

  objetos.forEach((objeto) => {
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
      p1.textContent = objeto.culture || "Informacion No disponible Script";

      const p2 = document.createElement("p");
      p2.textContent = objeto.dynasty || "Informacion No disponible Script";

      div.appendChild(img);
      div.appendChild(h3);
      div.appendChild(p1);
      div.appendChild(p2);
    }

    resultado.appendChild(div);
  });
}

function paginacion(objetosTotales) {
  botonPaginas.innerHTML = "";

  const paginasTotales = Math.ceil(objetosTotales / 20);

  for (let i = 1; i <= paginasTotales; i++) {
    const boton = document.createElement("button");
    boton.textContent = i;
    boton.disabled = i === paginaActual;

    boton.addEventListener("click", async () => {
      paginaActual = i;
      await paginasConObjetos();
      paginacion(objetosTotales);
    });
    botonPaginas.appendChild(boton);
  }
}

formulario.addEventListener("submit", crearBusqueda);
window.onload = obtenerDepartamentos;
