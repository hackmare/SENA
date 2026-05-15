/**
 * TypeBox Schema Definitions for the Signal K Autopilot API
 */
import { type Static } from '@sinclair/typebox';
/** Autopilot state definition (name + engaged flag) */
export declare const AutopilotStateDefSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    engaged: import("@sinclair/typebox").TBoolean;
}>;
/** Autopilot action definition */
export declare const AutopilotActionDefSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"dodge">, import("@sinclair/typebox").TLiteral<"tack">, import("@sinclair/typebox").TLiteral<"gybe">, import("@sinclair/typebox").TLiteral<"courseCurrentPoint">, import("@sinclair/typebox").TLiteral<"courseNextPoint">]>;
    name: import("@sinclair/typebox").TString;
    available: import("@sinclair/typebox").TBoolean;
}>;
/** Autopilot options — available states, modes, and actions */
export declare const AutopilotOptionsSchema: import("@sinclair/typebox").TObject<{
    states: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        engaged: import("@sinclair/typebox").TBoolean;
    }>>;
    modes: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    actions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"dodge">, import("@sinclair/typebox").TLiteral<"tack">, import("@sinclair/typebox").TLiteral<"gybe">, import("@sinclair/typebox").TLiteral<"courseCurrentPoint">, import("@sinclair/typebox").TLiteral<"courseNextPoint">]>;
        name: import("@sinclair/typebox").TString;
        available: import("@sinclair/typebox").TBoolean;
    }>>;
}>;
/** Autopilot info — full state of an autopilot device */
export declare const AutopilotInfoSchema: import("@sinclair/typebox").TObject<{
    options: import("@sinclair/typebox").TObject<{
        states: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            engaged: import("@sinclair/typebox").TBoolean;
        }>>;
        modes: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        actions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"dodge">, import("@sinclair/typebox").TLiteral<"tack">, import("@sinclair/typebox").TLiteral<"gybe">, import("@sinclair/typebox").TLiteral<"courseCurrentPoint">, import("@sinclair/typebox").TLiteral<"courseNextPoint">]>;
            name: import("@sinclair/typebox").TString;
            available: import("@sinclair/typebox").TBoolean;
        }>>;
    }>;
    target: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNull]>;
    mode: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    engaged: import("@sinclair/typebox").TBoolean;
}>;
export type AutopilotInfoType = Static<typeof AutopilotInfoSchema>;
/** Angle input — value with optional units (deg or rad) */
export declare const AngleInputSchema: import("@sinclair/typebox").TObject<{
    value: import("@sinclair/typebox").TNumber;
    units: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"deg">, import("@sinclair/typebox").TLiteral<"rad">]>>;
}>;
export type AngleInput = Static<typeof AngleInputSchema>;
/** String value input (for state, mode) */
export declare const StringValueInputSchema: import("@sinclair/typebox").TObject<{
    value: import("@sinclair/typebox").TString;
}>;
//# sourceMappingURL=autopilot-schemas.d.ts.map