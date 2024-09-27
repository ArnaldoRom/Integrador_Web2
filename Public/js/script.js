//------------------------- ELEMENTOS DEL DOOM -----------------------------//
const formulario = document.getElementById("formulario");
const lista = document.getElementById("departamentos");
const resultado = document.getElementById("resultado");
const noResultado = document.getElementById("no_encontrado");
const palabra = document.getElementById("texto");
const pais = document.getElementById("pais");
const botonPaginas = document.getElementById("paginas");
const contenedor = document.getElementById("formulario-contenedor");
const spinner = document.getElementById("spinner-contenedor");

// Variables para el manejo de paginación y almacenamiento de resultados.
let paginaActual = 1;
let ultimaBusquedaUrl = "";
let objetosBusqueda = [];
let objetosPorPagina = [];

// Función para obtener los departamentos disponibles de la API.
async function obtenerDepartamentos() {
  try {
    const response = await fetch(`/departments`);

    if (!response.ok) {
      throw new Error(`Error al solicitar los datos: ${response.status}`);
    }

    const data = await response.json();
    data.forEach((departementos) => {
      const option = document.createElement("option");
      option.value = departementos.departmentId;
      option.textContent = departementos.displayName;
      lista.appendChild(option);
    });
  } catch (error) {
    console.error("Error al obtener departamentos: ", error);
    alert(
      "Se produjo un inconveniente al cargar los departamentos. Actualice la pagina "
    );
  }
}

// Función para manejar la búsqueda cuando se envía el formulario.
async function crearBusqueda(event) {
  event.preventDefault();
  mostrarSpinner(true);

  contenedor.style.height = "80vh";
  resultado.style.display = "grid";
  botonPaginas.style.display = "flex";

  try {
    paginaActual = 1;
    ultimaBusquedaUrl = await construirUrl();
    await realizarBusqueda();
  } catch (error) {
    console.error("Error al crear la busqueda seleccionada: ", error);
    alert("Hubo un problema al realizar la busqueda. Intentelo nuevamente");
  }
}

// Función para construir la URL de búsqueda basándose en los inputs del usuario.
async function construirUrl() {
  try {
    const texto = palabra.value.trim();
    const localizacion = pais.value.trim();
    let url = `/search?q=${texto || ""}&hasImages=true`;

    if (lista.value) url += `&departmentId=${lista.value}`;
    if (localizacion) url += `&geoLocation=${localizacion}`;

    return url;
  } catch (error) {
    console.error("Error al construir la URL: ", error);
    alert(
      "Se detecto un problema al intentar contruir la URL. Intentelo nuevamente "
    );
    return "";
  }
}

// Función para realizar la búsqueda y manejar los resultados.
async function realizarBusqueda() {
  resultado.innerHTML = "";
  botonPaginas.innerHTML = "";
  noResultado.style.display = "none";

  try {
    const response = await fetch(ultimaBusquedaUrl);
    if (!response.ok) {
      throw new Error(`Error en la busqueda: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.objetos || data.objetos.length === 0) {
      noResultado.innerHTML = "";
      const msj = document.createElement("p");
      msj.textContent = "No se encontraron resultados.";
      noResultado.classList.add("mensaje_error");
      noResultado.style.display = "block";
      noResultado.appendChild(msj);
      botonPaginas.innerHTML = "";
      mostrarSpinner(false);
      return;
    }

    objetosBusqueda = data.objetos.map((objeto) => objeto.objectID);

    for (let i = 1; i <= Math.ceil(data.total / 20); i++) {
      const idsPorPaginas = objetosBusqueda.slice((i - 1) * 20, i * 20);
      objetosPorPagina[i] = await Promise.all(
        idsPorPaginas.map(async (id) => await obtenerObjetos(id))
      );
    }

    await mostrarResultados(paginaActual);
    paginacion(data.total);
  } catch (error) {
    console.error(`Error al realizar la busqueda: `, error);
    alert("Error al realizar la busqueda. Vuelva a intentar");
  } finally {
    mostrarSpinner(false);
  }
}

// Función para mostrar los resultados en la interfaz.
async function mostrarResultados(idsObjetos) {
  resultado.innerHTML = "";
  const paginaObjetos = objetosPorPagina[idsObjetos] || [];

  paginaObjetos.forEach((objeto) => {
    if (objeto) crearCard(objeto);
  });
}

// Función para obtener los detalles de un objeto específico por ID.
async function obtenerObjetos(id) {
  try {
    const response = await fetch(`/objects/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener objetos: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al querer obtener objetos: `, error);
    alert("Error al recuperar los objetos. Vuelva a intentar");
    return null;
  }
}

// Función para crear y mostrar una tarjeta de un objeto.
function crearCard(objeto) {
  try {
    if (!objeto.primaryImage && objeto.title == "") return;

    const div = document.createElement(`div`);
    div.classList.add("card");

    const img = document.createElement(`img`);
    img.src = objeto.primaryImage || `https://via.placeholder.com/150`;
    img.alt = objeto.title;
    img.classList.add("img");

    const h3 = document.createElement("h3");
    h3.textContent = objeto.title;

    const p1 = document.createElement("p");
    p1.textContent = `Cultura: ${
      objeto.culture || "Información No disponible"
    }`;

    const p2 = document.createElement("p");
    p2.textContent = `Dinastia: ${
      objeto.dynasty || "Información No disponible"
    }`;

    const overlay = document.createElement(`div`);
    overlay.classList.add(`overlay`);
    overlay.textContent = `Fecha de Creacion: ${
      objeto.objectDate || "Fecha no disponible "
    }`;

    if (objeto.additionalImages && objeto.additionalImages.length > 0) {
      const boton = document.createElement("button");
      boton.textContent = "Ver mas....";
      boton.classList.add(`boton-detalle`);
      boton.addEventListener(`click`, () => {
        window.location.href = `/detalle/${objeto.objectID}`;
      });

      overlay.appendChild(boton);
    }

    div.appendChild(h3);
    div.appendChild(img);
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(overlay);

    resultado.appendChild(div);
  } catch (error) {
    console.error(`Error al crear la tarjeta: `, error);
    alert("Error al crear las tarjetas con los objetos");
  }
}

// Función para manejar la paginación de los resultados.
function paginacion(objetosTotales) {
  try {
    botonPaginas.innerHTML = "";

    const paginasTotales = Math.ceil(objetosTotales / 20);

    for (let i = 1; i <= paginasTotales; i++) {
      const boton = document.createElement("button");
      boton.textContent = i;
      boton.disabled = i === paginaActual;

      if (i === paginaActual) {
        boton.classList.add("active");
      }

      boton.addEventListener("click", () => {
        paginaActual = i;
        mostrarResultados(i);
        actualizarBotonesPaginacion();
      });

      botonPaginas.appendChild(boton);
    }
  } catch (error) {
    console.error(`Error en la paginacion: `, error);
    alert("Se produjo un error al crear la paginacion");
  }
}

// Función para cambiar a una página específica.
function actualizarBotonesPaginacion() {
  try {
    const botones = botonPaginas.querySelectorAll("button");
    botones.forEach((boton, index) => {
      boton.disabled = index + 1 === paginaActual;

      if (index + 1 === paginaActual) {
        boton.classList.add("active");
      } else {
        boton.classList.remove("active");
      }
    });
  } catch (error) {
    console.error("Error al actualizar los botones de paginación:", error);
    alert(`Error al actualizar botones de paginas`);
  }
}

// Función para mostrar u ocultar el spinner de carga.
function mostrarSpinner(mostrar) {
  if (mostrar) {
    spinner.style.display = "flex";
  } else {
    spinner.style.display = "none";
  }
}

// Al cargar la página, se obtienen los departamentos.
formulario.addEventListener("submit", crearBusqueda);
window.onload = obtenerDepartamentos;
