import type { OutgoingHttpHeaders } from 'http';
type MapSourceType = 'tilelayer' | 'S-57' | 'WMS' | 'WMTS' | 'mapstyleJSON' | 'tileJSON';
export interface MBTilesHandle {
    getTile: (z: number, x: number, y: number, callback: (err: Error | null, tile: Buffer, headers: OutgoingHttpHeaders) => void) => void;
    getInfo: (callback: (err: Error | null, metadata: MBTilesMetadata) => void) => void;
    close: (callback: (err: Error | null) => void) => void;
    on: (event: 'error', listener: (err: Error) => void) => MBTilesHandle;
}
export interface MBTilesMetadata {
    name?: string;
    id?: string;
    description?: string;
    bounds?: number[] | string;
    minzoom?: number;
    maxzoom?: number;
    format?: string;
    scale?: string;
    vector_layers?: Array<{
        id: string;
    }>;
}
export interface ChartProvider {
    _fileFormat?: 'mbtiles' | 'directory';
    _filePath: string;
    _mbtilesHandle?: MBTilesHandle;
    _flipY?: boolean;
    identifier: string;
    name: string;
    description: string;
    type: MapSourceType;
    scale: number;
    v1?: {
        tilemapUrl: string;
        chartLayers?: string[];
    };
    v2?: {
        url: string;
        layers?: string[];
    };
    bounds?: number[];
    minzoom?: number;
    maxzoom?: number;
    format?: string;
    style?: string;
    layers?: string[];
    proxy?: boolean;
    remoteUrl?: string;
    headers?: {
        [key: string]: string;
    };
}
export interface OnlineChartProvider {
    name: string;
    description: string;
    minzoom: number;
    maxzoom: number;
    serverType: MapSourceType;
    format: 'png' | 'jpg';
    url: string;
    proxy: boolean;
    headers?: string[];
    style: string;
    layers: string[];
}
export {};
//# sourceMappingURL=types.d.ts.map