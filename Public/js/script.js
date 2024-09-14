const formulario = document.getElementById("formulario");
const lista = document.getElementById("departamentos");
const resultado = document.getElementById("resultado");
const palabra = document.getElementById("texto");
const pais = document.getElementById("pais");
const botonPaginas = document.getElementById("paginas");

let paginaActual = 1;
let ultimaBusquedaUrl = "";

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

  let conImg = `search?hasImagen=true`;
  const idDepto = lista.value;
  const texto = palabra.value.trim();
  const ubicacion = pais.value.trim();

  if (idDepto) conImg += `&department=${idDepto}`;
  if (texto) conImg += `&q=${texto}`;
  if (ubicacion) conImg += `q=""&geoLocation=${loacalizacion}`;

  ultimaBusquedaUrl = conImg;
  paginaActual = 1;

  await buscarApi(conImg);
}

async function buscarApi(url) {
  const response = await fetch(url);
  const data = await response.json();

  resultado.innerHTML = "";
  data.forEach((objeto) => {
    const div = document.createElement(`div`);
    div.classList.add("resultados_contenedor");
    if (data.primaryImage) {
      const img = document.createElement(`img`);
      const h3 = document.createElement("h3");
      const p1 = document.createElement("p");
      const p2 = document.createElement("p");
      img.src = data.primaryImage;
      img.alt = data.title;
      img.classList.add("img");
      h3 = data.title;
      p1 = data.culture;
      p2 = data.dynasty;

      div.appendChild(img);
      div.appendChild(h3);
      div.appendChild(p1);
      div.appendChild(p2);
    }
    resultado.appendChild(div);
  });

  paginacion(data.length);
}

function paginacion(obejtosTotales) {
  botonPaginas.innerHTML = "";

  const paginasTotales = Math.ceil(obejtosTotales / 20);
  for (let i = 1; i <= paginaActual; i++) {
    const boton = document.createElement("button");
    boton.textContent = i;
    boton.disable = i === paginaActual;

    boton.addEventListener("click", async () => {
      paginaActual = i;
      await buscarApi(`${ultimaBusquedaUrl}&page = ${i}`);
    });
    botonPaginas.appendChild(boton);
  }
}

formulario.addEventListener("submit", crearBusqueda);
window.onload = obtenerDepartamentos;
