import type * as MapGL from "@2gis/mapgl/types";

import { ControlOptions } from "@2gis/mapgl/types";
import { copyTextToClipboard } from "./clipboard";
import { l } from "./l10n";

declare global {
    interface Window { 
        mapgl: typeof MapGL
    }
}

export type UrlMaker = (center: number[], zoom: number, rotation: number, pitch: number) => string;

export type MapCodeMaker = (center: number[], zoom: number, rotation: number, pitch: number) => string;

export interface ShareControlOptions extends Partial<ControlOptions> {
    /**
     * Locale to use for UI elements.
     */
    locale?: string,

    /**
     * Content of the control. Use this to customize the control button via providing custom HTML code.
     */
    content?: string,

    /**
     * Prefix for CSS classes. Use this to customize the control appearance with your own styles.
     */
    cssPrefix?: string,

    /**
     * Function to construct sharing URL.
     */
    urlMaker?: UrlMaker,

    /**
     * Function to construct map code.
     */
    mapCodeMaker?: MapCodeMaker
}

const iconUrl = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCg0KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8Zz4NCjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik05IDZMMTIgM00xMiAzTDE1IDZNMTIgM1YxM003LjAwMDIzIDEwQzYuMDY4MzUgMTAgNS42MDI0MSAxMCA1LjIzNDg2IDEwLjE1MjJDNC43NDQ4MSAxMC4zNTUyIDQuMzU1MjMgMTAuNzQ0OCA0LjE1MjI0IDExLjIzNDlDNCAxMS42MDI0IDQgMTIuMDY4MSA0IDEzVjE3LjhDNCAxOC45MjAxIDQgMTkuNDc5OCA0LjIxNzk5IDE5LjkwNzZDNC40MDk3MyAyMC4yODM5IDQuNzE1NDcgMjAuNTkwNSA1LjA5MTggMjAuNzgyMkM1LjUxOTIgMjEgNi4wNzg5OSAyMSA3LjE5NjkxIDIxSDE2LjgwMzZDMTcuOTIxNSAyMSAxOC40ODA1IDIxIDE4LjkwNzkgMjAuNzgyMkMxOS4yODQyIDIwLjU5MDUgMTkuNTkwNSAyMC4yODM5IDE5Ljc4MjIgMTkuOTA3NkMyMCAxOS40ODAyIDIwIDE4LjkyMSAyMCAxNy44MDMxVjEzQzIwIDEyLjA2ODEgMTkuOTk5OSAxMS42MDI0IDE5Ljg0NzcgMTEuMjM0OUMxOS42NDQ3IDEwLjc0NDggMTkuMjU1NCAxMC4zNTUyIDE4Ljc2NTQgMTAuMTUyMkMxOC4zOTc4IDEwIDE3LjkzMTkgMTAgMTcgMTAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjwvZz4NCjwvc3ZnPg==';

/**
 * Control for sharing map view for MapGL JS API.
 * 
 * @param map - MapGL instance.
 * @param options - Control options.
 * @returns ShareControl instance.
 * 
 * @example
 * 
 * ```js
 * import { ShareControl } from 'mapgl-share';
 * import { load } from '@2gis/mapgl';
 * 
 * const map = new mapgl.Map('map', {
 *  key: MAPGL_JS_API_KEY,
 *  ...
 * });
 * 
 * const control = new ShareControl(map, {
 *   locale: navigator.language,
 *   urlMaker: (center, zoom, rotation, pitch) => {
 *     const viewport = `${center.toString()}/${zoom}/p/${pitch}/r/${rotation}`;
 * 
 *     return `${self.origin}${location.pathname}?m=${encodeURIComponent(viewport)}`;
 *   },
 *   ...
 * })
 * ```
 */
export class ShareControl {
    private popup?: HTMLElement;
    private locale?: string;

    constructor (private map: MapGL.Map, private options: ShareControlOptions = {}) {
        options.cssPrefix ??= 'mapgl-share';
        this.locale = options.locale

        if (!options.urlMaker && !options.mapCodeMaker) {
            throw new Error('Do not know how to construct sharing URL or map code.')
        }

        const control = new window.mapgl.Control(
            map,
            options.content ?? `<button id="${options.cssPrefix}-button" title="${l('%buttonTitle%', this.locale)}" class="${options.cssPrefix}-border"><img src="${iconUrl}"></button>`, 
            {
                position: options.position ?? 'topRight',
                ...options
            }
        );
    
        const buttonEl = control
            .getContainer()
            .querySelector('button');
    
        if (!buttonEl) {
            return;
        }
    
        buttonEl.addEventListener('click', () => {
            this.showPopup();
            this.updateFields();
            this.updatePreview();
        });
    }

    private hidePopup() {
        if (this.popup) {
            this.popup.style.display = 'none';
        }
    }

    private updateFields () {
        if (!this.popup) {
            return;
        }
        const { cssPrefix, urlMaker, mapCodeMaker } = this.options;

        const map = this.map,
            center = map.getCenter(),
            zoom = map.getZoom(),
            rotation = map.getRotation(),
            pitch = map.getPitch();

        if (urlMaker) {
            const urlField = this.popup.querySelector<HTMLInputElement>(`#${cssPrefix}-url-field`);
            if (urlField) {
                urlField.value = urlMaker(center, zoom, rotation, pitch);
            }
        }

        if (mapCodeMaker) {
            const mapCodeField = this.popup.querySelector<HTMLInputElement>(`#${cssPrefix}-code-field`);
            if (mapCodeField) {
                mapCodeField.value = mapCodeMaker(center, zoom, rotation, pitch);
            }
        }
    }

    private showPopup () {
        if (this.popup) {
            this.popup.style.display = 'flex';
            return;
        }

        const { cssPrefix, urlMaker, mapCodeMaker } = this.options;
        const popup = document.createElement('div');

        popup.classList.add(`${cssPrefix}-popup`);

        popup.addEventListener('click', (ev) => {
            const target = ev.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }
            if (target.dataset.action === 'close') {
                this.hidePopup();
            }
            if (target.dataset.action === 'copy') {
                const prev = target.previousElementSibling;
                if (!prev || !(prev instanceof HTMLInputElement)) {
                    return;
                }
                copyTextToClipboard(prev.value);
            }
            if (target.dataset.action === 'preview') {
                this.togglePreview();
            }
        })

        popup.innerHTML = `<div class="${cssPrefix}-veil" data-action="close">
            <div class="${cssPrefix}-body ${cssPrefix}-border">
                <button class="${cssPrefix}-closer" data-action="close">×</button>
                <h3>${l('%popupTitle%', this.locale)}</h3>

                <p style="display: ${urlMaker ? 'block' : 'none'}">
                    <label>${l('%linkLabel%', this.locale)}</label>
                    <input id="${cssPrefix}-url-field" class="${cssPrefix}-input">
                    <button class="${cssPrefix}-copy" data-action="copy">${l('%copyButton%', this.locale)}</button>
                </p>

                <p style="display: ${mapCodeMaker ? 'block' : 'none'}">
                    <label>${l('%embedLabel%', this.locale)}</label>
                    <input id="${cssPrefix}-code-field" class="${cssPrefix}-input">
                    <button class="${cssPrefix}-copy" data-action="copy">${l('%copyButton%', this.locale)}</button>
                    <button class="${cssPrefix}-preview" data-action="preview">${l('%previewButton%', this.locale)}</button>
                </p>

                <iframe style="display: none;" width="560" height="360" id="${cssPrefix}-preview-placeholder"></iframe>
            </div>
        <div>
        `;

        document.body.appendChild(popup);
        this.popup = popup;
    }

    private togglePreview () {
        if (!this.popup) {
            return;
        }
        const { cssPrefix } = this.options;

        const previewEl = this.popup.querySelector<HTMLIFrameElement>(`#${cssPrefix}-preview-placeholder`);
        if (!previewEl) {
            return;
        }
        previewEl.style.display = previewEl.style.display === 'block' ? 'none' : 'block';

        this.updatePreview();
    }

    private updatePreview () {
        if (!this.popup) {
            return;
        }
        const { cssPrefix, mapCodeMaker } = this.options;
        if (!mapCodeMaker) {
            return;
        }
        const previewEl = this.popup.querySelector<HTMLIFrameElement>(`#${cssPrefix}-preview-placeholder`);
        if (!previewEl) {
            return;
        }

        if (previewEl.style.display === 'block') {
            const map = this.map,
            center = map.getCenter(),
            zoom = map.getZoom(),
            rotation = map.getRotation(),
            pitch = map.getPitch();

            previewEl.srcdoc = mapCodeMaker(center, zoom, rotation, pitch);
        } else {
            previewEl.srcdoc = '';
        }
    }
}