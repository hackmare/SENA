import { LatLngTuple, GeoBounds, QueryParameters, TrackParams, Debug } from './types';
export declare function createInBounds(bounds: GeoBounds): (position: LatLngTuple | null) => boolean;
export declare function validateParameters(params: QueryParameters, defaultMaxRadius: number | undefined): TrackParams;
export declare function createDistanceTo([lat1d, lon1d]: LatLngTuple, debug?: Debug): (d: LatLngTuple | null) => number;
export declare function createMatcher(params: TrackParams, selfPosition?: LatLngTuple, debug?: Debug): (track: LatLngTuple[]) => boolean;
