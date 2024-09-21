# @2gis/mapgl-share

A sharing control for the `@2gis/mapgl` library.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

Here's an example of how to use the sharing control with @2gis/mapgl:

```js
import { Map } from '@2gis/mapgl';
import { ShareControl } from '@2gis/mapgl-share';

const map = new Map('map-container', {
    center: [55.751244, 37.618423],
    zoom: 10,
});

const control = new ShareControl(map, {
    locale: navigator.language,
    urlMaker: (center, zoom, rotation, pitch) => {
        const viewport = `${center.toString()}/${zoom}/p/${pitch}/r/${rotation}`;
 
        return `${self.origin}${location.pathname}?m=${encodeURIComponent(viewport)}`;
    },
})

```


## Control Options

| Option       | Type       | Description                                                                                   |
|--------------|------------|-----------------------------------------------------------------------------------------------|
| `position` | `ControlPosition` | Position of the control. |
| `locale`     | `string`   | Locale to use for UI elements.                                                                |
| `content`    | `string`   | Content of the control. Use this to customize the control button via providing custom HTML code. |
| `cssPrefix`  | `string`   | Prefix for CSS classes. Use this to customize the control appearance with your own styles.    |
| `urlMaker`   | `UrlMaker` | Function to construct sharing URL.                                                            |
| `mapCodeMaker` | `MapCode` | Function to construct map code.                                                               |

### ControlPosition

Possible values for `ControlPosition`:

- `topLeft`
- `topCenter`
- `topRight`
- `centerLeft`
- `centerRight`
- `bottomLeft`
- `bottomCenter`
- `bottomRight`

## Development

Install deps

```bash
npm i
```

To start the development server, run:

```
npm run dev
```

Build

```
npm run build
```

## License

This project is licensed under the MIT License.