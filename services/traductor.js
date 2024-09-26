const traductor = require("node-google-translate-skidz");

//------------- FUNCION PARA TRADUCIR --------------------//
/* Se le pasa un parametro llamado texto que los traduce de INGLES a ESPAÑOL y se retorna el texto traducido */
async function traducir(texto) {
  if (!texto) {
    return Promise.resolve("");
  }
  return new Promise((resolve, reject) => {
    traductor(
      {
        text: texto,
        source: "en",
        target: "es",
      },
      (resultado) => {
        resolve(resultado.translation);
      }
    );
  });
}

module.exports = { traducir };
