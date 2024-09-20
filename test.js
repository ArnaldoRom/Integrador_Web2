const { traducir } = require("./traductor.js");
async function testTraduccion() {
  try {
    const texto = "Hello, World!";
    const traducido = await traducir(texto);
    console.log(`Texto original: ${texto}`);
    console.log(`Texto traducido: ${traducido}`);
  } catch (error) {
    console.error("Error en la traducción:", error);
  }
}

testTraduccion();
