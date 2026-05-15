/**
 * TypeBox Schema Definitions for Signal K Protocol Types
 *
 * Core protocol schemas: Delta, Update, Source, Notification, Meta, Zone.
 *
 * Metadata sourced from:
 *   specification/schemas/definitions.json
 *   specification/schemas/groups/notifications.json
 */
import { type Static } from '@sinclair/typebox';
/**
 * Alarm state enum.
 * @see specification/schemas/definitions.json#/definitions/alarmState
 * @category Server API
 */
export declare enum ALARM_STATE {
    nominal = "nominal",
    normal = "normal",
    alert = "alert",
    warn = "warn",
    alarm = "alarm",
    emergency = "emergency"
}
/**
 * Alarm method enum.
 * @see specification/schemas/definitions.json#/definitions/alarmMethodEnum
 * @category Server API
 */
export declare enum ALARM_METHOD {
    visual = "visual",
    sound = "sound"
}
/**
 * TypeBox schema for alarm state values.
 * Mirrors the ALARM_STATE enum for runtime validation and documentation.
 */
export declare const AlarmStateSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
/**
 * TypeBox schema for alarm method values.
 * Mirrors the ALARM_METHOD enum for runtime validation and documentation.
 */
export declare const AlarmMethodSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"visual">, import("@sinclair/typebox").TLiteral<"sound">]>;
/**
 * A zone defining display and alarm state for a value range.
 * @see specification/schemas/definitions.json zones definition
 */
export declare const ZoneSchema: import("@sinclair/typebox").TObject<{
    lower: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    upper: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
    message: import("@sinclair/typebox").TString;
}>;
export type Zone = Static<typeof ZoneSchema>;
/**
 * Alarm status flags (silenced, acknowledged, etc.).
 */
export declare const AlarmStatusSchema: import("@sinclair/typebox").TObject<{
    silenced: import("@sinclair/typebox").TBoolean;
    acknowledged: import("@sinclair/typebox").TBoolean;
    canSilence: import("@sinclair/typebox").TBoolean;
    canAcknowledge: import("@sinclair/typebox").TBoolean;
    canClear: import("@sinclair/typebox").TBoolean;
}>;
export type AlarmStatus = Static<typeof AlarmStatusSchema>;
/**
 * Stored display-units metadata — the minimal form persisted in path metadata.
 * The server resolves this into EnhancedDisplayUnits before sending to clients.
 */
export declare const DisplayUnitsMetadataSchema: import("@sinclair/typebox").TObject<{
    category: import("@sinclair/typebox").TString;
    targetUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type DisplayUnitsMetadata = Static<typeof DisplayUnitsMetadataSchema>;
/**
 * Enhanced display-units metadata — the resolved form returned to clients,
 * containing the Math.js conversion formulas needed to convert from SI.
 */
export declare const EnhancedDisplayUnitsSchema: import("@sinclair/typebox").TObject<{
    category: import("@sinclair/typebox").TString;
    targetUnit: import("@sinclair/typebox").TString;
    formula: import("@sinclair/typebox").TString;
    inverseFormula: import("@sinclair/typebox").TString;
    symbol: import("@sinclair/typebox").TString;
    displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type EnhancedDisplayUnits = Static<typeof EnhancedDisplayUnitsSchema>;
/**
 * Metadata payload for a Signal K path.
 * Contains display hints, units, timeout, and alarm zones.
 */
export declare const MetaValueSchema: import("@sinclair/typebox").TObject<{
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    units: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    example: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    timeout: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    displayName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    displayScale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        lower: import("@sinclair/typebox").TNumber;
        upper: import("@sinclair/typebox").TNumber;
    }>>;
    zones: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        lower: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        upper: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
        message: import("@sinclair/typebox").TString;
    }>>>;
    supportsPut: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    displayUnits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        category: import("@sinclair/typebox").TString;
        targetUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>, import("@sinclair/typebox").TObject<{
        category: import("@sinclair/typebox").TString;
        targetUnit: import("@sinclair/typebox").TString;
        formula: import("@sinclair/typebox").TString;
        inverseFormula: import("@sinclair/typebox").TString;
        symbol: import("@sinclair/typebox").TString;
        displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>]>>;
}>;
export type MetaValue = Static<typeof MetaValueSchema>;
/**
 * Meta message — a path paired with its metadata.
 */
export declare const MetaSchema: import("@sinclair/typebox").TObject<{
    path: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TObject<{
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        units: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        example: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        timeout: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        displayName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        displayScale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            lower: import("@sinclair/typebox").TNumber;
            upper: import("@sinclair/typebox").TNumber;
        }>>;
        zones: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            lower: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            upper: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
            message: import("@sinclair/typebox").TString;
        }>>>;
        supportsPut: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        displayUnits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TString;
            targetUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>, import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TString;
            targetUnit: import("@sinclair/typebox").TString;
            formula: import("@sinclair/typebox").TString;
            inverseFormula: import("@sinclair/typebox").TString;
            symbol: import("@sinclair/typebox").TString;
            displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>]>>;
    }>;
}>;
export type Meta = Static<typeof MetaSchema>;
/**
 * Source of data in delta format — a record of where the data was received from.
 *
 * Properties cover NMEA 0183 (talker, sentence), NMEA 2000 (src, pgn, canName,
 * instance), and AIS (aisType 1-27) sources.
 *
 * @see specification/schemas/definitions.json#/definitions/source
 */
export declare const SourceSchema: import("@sinclair/typebox").TObject<{
    label: import("@sinclair/typebox").TString;
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    src: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    canName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    pgn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    instance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    sentence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    talker: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    aisType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
}>;
export type Source = Static<typeof SourceSchema>;
/**
 * Notification payload — state, method, message, and optional position/status.
 */
export declare const NotificationSchema: import("@sinclair/typebox").TObject<{
    state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
    method: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"visual">, import("@sinclair/typebox").TLiteral<"sound">]>>;
    message: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        silenced: import("@sinclair/typebox").TBoolean;
        acknowledged: import("@sinclair/typebox").TBoolean;
        canSilence: import("@sinclair/typebox").TBoolean;
        canAcknowledge: import("@sinclair/typebox").TBoolean;
        canClear: import("@sinclair/typebox").TBoolean;
    }>>;
    position: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRefUnsafe<import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>>>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type Notification = Static<typeof NotificationSchema>;
/**
 * A path-value pair in an update delta.
 */
export declare const PathValueSchema: import("@sinclair/typebox").TObject<{
    path: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TUnknown;
}>;
export type PathValue = Static<typeof PathValueSchema>;
export declare const UpdateSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    timestamp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        label: import("@sinclair/typebox").TString;
        type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        src: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        canName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        pgn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        instance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sentence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        talker: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        aisType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>>;
    $source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    notificationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>, import("@sinclair/typebox").TObject<{
    values: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        path: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TUnknown;
    }>>;
    meta: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        path: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TObject<{
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            units: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            example: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            timeout: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            displayName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            displayScale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                lower: import("@sinclair/typebox").TNumber;
                upper: import("@sinclair/typebox").TNumber;
            }>>;
            zones: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                lower: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                upper: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
                message: import("@sinclair/typebox").TString;
            }>>>;
            supportsPut: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            displayUnits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
                category: import("@sinclair/typebox").TString;
                targetUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>, import("@sinclair/typebox").TObject<{
                category: import("@sinclair/typebox").TString;
                targetUnit: import("@sinclair/typebox").TString;
                formula: import("@sinclair/typebox").TString;
                inverseFormula: import("@sinclair/typebox").TString;
                symbol: import("@sinclair/typebox").TString;
                displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>]>>;
        }>;
    }>>>;
}>]>, import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    timestamp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        label: import("@sinclair/typebox").TString;
        type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        src: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        canName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        pgn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        instance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sentence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        talker: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        aisType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    }>>;
    $source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    notificationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>, import("@sinclair/typebox").TObject<{
    meta: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        path: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TObject<{
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            units: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            example: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            timeout: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            displayName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            displayScale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                lower: import("@sinclair/typebox").TNumber;
                upper: import("@sinclair/typebox").TNumber;
            }>>;
            zones: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                lower: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                upper: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
                message: import("@sinclair/typebox").TString;
            }>>>;
            supportsPut: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            displayUnits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
                category: import("@sinclair/typebox").TString;
                targetUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>, import("@sinclair/typebox").TObject<{
                category: import("@sinclair/typebox").TString;
                targetUnit: import("@sinclair/typebox").TString;
                formula: import("@sinclair/typebox").TString;
                inverseFormula: import("@sinclair/typebox").TString;
                symbol: import("@sinclair/typebox").TString;
                displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>]>>;
        }>;
    }>>;
    values: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        path: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TUnknown;
    }>>>;
}>]>]>;
/**
 * A Signal K delta message — the fundamental unit of data exchange.
 * Contains a context (vessel/aircraft/etc.) and one or more updates.
 */
export declare const DeltaSchema: import("@sinclair/typebox").TObject<{
    context: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    updates: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        timestamp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            label: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            src: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            canName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            pgn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            instance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            sentence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            talker: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            aisType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>>;
        $source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        notificationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>, import("@sinclair/typebox").TObject<{
        values: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            path: import("@sinclair/typebox").TString;
            value: import("@sinclair/typebox").TUnknown;
        }>>;
        meta: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            path: import("@sinclair/typebox").TString;
            value: import("@sinclair/typebox").TObject<{
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                units: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                example: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                timeout: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                displayName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                displayScale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                    lower: import("@sinclair/typebox").TNumber;
                    upper: import("@sinclair/typebox").TNumber;
                }>>;
                zones: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    lower: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                    upper: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                    state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
                    message: import("@sinclair/typebox").TString;
                }>>>;
                supportsPut: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                displayUnits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
                    category: import("@sinclair/typebox").TString;
                    targetUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                    displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                }>, import("@sinclair/typebox").TObject<{
                    category: import("@sinclair/typebox").TString;
                    targetUnit: import("@sinclair/typebox").TString;
                    formula: import("@sinclair/typebox").TString;
                    inverseFormula: import("@sinclair/typebox").TString;
                    symbol: import("@sinclair/typebox").TString;
                    displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                }>]>>;
            }>;
        }>>>;
    }>]>, import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
        timestamp: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            label: import("@sinclair/typebox").TString;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            src: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            canName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            pgn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            instance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            sentence: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            talker: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            aisType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        }>>;
        $source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        notificationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>, import("@sinclair/typebox").TObject<{
        meta: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            path: import("@sinclair/typebox").TString;
            value: import("@sinclair/typebox").TObject<{
                description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                units: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                example: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                timeout: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                displayName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                displayScale: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                    lower: import("@sinclair/typebox").TNumber;
                    upper: import("@sinclair/typebox").TNumber;
                }>>;
                zones: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    lower: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                    upper: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
                    state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"nominal">, import("@sinclair/typebox").TLiteral<"normal">, import("@sinclair/typebox").TLiteral<"alert">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"alarm">, import("@sinclair/typebox").TLiteral<"emergency">]>;
                    message: import("@sinclair/typebox").TString;
                }>>>;
                supportsPut: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                displayUnits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
                    category: import("@sinclair/typebox").TString;
                    targetUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                    displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                }>, import("@sinclair/typebox").TObject<{
                    category: import("@sinclair/typebox").TString;
                    targetUnit: import("@sinclair/typebox").TString;
                    formula: import("@sinclair/typebox").TString;
                    inverseFormula: import("@sinclair/typebox").TString;
                    symbol: import("@sinclair/typebox").TString;
                    displayFormat: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                }>]>>;
            }>;
        }>>;
        values: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            path: import("@sinclair/typebox").TString;
            value: import("@sinclair/typebox").TUnknown;
        }>>>;
    }>]>]>>;
}>;
//# sourceMappingURL=protocol-schemas.d.ts.map