import type * as MapGL from "@2gis/mapgl/types";
import { ControlOptions } from "@2gis/mapgl/types";
declare global {
    interface Window {
        mapgl: typeof MapGL;
    }
}
export type UrlMaker = (center: number[], zoom: number, rotation: number, pitch: number) => string;
export type MapCodeMaker = (center: number[], zoom: number, rotation: number, pitch: number) => string;
export interface ShareControlOptions extends Partial<ControlOptions> {
    /**
     * Locale to use for UI elements.
     */
    locale?: string;
    /**
     * Content of the control. Use this to customize the control button via providing custom HTML code.
     */
    content?: string;
    /**
     * Prefix for CSS classes. Use this to customize the control appearance with your own styles.
     */
    cssPrefix?: string;
    /**
     * Function to construct sharing URL.
     */
    urlMaker?: UrlMaker;
    /**
     * Function to construct map code.
     */
    mapCodeMaker?: MapCodeMaker;
}
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
export declare class ShareControl {
    private map;
    private options;
    private popup?;
    private locale?;
    constructor(map: MapGL.Map, options?: ShareControlOptions);
    private hidePopup;
    private updateFields;
    private showPopup;
    private togglePreview;
    private updatePreview;
}
