import { Observable, Subject } from 'rxjs';
import { Context, Debug, LatLngTuple, TrackCollection, TrackParams } from './types';
interface tracksMap {
    [context: string]: TrackAccumulator;
}
interface VesselTrack {
    context: string;
    track: LatLngTuple[];
}
export interface TracksConfig {
    resolution: number;
    pointsToKeep: number;
    fetchInitialTrack?: boolean;
}
export declare class Tracks {
    tracks: tracksMap;
    debug: Debug;
    config: TracksConfig;
    constructor(config: TracksConfig, debug: Debug);
    newPosition(context: Context, position: LatLngTuple): void;
    initialTrack(context: Context, track: LatLngTuple[]): void;
    getAccumulator(context: Context, createIfMissing?: boolean): TrackAccumulator | undefined;
    get(context: Context): Promise<LatLngTuple[]>;
    getAllTracks(): Promise<VesselTrack[]>;
    getFilteredTracks(params: TrackParams, selfPosition?: LatLngTuple, debug?: Debug): Promise<TrackCollection>;
    prune(maxAge: number): void;
}
interface AccumulatorParams {
    resolution: number;
    pointsToKeep: number;
    fetchTrackFor?: string;
}
export declare class TrackAccumulator {
    initialTrack: Subject<LatLngTuple[]>;
    input: Subject<LatLngTuple>;
    latestLatLngTuple: number;
    accumulatedTrack: Observable<LatLngTuple[]>;
    track: Observable<LatLngTuple[]>;
    constructor({ resolution, pointsToKeep, fetchTrackFor }: AccumulatorParams);
    nextLatLngTuple(position: LatLngTuple): void;
    setInitialTrack(track: LatLngTuple[]): void;
}
export {};
