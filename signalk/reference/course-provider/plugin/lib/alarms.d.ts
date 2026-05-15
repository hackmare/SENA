import { Observable } from 'rxjs';
import { ALARM_METHOD, ALARM_STATE, PathValue } from '@signalk/server-api';
export declare class NotificationMgr {
    private _message;
    constructor(path: string, msg: string | null, state?: ALARM_STATE, method?: ALARM_METHOD[]);
    get message(): PathValue;
}
export interface WatchEvent {
    type: 'enter' | 'in' | 'exit';
    value: number;
    fromBelow?: boolean;
    isBelow?: boolean;
}
export declare class Watcher {
    private changeSource;
    change$: Observable<WatchEvent>;
    private _rangeMin;
    private _rangeMax;
    private _sampleCount;
    private _sampleSize;
    private _val;
    private _inRange;
    constructor();
    set value(val: number);
    get value(): number;
    set rangeMax(value: number);
    get rangeMax(): number;
    set rangeMin(value: number);
    get rangeMin(): number;
    set sampleSize(value: number);
    get sampleSize(): number;
    isInRange(value?: number): boolean;
    private _setValue;
    private _setRange;
}
//# sourceMappingURL=alarms.d.ts.map