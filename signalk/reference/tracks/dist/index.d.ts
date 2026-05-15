import { Router } from 'express';
import { Tracks as Tracks_, TrackAccumulator as TrackAccumulator_ } from './tracks';
import { Context, Debug, Position } from './types';
export interface ContextPosition {
    context: Context;
    value: Position;
}
interface HistoryApi {
    getValues(query: any): Promise<HistoryValuesResponse>;
}
interface HistoryValuesResponse {
    context: string;
    range: {
        from: string;
        to: string;
    };
    values: any[];
    data: any[];
}
interface App {
    debug: Debug;
    error: (...args: any) => void;
    streambundle: {
        getBus: (path: string) => {
            onValue: (cb: (x: any) => void) => () => void;
        };
    };
    getSelfPath: (path: string) => void;
    selfContext: string;
    getHistoryApi?: () => Promise<HistoryApi>;
}
interface Plugin {
    start: (c: any) => void;
    stop: () => void;
    signalKApiRoutes: (r: Router) => Router;
    id: string;
    name: string;
    description: string;
    schema: any;
}
export default function ThePlugin(app: App): Plugin;
export declare class Tracks extends Tracks_ {
}
export declare class TrackAccumulator extends TrackAccumulator_ {
}
export {};
