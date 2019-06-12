import App from "./App";

async function initialize() {
  const app = new App();
  const optionInputs = document.querySelectorAll('#options input');
  await app.setup();
  optionInputs.forEach(i => i.addEventListener('change', () => { app.onChangeOptionInputs(); }));
  app.start();
}

window.addEventListener('load', initialize);
