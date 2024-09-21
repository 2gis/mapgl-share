import { ShareControl } from '.';
import './style.css';
import { load } from '@2gis/mapgl';

const MAPGL_JS_API_KEY = 'cb20c5bf-34d3-4f0e-9b2b-33e9b8edb57f';

load().then(mapgl => {
  const url = new URL(location.href);

  const params = url.searchParams.get('m')?.split(/\//g);

  const map = new mapgl.Map(document.querySelector<HTMLDivElement>('#map')!, {
    key: MAPGL_JS_API_KEY,
    style: 'eb10e2c3-3c28-4b81-b74b-859c9c4cf47e',
    center: params ? params[0].split(',').map(Number) : [0,0],
    zoom: params ? +params[1] : 2, 
    pitch: params ? +params[3] : 0, 
    rotation: params ? +params[5] : 0,
    loopWorld: true,
    enableTrackResize: true,
    styleState: {
      immersiveRoadsOn: true
    }
  });

  new ShareControl(map, {
    locale: navigator.language,
    urlMaker: (center, zoom, rotation, pitch) => `${self.origin}${location.pathname}?m=${encodeURIComponent(`${center.toString()}/${zoom}/p/${pitch}/r/${rotation}`)}`,
    mapCodeMaker: (center, zoom, rotation, pitch) => {
      const id =`map-${Math.trunc(Math.random() * 10**9)}`;      
      return `<div id="${id}" style="width:540px;height:340px;"></div>
      <script src="https://mapgl.2gis.com/api/js/v1"></script>
      <script>
        new mapgl.Map(document.querySelector('#${id}'), {
          key: '${MAPGL_JS_API_KEY}',
          center: [${center.toString()}],
          zoom: ${zoom}, 
          pitch: ${pitch}, 
          rotation: ${rotation},
          styleState: {
            immersiveRoadsOn: true
          }
        });
      </script>`
    }
  })
});
