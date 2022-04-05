const express = require("express");
const app = express();
const rotas = require("./routes/rotas");
const path = require("path");
const model = require("./model/dados");
const pup = require("puppeteer");

app.use(express.static("./resources/styles/"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(rotas);

app.listen(3000);

const url = "https://blaze.com/pt/games/double";
const roleta = "#roulette-timer > div.progress-bar";
const elementBancaVermelho =
  "#roulette > div > div.col-wrapper > div > div.col-md-4.col-xs-12.margin-xs.left > div > div.header.header-mobile > div.right > div.total > div.counter > span"; // select the element
const elementBancaPreto =
  "#roulette > div > div.col-wrapper > div > div.col-md-4.col-xs-12.right > div > div.header.header-mobile > div.right > div.total > div.counter > span";
const elementBancaBranco =
  "#roulette > div > div.col-wrapper > div > div.col-md-4.col-xs-12.margin-xs.mid > div > div.header.header-mobile > div.right > div.total > div.counter > span";
const elementResultado = "#roulette-timer > div.time-left > b";

(async () => {
  const browser = await pup.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  while (true) {
    await page.waitForSelector(roleta, { visible: true, timeout: 1000 * 60 * 60 * 24 });
    await page.waitForTimeout(15000);

    const bancaVermelho = await page.$(elementBancaVermelho);
    const bancaBranco = await page.$(elementBancaBranco);
    const bancaPreto = await page.$(elementBancaPreto);

    const valorVermelho = await page.evaluate(
      (el) => el.textContent,
      bancaVermelho
    );
    const valorPreto = await page.evaluate((el) => el.textContent, bancaPreto);
    const valorBranco = await page.evaluate(
      (el) => el.textContent,
      bancaBranco
    );

    const valorBrancoFormatado = formatarBanca(valorBranco);
    const valorPretoFormatado = formatarBanca(valorPreto);
    const valorVermelhoFormatado = formatarBanca(valorVermelho);

    console.log(valorVermelho + "\n" + valorPreto + "\n" + valorBranco);
    await page.waitForSelector(elementResultado, { visible: true, timeout: 1000 * 60 * 60 * 24 });

    const resultado = await page.$(elementResultado);
    const valorResultado = await page.evaluate(
      (el) => el.textContent,
      resultado
    );

    let data = new Date();

    const resultadoCor = verificarCor(valorResultado);

    console.log(resultadoCor);
    console.log(data);

    await model.armazenarDados(
      valorVermelhoFormatado,
      valorPretoFormatado,
      valorBrancoFormatado,
      data,
      resultadoCor
      );
  }
})();

function formatarBanca(valor) {
  valor = valor.replace("R$ ", "");
  parseFloat(valor).toFixed(2);
  return valor;
}

function verificarCor(valor) {
  valor = valor.replace("!", "");
  parseInt(valor);

  if (valor == 0) {
    return "Branco";
  }

  if (valor <= 7) {
    return "Vermelho";
  }

  if (valor >= 7) {
    return "Preto";
  }
}
