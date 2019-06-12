import App from "./App";

async function initialize() {
  const app = new App();
  const optionInputs = document.querySelectorAll('#options input');
  await app.setup();
  optionInputs.forEach(i => i.addEventListener('change', () => { app.onChangeOptionInputs(); }));
  const restartButton = document.getElementById('restart');
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      app.stop();
      app.start();
    });
  }
  app.start();
}

window.addEventListener('load', initialize);
