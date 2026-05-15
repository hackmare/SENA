"use strict";
/**
 * TypeBox Schema Definitions for Signal K Protocol Types
 *
 * Core protocol schemas: Delta, Update, Source, Notification, Meta, Zone.
 *
 * Metadata sourced from:
 *   specification/schemas/definitions.json
 *   specification/schemas/groups/notifications.json
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeltaSchema = exports.UpdateSchema = exports.PathValueSchema = exports.NotificationSchema = exports.SourceSchema = exports.MetaSchema = exports.MetaValueSchema = exports.EnhancedDisplayUnitsSchema = exports.DisplayUnitsMetadataSchema = exports.AlarmStatusSchema = exports.ZoneSchema = exports.AlarmMethodSchema = exports.AlarmStateSchema = exports.ALARM_METHOD = exports.ALARM_STATE = void 0;
const typebox_1 = require("@sinclair/typebox");
const shared_schemas_1 = require("./shared-schemas");
// Keep as TypeScript enums alongside TypeBox enum schemas — enums are values
// used at runtime (switch statements, comparisons), not just types.
/**
 * Alarm state enum.
 * @see specification/schemas/definitions.json#/definitions/alarmState
 * @category Server API
 */
var ALARM_STATE;
(function (ALARM_STATE) {
    ALARM_STATE["nominal"] = "nominal";
    ALARM_STATE["normal"] = "normal";
    ALARM_STATE["alert"] = "alert";
    ALARM_STATE["warn"] = "warn";
    ALARM_STATE["alarm"] = "alarm";
    ALARM_STATE["emergency"] = "emergency";
})(ALARM_STATE || (exports.ALARM_STATE = ALARM_STATE = {}));
/**
 * Alarm method enum.
 * @see specification/schemas/definitions.json#/definitions/alarmMethodEnum
 * @category Server API
 */
var ALARM_METHOD;
(function (ALARM_METHOD) {
    ALARM_METHOD["visual"] = "visual";
    ALARM_METHOD["sound"] = "sound";
})(ALARM_METHOD || (exports.ALARM_METHOD = ALARM_METHOD = {}));
/**
 * TypeBox schema for alarm state values.
 * Mirrors the ALARM_STATE enum for runtime validation and documentation.
 */
exports.AlarmStateSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('nominal'),
    typebox_1.Type.Literal('normal'),
    typebox_1.Type.Literal('alert'),
    typebox_1.Type.Literal('warn'),
    typebox_1.Type.Literal('alarm'),
    typebox_1.Type.Literal('emergency')
], {
    $id: 'AlarmState',
    description: 'The alarm state when the value is in this zone.',
    default: 'normal'
});
/**
 * TypeBox schema for alarm method values.
 * Mirrors the ALARM_METHOD enum for runtime validation and documentation.
 */
exports.AlarmMethodSchema = typebox_1.Type.Union([typebox_1.Type.Literal('visual'), typebox_1.Type.Literal('sound')], {
    $id: 'AlarmMethod',
    description: 'Method to use to raise notifications.'
});
/**
 * A zone defining display and alarm state for a value range.
 * @see specification/schemas/definitions.json zones definition
 */
exports.ZoneSchema = typebox_1.Type.Object({
    lower: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: 'The lowest number in this zone',
        examples: [3500]
    })),
    upper: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: 'The highest value in this zone',
        examples: [4000]
    })),
    state: exports.AlarmStateSchema,
    message: typebox_1.Type.String({
        description: 'The message to display for the alarm.',
        default: 'Warning'
    })
}, {
    $id: 'Zone',
    description: 'A zone used to define the display and alarm state when the value is in between lower and upper.'
});
/**
 * Alarm status flags (silenced, acknowledged, etc.).
 */
exports.AlarmStatusSchema = typebox_1.Type.Object({
    silenced: typebox_1.Type.Boolean({
        description: 'Whether the alarm has been silenced'
    }),
    acknowledged: typebox_1.Type.Boolean({
        description: 'Whether the alarm has been acknowledged'
    }),
    canSilence: typebox_1.Type.Boolean({
        description: 'Whether the alarm can be silenced'
    }),
    canAcknowledge: typebox_1.Type.Boolean({
        description: 'Whether the alarm can be acknowledged'
    }),
    canClear: typebox_1.Type.Boolean({
        description: 'Whether the alarm can be cleared'
    })
}, {
    $id: 'AlarmStatus',
    description: 'Status flags for an active alarm/notification'
});
/**
 * Stored display-units metadata — the minimal form persisted in path metadata.
 * The server resolves this into EnhancedDisplayUnits before sending to clients.
 */
exports.DisplayUnitsMetadataSchema = typebox_1.Type.Object({
    category: typebox_1.Type.String({
        description: 'Unit category (e.g. "speed", "temperature", "distance")'
    }),
    targetUnit: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Per-path target unit override (e.g. "kn", "°C")'
    })),
    displayFormat: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Display format string (e.g. "0.0", "0.00")'
    }))
}, {
    $id: 'DisplayUnitsMetadata',
    description: 'Stored display-units metadata for a Signal K path'
});
/**
 * Enhanced display-units metadata — the resolved form returned to clients,
 * containing the Math.js conversion formulas needed to convert from SI.
 */
exports.EnhancedDisplayUnitsSchema = typebox_1.Type.Object({
    category: typebox_1.Type.String({
        description: 'Unit category (e.g. "speed", "temperature")'
    }),
    targetUnit: typebox_1.Type.String({
        description: 'Target display unit (e.g. "kn", "°C")'
    }),
    formula: typebox_1.Type.String({
        description: 'Math.js formula to convert from SI to target unit (e.g. "value * 1.94384")'
    }),
    inverseFormula: typebox_1.Type.String({
        description: 'Math.js formula to convert from target unit back to SI (e.g. "value * 0.514444")'
    }),
    symbol: typebox_1.Type.String({
        description: 'Unit symbol for display (e.g. "kn", "°C")'
    }),
    displayFormat: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Display format string (e.g. "0.0")'
    }))
}, {
    $id: 'EnhancedDisplayUnits',
    description: 'Resolved display-units metadata with conversion formulas, as returned to clients'
});
/**
 * Metadata payload for a Signal K path.
 * Contains display hints, units, timeout, and alarm zones.
 */
exports.MetaValueSchema = typebox_1.Type.Object({
    description: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Description of the Signal K path' })),
    units: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Allowed units of physical quantities. Units should be (derived) SI units where possible.'
    })),
    example: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'An example value for this path' })),
    timeout: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: 'The timeout in seconds after which the value should be considered stale',
        minimum: 0
    })),
    displayName: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'A human-readable display name for this path'
    })),
    displayScale: typebox_1.Type.Optional(typebox_1.Type.Object({
        lower: typebox_1.Type.Number({ description: 'Lower bound of display scale' }),
        upper: typebox_1.Type.Number({ description: 'Upper bound of display scale' })
    })),
    zones: typebox_1.Type.Optional(typebox_1.Type.Array(exports.ZoneSchema, {
        description: 'The zones defining the range of values for this Signal K value.'
    })),
    supportsPut: typebox_1.Type.Optional(typebox_1.Type.Boolean({
        description: 'Whether this path supports PUT operations'
    })),
    displayUnits: typebox_1.Type.Optional(typebox_1.Type.Union([exports.DisplayUnitsMetadataSchema, exports.EnhancedDisplayUnitsSchema], {
        description: 'Display unit preferences — either stored metadata or resolved with conversion formulas'
    }))
}, {
    $id: 'MetaValue',
    description: 'Metadata about a Signal K path'
});
/**
 * Meta message — a path paired with its metadata.
 */
exports.MetaSchema = typebox_1.Type.Object({
    path: typebox_1.Type.String({ description: 'Signal K path' }),
    value: exports.MetaValueSchema
}, {
    $id: 'Meta',
    description: 'A path with its metadata value'
});
/**
 * Source of data in delta format — a record of where the data was received from.
 *
 * Properties cover NMEA 0183 (talker, sentence), NMEA 2000 (src, pgn, canName,
 * instance), and AIS (aisType 1-27) sources.
 *
 * @see specification/schemas/definitions.json#/definitions/source
 */
exports.SourceSchema = typebox_1.Type.Object({
    label: typebox_1.Type.String({
        description: 'A label to identify the source bus, e.g. serial-COM1, eth-local, etc.',
        examples: ['N2K-1']
    }),
    type: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'A human name to identify the type. NMEA0183, NMEA2000, signalk',
        default: 'NMEA2000',
        examples: ['NMEA2000']
    })),
    // NMEA 2000 fields
    src: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'NMEA2000 src value or any similar value for encapsulating the original source of the data',
        examples: ['36']
    })),
    canName: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'NMEA2000 CAN name of the source device',
        examples: ['13877444229283709432']
    })),
    pgn: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: 'NMEA2000 PGN of the source message',
        examples: [130312]
    })),
    instance: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'NMEA2000 instance value of the source message'
    })),
    // NMEA 0183 fields
    sentence: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Sentence type of the source NMEA0183 sentence, e.g. RMC from $GPRMC,...',
        examples: ['RMC']
    })),
    talker: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'Talker id of the source NMEA0183 sentence, e.g. GP from $GPRMC,...',
        examples: ['GP']
    })),
    // AIS fields
    aisType: typebox_1.Type.Optional(typebox_1.Type.Integer({
        minimum: 1,
        maximum: 27,
        description: 'AIS Message Type',
        examples: [15]
    }))
}, {
    $id: 'Source',
    description: 'Source of data in delta format, a record of where the data was received from.'
});
/**
 * Notification payload — state, method, message, and optional position/status.
 */
exports.NotificationSchema = typebox_1.Type.Object({
    state: exports.AlarmStateSchema,
    method: typebox_1.Type.Array(exports.AlarmMethodSchema, {
        description: 'Methods to use to raise this notification'
    }),
    message: typebox_1.Type.String({
        description: 'Message to display or speak'
    }),
    status: typebox_1.Type.Optional(exports.AlarmStatusSchema),
    position: typebox_1.Type.Optional(typebox_1.Type.Ref(shared_schemas_1.PositionSchema, {
        description: 'Geographic position associated with the notification, when relevant (e.g. MOB, anchor alarm, waypoint arrival)'
    })),
    createdAt: typebox_1.Type.Optional(typebox_1.Type.String({
        pattern: shared_schemas_1.IsoTimePattern,
        description: 'ISO 8601 timestamp when the notification was created'
    })),
    id: typebox_1.Type.Optional(typebox_1.Type.String({
        pattern: shared_schemas_1.SignalKUuidPattern,
        description: 'Unique notification identifier (UUID)',
        examples: ['ac3a3b2d-07e8-4f25-92bc-98e7c92f7f1a']
    }))
}, {
    $id: 'Notification',
    description: 'A Signal K notification with alarm state and message'
});
/**
 * A path-value pair in an update delta.
 */
exports.PathValueSchema = typebox_1.Type.Object({
    path: typebox_1.Type.String({ description: 'Signal K path' }),
    value: typebox_1.Type.Unknown({ description: 'The value for this path' })
}, {
    $id: 'PathValue',
    description: 'A Signal K path and its value'
});
/**
 * An update within a delta message.
 * Must contain values[] or meta[] (or both), plus optional timestamp and source.
 *
 * Uses a Union to match the Signal K specification's oneOf constraint:
 * an update with neither values nor meta is invalid.
 * @see specification delta.json oneOf constraint
 */
const UpdateBase = typebox_1.Type.Object({
    timestamp: typebox_1.Type.Optional(typebox_1.Type.String({
        pattern: shared_schemas_1.IsoTimePattern,
        description: 'RFC 3339 (UTC only without local offset) string representing date and time.'
    })),
    source: typebox_1.Type.Optional(exports.SourceSchema),
    $source: typebox_1.Type.Optional(typebox_1.Type.String({
        pattern: '^[A-Za-z0-9-_.]*$',
        description: 'Reference to the source under /sources. A dot separated path to the data, e.g. [type].[bus].[device]',
        examples: ['NMEA0183.COM1.GP']
    })),
    notificationId: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Notification identifier' }))
});
const ValuesFields = typebox_1.Type.Object({
    values: typebox_1.Type.Array(exports.PathValueSchema, {
        description: 'Array of path-value pairs'
    }),
    meta: typebox_1.Type.Optional(typebox_1.Type.Array(exports.MetaSchema, {
        description: 'Array of path-metadata pairs'
    }))
});
const MetaFields = typebox_1.Type.Object({
    meta: typebox_1.Type.Array(exports.MetaSchema, {
        description: 'Array of path-metadata pairs'
    }),
    values: typebox_1.Type.Optional(typebox_1.Type.Array(exports.PathValueSchema, {
        description: 'Array of path-value pairs'
    }))
});
exports.UpdateSchema = typebox_1.Type.Union([
    typebox_1.Type.Intersect([UpdateBase, ValuesFields]),
    typebox_1.Type.Intersect([UpdateBase, MetaFields])
], {
    $id: 'Update',
    description: 'A Signal K update containing path-value and/or path-meta pairs with timestamp and source'
});
/**
 * A Signal K delta message — the fundamental unit of data exchange.
 * Contains a context (vessel/aircraft/etc.) and one or more updates.
 */
exports.DeltaSchema = typebox_1.Type.Object({
    context: typebox_1.Type.Optional(typebox_1.Type.String({
        description: 'The context path, usually a vessel URN (e.g. vessels.urn:mrn:signalk:uuid:...)',
        examples: [
            'vessels.urn:mrn:signalk:uuid:b7590868-1d62-47d9-989c-32321b349fb9'
        ]
    })),
    updates: typebox_1.Type.Array(exports.UpdateSchema, {
        description: 'One or more updates in this delta'
    })
}, {
    $id: 'Delta',
    description: 'A Signal K delta message — the fundamental unit of data exchange'
});
