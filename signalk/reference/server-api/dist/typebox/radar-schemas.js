"use strict";
/**
 * TypeBox Schema Definitions for the Signal K Radar API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarInfoSchema = exports.RadarControlsSchema = exports.RadarControlValueSchema = exports.RadarStatusSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.RadarStatusSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('off'),
    typebox_1.Type.Literal('standby'),
    typebox_1.Type.Literal('transmit'),
    typebox_1.Type.Literal('warming')
], {
    $id: 'RadarStatus',
    description: 'Current operational status of the radar'
});
exports.RadarControlValueSchema = typebox_1.Type.Object({
    auto: typebox_1.Type.Boolean({
        description: 'Whether automatic adjustment is enabled'
    }),
    value: typebox_1.Type.Number({
        description: 'Current control value. The valid range depends on the radar hardware — see the capability manifest at GET /radars/{id}/capabilities for min/max/step per control.'
    })
}, {
    $id: 'RadarControlValue',
    description: 'A radar control with auto mode and a numeric value'
});
exports.RadarControlsSchema = typebox_1.Type.Object({
    gain: typebox_1.Type.Ref(exports.RadarControlValueSchema, {
        description: 'Receiver gain control'
    }),
    sea: typebox_1.Type.Optional(typebox_1.Type.Ref(exports.RadarControlValueSchema, {
        description: 'Sea clutter rejection control. Present when supported by the radar.'
    })),
    rain: typebox_1.Type.Optional(typebox_1.Type.Object({
        value: typebox_1.Type.Number({
            description: 'Rain clutter rejection level. Valid range is hardware-dependent — see capability manifest.'
        })
    }, {
        description: 'Rain clutter rejection control (no auto mode). Present when supported by the radar.'
    }))
}, {
    $id: 'RadarControlsModel',
    description: 'Current control settings for a radar. Additional radar-specific controls beyond gain/sea/rain may be present.'
});
exports.RadarInfoSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String({ description: 'Unique radar identifier' }),
    name: typebox_1.Type.String({ description: 'Display name' }),
    brand: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Manufacturer/brand' })),
    status: exports.RadarStatusSchema,
    spokesPerRevolution: typebox_1.Type.Integer({
        description: 'Number of spokes per full rotation (e.g. 512, 1024, 2048)',
        examples: [2048]
    }),
    maxSpokeLen: typebox_1.Type.Integer({
        description: 'Maximum spoke length in samples (e.g. 512, 1024)',
        examples: [1024]
    }),
    range: typebox_1.Type.Number({
        description: 'Current range in meters',
        units: 'm'
    }),
    controls: exports.RadarControlsSchema,
    streamUrl: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'WebSocket URL for spoke stream. If absent, use /radars/{id}/stream'
    }))
}, {
    $id: 'RadarInfoModel',
    description: 'Information about a radar device'
});
