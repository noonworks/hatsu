import App from "./App";

type MimeType = {
  mime: string,
  ext: string,
};

const MIME_TYPES: MimeType[] = [
  { mime: 'video/mpeg', ext: 'mpeg' },
  { mime: 'video/webm;codecs=H264', ext: 'webm' },
  { mime: 'video/webm', ext: 'webm' },
];

function getMime(): MimeType {
  for (let i = 0; i < MIME_TYPES.length; i++) {
    if ((MediaRecorder as any).isTypeSupported(MIME_TYPES[i].mime)) {
      return MIME_TYPES[i];
    }
  }
  return {
    mime: '',
    ext: '',
  };
}

async function initialize() {
  const app = new App();
  await app.setup();
  const recordButton = document.getElementById('restart_record');
  // options
  const optionInputs = document.querySelectorAll('#options input');
  optionInputs.forEach(i => i.addEventListener('change', () => { app.onChangeOptionInputs(); }));
  // restart
  const restartButton = document.getElementById('restart');
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      app.stop();
      app.start();
    });
  }
  // mime
  const mime = getMime();
  const canDL = mime.mime.length > 0;
  // download
  const dlMsg = document.getElementById('download_message');
  if (canDL && dlMsg) {
    dlMsg.innerText = '※表示された内容を録画するので、ダウンロードまで1周分待ってね';
  }
  const dlLink = document.getElementById('download_link');
  const dlArea = document.getElementById('download_area');
  const dlVideo = document.createElement('video');
  const ondataavailable: (event: MediaRecorderDataAvailableEvent) => void = (e) => {
    const url = URL.createObjectURL(e.data);
    dlVideo.src = url;
    if (dlLink && dlArea) {
      (dlLink as HTMLLinkElement).href = url;
      (dlLink as HTMLLinkElement).setAttribute('download', 'hatsu.' + mime.ext);
      dlArea.style.display = 'block';
    }
    if (recordButton) {
      recordButton.innerText = '最初から再生して録画';
      (recordButton as HTMLButtonElement).disabled = false;
    }
  };
  // record
  if (recordButton) {
    if (canDL) {
      recordButton.addEventListener('click', () => {
        recordButton.innerText = '録画中...';
        (recordButton as HTMLButtonElement).disabled = true;
        app.record(ondataavailable, mime.mime);
      });
    } else {
      recordButton.style.display = 'none';
    }
  }
  app.start();
}

window.addEventListener('load', initialize);
