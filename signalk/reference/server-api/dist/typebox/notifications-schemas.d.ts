/**
 * TypeBox Schema Definitions for the Signal K Notifications API
 */
import { type Static } from '@sinclair/typebox';
import { AlarmStateSchema, AlarmMethodSchema, AlarmStatusSchema, NotificationSchema } from './protocol-schemas';
export { AlarmStateSchema, AlarmMethodSchema, AlarmStatusSchema, NotificationSchema };
/**
 * Alarm method array — wraps the AlarmMethod enum for OpenAPI.
 */
export declare const AlarmMethodArraySchema: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"visual">, import("@sinclair/typebox").TLiteral<"sound">]>>;
/**
 * Alarm object — state, method, message, and optional status.
 * Used as the `value` field in a notification response.
 */
export declare const AlarmSchema: import("@sinclair/typebox").TObject<{
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
}>;
export type Alarm = Static<typeof AlarmSchema>;
/**
 * Notification response wrapper — value containing an alarm.
 */
export declare const NotificationResponseSchema: import("@sinclair/typebox").TObject<{
    value: import("@sinclair/typebox").TObject<{
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
    }>;
}>;
export type NotificationResponse = Static<typeof NotificationResponseSchema>;
/**
 * Notification ID parameter — UUID v4 format.
 */
export declare const NotificationIdParamSchema: import("@sinclair/typebox").TString;
//# sourceMappingURL=notifications-schemas.d.ts.map