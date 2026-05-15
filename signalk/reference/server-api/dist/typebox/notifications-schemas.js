"use strict";
/**
 * TypeBox Schema Definitions for the Signal K Notifications API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationIdParamSchema = exports.NotificationResponseSchema = exports.AlarmSchema = exports.AlarmMethodArraySchema = exports.NotificationSchema = exports.AlarmStatusSchema = exports.AlarmMethodSchema = exports.AlarmStateSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const protocol_schemas_1 = require("./protocol-schemas");
Object.defineProperty(exports, "AlarmStateSchema", { enumerable: true, get: function () { return protocol_schemas_1.AlarmStateSchema; } });
Object.defineProperty(exports, "AlarmMethodSchema", { enumerable: true, get: function () { return protocol_schemas_1.AlarmMethodSchema; } });
Object.defineProperty(exports, "AlarmStatusSchema", { enumerable: true, get: function () { return protocol_schemas_1.AlarmStatusSchema; } });
Object.defineProperty(exports, "NotificationSchema", { enumerable: true, get: function () { return protocol_schemas_1.NotificationSchema; } });
const shared_schemas_1 = require("./shared-schemas");
/**
 * Alarm method array — wraps the AlarmMethod enum for OpenAPI.
 */
exports.AlarmMethodArraySchema = typebox_1.Type.Array(protocol_schemas_1.AlarmMethodSchema, {
    $id: 'AlarmMethodArray',
    description: 'Methods to use to raise the alarm.',
    uniqueItems: true,
    examples: [['sound']]
});
/**
 * Alarm object — state, method, message, and optional status.
 * Used as the `value` field in a notification response.
 */
exports.AlarmSchema = typebox_1.Type.Object({
    state: protocol_schemas_1.AlarmStateSchema,
    method: exports.AlarmMethodArraySchema,
    message: typebox_1.Type.String({ description: 'Message to display or speak' }),
    status: typebox_1.Type.Optional(protocol_schemas_1.AlarmStatusSchema)
}, {
    $id: 'Alarm',
    description: 'Alarm notification value'
});
/**
 * Notification response wrapper — value containing an alarm.
 */
exports.NotificationResponseSchema = typebox_1.Type.Object({
    value: exports.AlarmSchema
}, {
    $id: 'NotificationResponse',
    description: 'Notification with alarm value'
});
/**
 * Notification ID parameter — UUID v4 format.
 */
exports.NotificationIdParamSchema = typebox_1.Type.String({
    $id: 'NotificationIdParam',
    pattern: `${shared_schemas_1.SignalKUuidPattern}$`,
    description: 'Notification identifier',
    examples: ['ac3a3b2d-07e8-4f25-92bc-98e7c92f7f1a']
});
