const traductor = require("node-google-translate-skidz");

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
