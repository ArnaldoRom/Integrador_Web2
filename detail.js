document.addEventListener("DOMContentLoaded", async () => {
  const detallesDiv = document.getElementById("detalles");

  // Asegúrate de que objetoId está definida
  if (typeof objetoId === "undefined" || !objetoId) {
    detallesDiv.textContent = "No se proporcionó un ID de objeto";
    return;
  }

  try {
    const response = await fetch(`/objects/${objetoId}`);

    // Verifica que la respuesta sea exitosa
    if (!response.ok) {
      throw new Error(`Error al obtener el objeto: ${response.statusText}`);
    }

    const objeto = await response.json();

    if (objeto) {
      // Limpia el div antes de agregar nuevos detalles
      detallesDiv.innerHTML = "";

      // Imagen principal
      const img = document.createElement("img");
      img.src = objeto.primaryImage;
      img.alt = objeto.title;
      img.classList.add("detail-img");

      // Título
      const title = document.createElement("h2");
      title.textContent = objeto.title;

      // Cultura
      const culture = document.createElement("p");
      culture.textContent = `Culture: ${
        objeto.culture || "Información no disponible"
      }`;

      // Dinastía
      const dynasty = document.createElement("p");
      dynasty.textContent = `Dynasty: ${
        objeto.dynasty || "Información no disponible"
      }`;

      // Añadir al DOM
      detallesDiv.appendChild(img);
      detallesDiv.appendChild(title);
      detallesDiv.appendChild(culture);
      detallesDiv.appendChild(dynasty);

      // Mostrar imágenes adicionales si existen
      if (objeto.additionalImages && objeto.additionalImages.length > 0) {
        const additionalImagesDiv = document.createElement("div");
        additionalImagesDiv.classList.add("additional-images");

        objeto.additionalImages.forEach((imgUrl) => {
          const additionalImg = document.createElement("img");
          additionalImg.src = imgUrl;
          additionalImg.alt = `${objeto.title} - Additional Image`;
          additionalImg.classList.add("additional-img");
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
});
