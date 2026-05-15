"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watcher = exports.NotificationMgr = void 0;
const rxjs_1 = require("rxjs");
const server_api_1 = require("@signalk/server-api");
class NotificationMgr {
    _message;
    constructor(path, msg, state = server_api_1.ALARM_STATE.alert, method = [server_api_1.ALARM_METHOD.sound, server_api_1.ALARM_METHOD.visual]) {
        this._message = {
            path: `notifications.${path}`,
            value: typeof msg === 'string'
                ? {
                    state: state,
                    method: method,
                    message: msg
                }
                : null
        };
    }
    get message() {
        return this._message;
    }
}
exports.NotificationMgr = NotificationMgr;
// ** watch a value within a range (min-max)
class Watcher {
    changeSource = new rxjs_1.Subject();
    change$ = this.changeSource.asObservable();
    _rangeMin = 0;
    _rangeMax = 100;
    _sampleCount = 0; // number of values sampled
    _sampleSize = 1; // number of values to sample before range test
    _val = -1;
    _inRange = false;
    constructor() { }
    set value(val) {
        if (typeof val !== 'number') {
            return;
        }
        let hasChanged = this._val !== val;
        this._val = val;
        if (hasChanged) {
            this._sampleCount++;
            this._setValue(val);
        }
    }
    get value() {
        return this._val;
    }
    set rangeMax(value) {
        if (typeof value !== 'number') {
            return;
        }
        let hasChanged = this._rangeMax !== value;
        this._rangeMax = value;
        if (hasChanged) {
            this._setRange();
        }
    }
    get rangeMax() {
        return this._rangeMax;
    }
    set rangeMin(value) {
        if (typeof value !== 'number') {
            return;
        }
        let hasChanged = this._rangeMin !== value;
        this._rangeMin = value;
        if (hasChanged) {
            this._setRange();
        }
    }
    get rangeMin() {
        return this._rangeMin;
    }
    set sampleSize(value) {
        this._sampleSize =
            typeof value === 'number' && value > 0 ? value : this._sampleSize;
        this._sampleCount = 0;
    }
    get sampleSize() {
        return this._sampleSize;
    }
    isInRange(value = this._val) {
        return typeof value == 'number' &&
            value <= this.rangeMax &&
            value >= this.rangeMin
            ? true
            : false;
    }
    _setValue(val) {
        if (this._sampleCount < this._sampleSize) {
            return;
        }
        if (typeof val !== 'number') {
            this.changeSource.next({ type: 'exit', value: val });
            return;
        }
        let testInRange = this.isInRange(val);
        if (testInRange) {
            //console.log(`** new value is in range`)
            if (this._inRange) {
                //console.log(`** and was already in range`)
                this.changeSource.next({ type: 'in', value: val });
            }
            else {
                //console.log(`** and was previously outside range`)
                this.changeSource.next({
                    type: 'enter',
                    value: val,
                    fromBelow: this._val < this.rangeMin ? true : false
                });
            }
        }
        else {
            // console.log(`** new value is out of  range`)
            if (this._inRange) {
                //console.log(`** and was previously in range`)
                this.changeSource.next({
                    type: 'exit',
                    value: val,
                    isBelow: val < this.rangeMin ? true : false
                });
            }
        }
        this._inRange = testInRange;
        this._val = val;
        this._sampleCount = 0;
    }
    _setRange() {
        let testInRange = this.isInRange();
        if (testInRange) {
            //console.log(`** value is in new range`)
            if (this._inRange) {
                //console.log(`** and was already in range`)
                this.changeSource.next({ type: 'in', value: this._val });
            }
            else {
                //console.log(`** and was previously outside range`)e)
                this.changeSource.next({
                    type: 'enter',
                    value: this._val,
                    fromBelow: this._val < this.rangeMin ? true : false
                });
            }
        }
        else {
            //console.log(`** value is out of new range`)
            if (this._inRange) {
                //console.log(`** and was previously in range`)
                this.changeSource.next({
                    type: 'exit',
                    value: this._val,
                    isBelow: this._val < this.rangeMin ? true : false
                });
            }
            else {
                //console.log(`** and was previously out of range`)
            }
        }
        this._inRange = testInRange;
    }
}
exports.Watcher = Watcher;
//# sourceMappingURL=alarms.js.map