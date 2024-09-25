const detallesDiv = document.getElementById("detalles");

if (typeof objetoId === "undefined" || !objetoId) {
  detallesDiv.textContent = "No se proporcionó un ID de objeto";
  return;
}

try {
  const response = await fetch(`/objects/${objetoId}`);

  if (!response.ok) {
    throw new Error(`Error al obtener el objeto: ${response.statusText}`);
  }

  const objeto = await response.json();

  if (objeto) {
    detallesDiv.innerHTML = "";

    const img = document.createElement("img");
    img.src = objeto.primaryImage;
    img.alt = objeto.title;
    img.classList.add("detail-img");

    const title = document.createElement("h2");
    title.textContent = objeto.title;

    const culture = document.createElement("p");
    culture.textContent = `Culture: ${
      objeto.culture || "Información no disponible"
    }`;

    const dynasty = document.createElement("p");
    dynasty.textContent = `Dynasty: ${
      objeto.dynasty || "Información no disponible"
    }`;

    const botonD = document.createElement("button");
    botonD.textContent = "Volver";
    botonD.classList.add("boton-volver");
    botonD.addEventListener(`click`, () => {
      window.history.back();
    });

    detallesDiv.appendChild(img);
    detallesDiv.appendChild(title);
    detallesDiv.appendChild(culture);
    detallesDiv.appendChild(dynasty);
    detallesDiv.appendChild(botonD);

    if (objeto.additionalImages && objeto.additionalImages.length > 0) {
      const additionalImagesDiv = document.createElement("div");
      additionalImagesDiv.classList.add("pizarron");

      objeto.additionalImages.forEach((imgUrl) => {
        const additionalImg = document.createElement("img");
        additionalImg.src = imgUrl;
        additionalImg.alt = `${objeto.title} - Imagen adicional`;
        additionalImg.classList.add("img-ectra");
        additionalImagesDiv.appendChild(additionalImg);
      });

      detallesDiv.appendChild(additionalImagesDiv);
    }
  } else {
    detallesDiv.textContent = "Objeto no encontrado";
  }
} catch (error) {
  detallesDiv.textContent = "Error al cargar los detalles del objeto";
  console.error("Error:", error);
}
