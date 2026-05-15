"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdownAlarms = exports.initAlarms = void 0;
const tslib_1 = require("tslib");
const server_api_1 = require("@signalk/server-api");
const uuid = tslib_1.__importStar(require("uuid"));
const geolib_1 = require("geolib");
const AREA_TRIGGERS = ['entry', 'exit'];
const AREA_GEOMETRIES = ['polygon', 'circle', 'region'];
const ALARM_API_PATH = '/signalk/v2/api/alarms';
class AreaAlarmManager {
    alarms;
    constructor() {
        this.alarms = new Map();
    }
    /**
     * Remove area from alarm manager
     * @param id Area identifier
     */
    delete(id) {
        // clean up notification
        this.alarms.delete(id);
        emitNotification({
            path: `notifications.area.${id}`,
            value: null
        });
    }
    /**
     * Trigger alarm status update assessment
     * @param id Area identifier
     * @param condition current condition
     * @returns void
     */
    update(id, condition) {
        if (!alarmAreas.has(id)) {
            return;
        }
        if (!this.alarms.has(id)) {
            this.alarms.set(id, {
                alarmId: id,
                active: false,
                lastUpdate: Date.now() - 1000
            });
        }
        this.assessStatus(id, condition);
    }
    /**
     * Silence alarm with the supplied identifier
     * @param id Area identifier
     */
    silence(id) {
        const n = getSelfPathValue(`notifications.area.${id}`);
        if (n?.value && Array.isArray(n.value.method)) {
            const m = n.value.method.filter((i) => i !== 'sound');
            n.value.method = m;
        }
        emitNotification({
            path: `notifications.area.${id}`,
            value: n?.value
        });
    }
    /**
     * Assess and emit alarm based on supplied condition
     * @param id alarm id
     * @param condition current condition
     */
    assessStatus(id, condition) {
        if (!alarmAreas.has(id)) {
            return;
        }
        const area = alarmAreas.get(id);
        const alarm = this.alarms.get(id);
        let notify = false;
        if (area.trigger === 'entry') {
            if (condition === 'inside' && !alarm.active) {
                // transition to active
                alarm.active = true;
                notify = true;
                server.debug(`*** inactive -> to active (${id})`);
            }
            if (condition === 'outside' && alarm.active) {
                // transition to inactive
                alarm.active = false;
                notify = true;
                server.debug(`*** active -> to inactive (${id})`);
            }
        }
        else {
            if (condition === 'outside' && !alarm.active) {
                // transition to active
                alarm.active = true;
                notify = true;
                server.debug(`*** inactive -> to active (${id})`);
            }
            if (condition === 'inside' && alarm.active) {
                // transition to inactive
                alarm.active = false;
                notify = true;
                server.debug(`*** active -> to inactive (${id})`);
            }
        }
        if (notify) {
            alarm.lastUpdate = Date.now();
            const msg = area.trigger === 'entry'
                ? alarm.active
                    ? `Monitored area ${area.name ? area.name + ' ' : ''}has been entered.`
                    : ''
                : alarm.active
                    ? `Vessel has left the monitored area ${area.name ?? ''}`
                    : '';
            const state = alarm.active ? server_api_1.ALARM_STATE.alarm : server_api_1.ALARM_STATE.normal;
            emitNotification({
                path: `notifications.area.${id}`,
                value: {
                    message: msg,
                    method: [server_api_1.ALARM_METHOD.sound, server_api_1.ALARM_METHOD.visual],
                    state: state
                }
            });
        }
    }
}
// ******************************************************************
let server;
let pluginId;
let unsubscribes = [];
const alarmAreas = new Map();
const alarmManager = new AreaAlarmManager();
const getSelfPathValue = (path) => {
    return server.getSelfPath(path);
};
const initAlarms = (app, id) => {
    server = app;
    pluginId = id;
    server.debug(`** initAlarms() **`);
    initAlarmEndpoints();
    setTimeout(() => parseRegionList(), 5000);
    // subscribe to deltas
    const subCommand = {
        context: 'vessels.self',
        subscribe: [
            {
                path: 'resources.*',
                policy: 'instant'
            },
            {
                path: 'navigation.position',
                policy: 'instant'
            }
        ]
    };
    server.subscriptionmanager.subscribe(subCommand, unsubscribes, (err) => {
        console.log(`error: ${err}`);
    }, handleDeltaMessage);
};
exports.initAlarms = initAlarms;
const shutdownAlarms = () => {
    unsubscribes.forEach((s) => s());
    unsubscribes = [];
};
exports.shutdownAlarms = shutdownAlarms;
const handleDeltaMessage = (delta) => {
    if (!delta.updates) {
        return;
    }
    delta.updates.forEach((u) => {
        if (!(0, server_api_1.hasValues)(u)) {
            return;
        }
        u.values.forEach((v) => {
            const t = v.path.split('.');
            if (t[0] === 'resources' && t[1] === 'regions') {
                processRegionUpdate(t[2], v.value);
            }
            if (t[0] === 'navigation' && t[1] === 'position') {
                processVesselPositionUpdate(v.value);
            }
        });
    });
};
const initAlarmEndpoints = async () => {
    server.debug(`** Registering Alarm Action API endpoint(s) **`);
    // list area alarms
    server.get(`${ALARM_API_PATH}/area`, async (req, res, next) => {
        server.debug(`** ${req.method} ${req.path}`);
        const ar = Array.from(alarmAreas);
        res.status(200).json(ar);
    });
    // new area alarm
    server.post(`${ALARM_API_PATH}/area`, async (req, res, next) => {
        try {
            validateAreaBody(req.body);
        }
        catch (err) {
            res.status(400).json({
                state: 'FAILED',
                statusCode: 400,
                message: err.message
            });
            return;
        }
        if (req.body.geometry === 'region') {
            res.status(400).json({
                state: 'FAILED',
                statusCode: 400,
                message: `Invalid geometry value 'region'. Use PUT request specifying a region identifier.`
            });
            return;
        }
        const id = uuid.v4();
        alarmAreas.set(id, req.body);
        res.status(200).json({
            state: 'COMPLETE',
            statusCode: 200,
            message: `Alarm Area created: ${id}`
        });
    });
    server.put(`${ALARM_API_PATH}/area/:id`, async (req, res, next) => {
        server.debug(`** ${req.method} ${req.path}`);
        try {
            validateAreaBody(req.body);
        }
        catch (err) {
            res.status(400).json({
                state: 'FAILED',
                statusCode: 400,
                message: err.message
            });
            return;
        }
        if (req.body.geometry === 'region') {
            // use region resource as alarm area
            try {
                const reg = await fetchRegion(req.params.id);
                const coords = parseRegionCoords(reg);
                if (Array.isArray(coords)) {
                    alarmAreas.set(req.params.id, {
                        geometry: req.body.geometry,
                        trigger: req.body.trigger,
                        coords: coords,
                        name: reg.name
                    });
                    res.status(200).json({
                        state: 'COMPLETE',
                        statusCode: 200,
                        message: `Alarm set for region: ${req.params.id}`
                    });
                }
                else {
                    res.status(400).json({
                        state: 'FAILED',
                        statusCode: 400,
                        message: `Region not found!`
                    });
                }
            }
            catch (e) {
                res.status(400).json({
                    state: 'FAILED',
                    statusCode: 400,
                    message: e.message
                });
            }
        }
        else {
            //updateArea(req.params.id)
            // use supplied coords as alarm area
            const msg = alarmAreas.has(req.params.id)
                ? `Alarm Area updated: ${req.params.id}`
                : `Alarm Area created: ${req.params.id}`;
            alarmAreas.set(req.params.id, req.body);
            res.status(200).json({
                state: 'COMPLETE',
                statusCode: 200,
                message: msg
            });
        }
    });
    server.delete(`${ALARM_API_PATH}/area/:id`, (req, res, next) => {
        server.debug(`** ${req.method} ${req.path}`);
        try {
            if (alarmAreas.has(req.params.id)) {
                deleteArea(req.params.id);
                res.status(200).json({
                    state: 'COMPLETE',
                    statusCode: 200,
                    message: `Alarm Area Cleared: ${req.params.id}`
                });
            }
            else {
                res.status(400).json({
                    state: 'FAILED',
                    statusCode: 400,
                    message: `Area not found!`
                });
            }
        }
        catch (e) {
            res.status(400).json({
                state: 'FAILED',
                statusCode: 400,
                message: e.message
            });
        }
    });
    server.post(`${ALARM_API_PATH}/area/:id/silence`, (req, res) => {
        server.debug(`** ${req.method} ${req.path}`);
        try {
            if (alarmAreas.has(req.params.id)) {
                alarmManager.silence(req.params.id);
                res.status(200).json({
                    state: 'COMPLETE',
                    statusCode: 200,
                    message: `Alarm silenced: ${req.params.id}`
                });
            }
            else {
                res.status(400).json({
                    state: 'FAILED',
                    statusCode: 400,
                    message: `Area not found!`
                });
            }
        }
        catch (e) {
            res.status(400).json({
                state: 'FAILED',
                statusCode: 400,
                message: e.message
            });
        }
    });
};
// emit notification delta message **
const emitNotification = (msg) => {
    const delta = {
        updates: [{ values: [msg] }]
    };
    server.handleMessage(pluginId, delta, server_api_1.SKVersion.v2);
};
// ********** Area Alarm methods ***************
/**
 * Remove Area from management
 * @param id Area identifier
 */
const deleteArea = (id) => {
    alarmAreas.delete(id);
    alarmManager.delete(id);
};
/**
 * Validate Area Alarm request parameters
 * @param body request body
 */
const validateAreaBody = (body) => {
    if (!body.trigger) {
        body.trigger = 'entry';
    }
    else if (!AREA_TRIGGERS.includes(body.trigger)) {
        throw new Error(`Area alarm trigger is invalid!`);
    }
    if (!body.geometry) {
        body.geometry = 'polygon';
    }
    else if (!AREA_GEOMETRIES.includes(body.geometry)) {
        throw new Error(`Area alarm geometry is invalid!`);
    }
    if (body.geometry === 'polygon') {
        if (!Array.isArray(body.coords)) {
            throw new Error(`Area coordinates not provided or are invalid!`);
        }
        if (body.coords.length === 0) {
            throw new Error(`Area coordinates not provided!`);
        }
        else if (!isValidPosition(body.coords[0])) {
            throw new Error(`Area coordinates are invalid!`);
        }
        delete body.center;
        delete body.radius;
    }
    if (body.geometry === 'circle') {
        if (!body.center || !isValidPosition(body.center)) {
            throw new Error(`Center coordinate not provided or is invalid!`);
        }
        if (typeof body.radius !== 'number') {
            throw new Error(`Radius not provided or invalid!`);
        }
        delete body.coords;
    }
    if (body.geometry === 'region') {
        delete body.coords;
        delete body.center;
        delete body.radius;
    }
};
/**
 * Determines if supplied position is valid
 * @param position
 * @returns true if valid
 */
const isValidPosition = (position) => {
    return position &&
        'latitude' in position &&
        'longitude' in position &&
        typeof position.latitude === 'number' &&
        position.latitude >= -90 &&
        position.latitude <= 90 &&
        typeof position.longitude === 'number' &&
        position.longitude >= -180 &&
        position.longitude <= 180
        ? true
        : false;
};
/**
 * Fetch region resource details
 * @param id Region identifier
 * @returns coordinates array
 */
const fetchRegion = async (id) => {
    const reg = await server.resourcesApi.getResource('regions', id);
    return reg;
};
/**
 * Fetch list of region resources and parse them to assign alarm area
 * @returns void
 */
const parseRegionList = async () => {
    const regList = await server.resourcesApi.listResources('regions', undefined);
    Object.entries(regList).forEach((r) => processRegionUpdate(r[0], r[1]));
};
/**
 * Extract and format region coordinates
 * @param region Region data
 * @returns coordinates array
 */
const parseRegionCoords = (region) => {
    let c;
    if (region.feature.geometry?.type === 'MultiPolygon') {
        c = region.feature.geometry?.coordinates[0][0];
    }
    else {
        c = region.feature.geometry?.coordinates[0];
    }
    return c.map((i) => {
        return { latitude: i[1], longitude: i[0] };
    });
};
/**
 * CrUD area alarm from Region delta
 * @param id Region identifier
 * @param region Region data
 */
const processRegionUpdate = (id, region) => {
    if (alarmAreas.has(id)) {
        if (!region) {
            deleteArea(id);
        }
        else if (region.feature.properties.skIcon !== 'hazard') {
            deleteArea(id);
        }
        else {
            const r = alarmAreas.get(id);
            r.coords = parseRegionCoords(region);
            r.name = region.name;
            alarmAreas.set(id, r);
        }
    }
    else {
        if (region.feature.properties.skIcon === 'hazard') {
            alarmAreas.set(id, {
                trigger: 'entry',
                geometry: 'region',
                coords: parseRegionCoords(region),
                name: region.name
            });
        }
    }
};
/**
 * Process received vessel.position update delta and
 * determine the current each managed area's trigger condition
 * @param position Vessel position
 */
const processVesselPositionUpdate = (position) => {
    if (!isValidPosition(position)) {
        return;
    }
    alarmAreas.forEach((v, k) => {
        let condition;
        if (v.geometry === 'circle') {
            if ((0, geolib_1.isPointWithinRadius)(position, v.center, v.radius)) {
                condition = 'inside';
                server.debug(`Vessel inside alarm radius ${k}`);
            }
            else {
                condition = 'outside';
                server.debug(`Vessel outside alarm radius ${k}`);
            }
        }
        else {
            if ((0, geolib_1.isPointInPolygon)(position, v.coords)) {
                condition = 'inside';
                server.debug(`Vessel inside alarm area ${k}`);
            }
            else {
                condition = 'outside';
                server.debug(`Vessel outside alarm area ${k}`);
            }
        }
        alarmManager.update(k, condition);
    });
};
