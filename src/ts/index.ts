import { Theater } from './Theater';
import { ImageBack } from './ImageBack';
import { Hatsu } from './Hatsu';

// 960 * 540 - 720 * 540
// 480 * 270 - 360 * 270
// 640 * 360 - 480 * 360

async function initialize() {
  const result = document.getElementById('result_area');
  if (result === null) {
    return;
  }
  const b = new ImageBack();
  await b.load('./img/sample_back.png');
  const h = new Hatsu();
  await h.load('./img/hatsu.png');
  const t = new Theater('main_canvas', 480);
  t.addBack(b);
  t.append(result);
  t.draw();
}

window.addEventListener('load', initialize);
