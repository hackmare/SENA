"use strict";
/**
 * TypeBox Schema Definitions for the Signal K Autopilot API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValueInputSchema = exports.AngleInputSchema = exports.AutopilotInfoSchema = exports.AutopilotOptionsSchema = exports.AutopilotActionDefSchema = exports.AutopilotStateDefSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
/** Autopilot state definition (name + engaged flag) */
exports.AutopilotStateDefSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String({
        description: 'Autopilot state name',
        examples: ['auto']
    }),
    engaged: typebox_1.Type.Boolean({
        description: 'true if state indicates actively steering',
        examples: [true]
    })
}, { $id: 'AutopilotStateDef' });
/** Autopilot action definition */
exports.AutopilotActionDefSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Union([
        typebox_1.Type.Literal('dodge'),
        typebox_1.Type.Literal('tack'),
        typebox_1.Type.Literal('gybe'),
        typebox_1.Type.Literal('courseCurrentPoint'),
        typebox_1.Type.Literal('courseNextPoint')
    ], { description: 'Action identifier' }),
    name: typebox_1.Type.String({ description: 'Display name', examples: ['Tack'] }),
    available: typebox_1.Type.Boolean({
        description: 'true if can be used in current AP mode of operation'
    })
}, { $id: 'AutopilotActionDef' });
/** Autopilot options — available states, modes, and actions */
exports.AutopilotOptionsSchema = typebox_1.Type.Object({
    states: typebox_1.Type.Array(exports.AutopilotStateDefSchema, {
        description: 'Available autopilot states'
    }),
    modes: typebox_1.Type.Array(typebox_1.Type.String(), {
        description: 'Supported modes of operation',
        examples: [['compass', 'gps', 'wind']]
    }),
    actions: typebox_1.Type.Array(exports.AutopilotActionDefSchema, {
        description: 'Actions the autopilot supports'
    })
}, {
    $id: 'AutopilotOptions',
    description: 'Available autopilot states, modes, and actions'
});
/** Autopilot info — full state of an autopilot device */
exports.AutopilotInfoSchema = typebox_1.Type.Object({
    options: exports.AutopilotOptionsSchema,
    target: typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.Null()], {
        description: 'Current target value in radians. Interpretation depends on the current mode (heading for compass, wind angle for wind mode).',
        units: 'rad'
    }),
    mode: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()], {
        description: 'Current autopilot mode'
    }),
    state: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()], {
        description: 'Current autopilot state'
    }),
    engaged: typebox_1.Type.Boolean({
        description: 'true if autopilot is actively steering'
    })
}, {
    $id: 'AutopilotInfo',
    description: 'Full state of an autopilot device'
});
/** Angle input — value with optional units (deg or rad) */
exports.AngleInputSchema = typebox_1.Type.Object({
    value: typebox_1.Type.Number({
        description: 'Angle value',
        examples: [129]
    }),
    units: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('deg'), typebox_1.Type.Literal('rad')], {
        description: 'Units for the angle value. Default is radians.',
        default: 'rad'
    }))
}, {
    $id: 'AngleInput',
    description: 'Angle input with optional units (deg or rad)'
});
/** String value input (for state, mode) */
exports.StringValueInputSchema = typebox_1.Type.Object({
    value: typebox_1.Type.String({ description: 'String value to set' })
}, { $id: 'StringValueInput' });
