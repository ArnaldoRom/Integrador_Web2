const formulario = document.getElementById("formulario");
const lista = document.getElementById("departamentos");
const resultado = document.getElementById("resultado");
const palabra = document.getElementById("texto");
const pais = document.getElementById("pais");
const botonPaginas = document.getElementById("paginas");
const spinner = document.getElementById("spinner");

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
  paginaActual = 1;
  ultimaBusquedaUrl = await construirUrl();
  await realizarBusqueda();
}

async function construirUrl() {
  const texto = palabra.value.trim();
  const localizacion = pais.value.trim();
  let url = `/search?q=${texto || ""}&hasImages=true`;

  if (lista.value) url += `&departmentId=${lista.value}`;
  if (localizacion) url += `&geoLocation=${localizacion}`;

  return url;
}

async function realizarBusqueda() {
  mostrarSpinner(true);
  const response = await fetch(ultimaBusquedaUrl);
  const data = await response.json();
  console.log(data);

  if (!data.objetos || data.length === 0) {
    resultado.innerHTML = "<p>No se encontraron resultados.</p>";
    botonPaginas.innerHTML = "";
    mostrarSpinner(false);
    return;
  }

  objetosBusqueda = data.objetos.map((objeto) => objeto.objectID);

  await mostrarResultados(objetosBusqueda);
  paginacion(data.total);
  mostrarSpinner(false);
}

async function mostrarResultados(idsObjetos) {
  resultado.innerHTML = "";
  const paginaObjetos = await Promise.all(
    idsObjetos
      .slice((paginaActual - 1) * 20, paginaActual * 20)
      .map(async (id) => await obtenerObjetos(id))
  );

  paginaObjetos.forEach((objeto) => crearCard(objeto));
}

async function obtenerObjetos(id) {
  const response = await fetch(`/objects/${id}`);
  return response.ok ? await response.json() : null;
}

function crearCard(objeto) {
  if (!objeto.primaryImage) return;

  const div = document.createElement(`div`);
  div.classList.add("resultados_contenedor");

  const img = document.createElement(`img`);
  img.src = objeto.primaryImage;
  img.alt = objeto.title;
  img.classList.add("img");

  const h3 = document.createElement("h3");
  h3.textContent = objeto.title;

  const p1 = document.createElement("p");
  p1.textContent = `Cultura: ${objeto.culture || "Información No disponible"}`;

  const p2 = document.createElement("p");
  p2.textContent = `Dinastia: ${objeto.dynasty || "Información No disponible"}`;

  const boton = document.createElement("button");
  boton.textContent = "Ver mas....";
  boton.classList.add(`boton-detalle`);
  boton.addEventListener(`click`, () => {
    window.location.href = `/detalle/${objeto.objectID}`; // PROBARR SIN EL WINDOWS
  });

  const overlay = document.createElement(`div`);
  overlay.classList.add(`overlay`);
  overlay.textContent = `Fecha de Creacion: ${
    objeto.objectDate || "Fecha no disponible "
  }`;

  overlay.appendChild(boton);
  div.appendChild(img);
  div.appendChild(h3);
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(overlay);

  resultado.appendChild(div);
}

function paginacion(objetosTotales) {
  botonPaginas.innerHTML = "";
  const paginasTotales = Math.ceil(objetosTotales / 20);

  for (let i = 1; i <= paginasTotales; i++) {
    const boton = document.createElement("button");
    boton.textContent = i;
    boton.disabled = i === paginaActual;

    boton.addEventListener("click", () => {
      paginaActual = i;
      mostrarResultados(i);
    });

    botonPaginas.appendChild(boton);
  }
}

function mostrarSpinner(mostrar) {
  spinner.hidden = !mostrar;
}

formulario.addEventListener("submit", crearBusqueda);
window.onload = obtenerDepartamentos;
