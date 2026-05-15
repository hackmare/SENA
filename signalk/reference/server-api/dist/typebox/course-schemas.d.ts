/**
 * TypeBox Schema Definitions for the Signal K Course API
 */
import { type Static } from '@sinclair/typebox';
import { PositionSchema, IsoTimeSchema, OkResponseSchema, ErrorResponseSchema } from './shared-schemas';
export { IsoTimeSchema, PositionSchema, OkResponseSchema, ErrorResponseSchema };
export type { IsoTimeType } from './shared-schemas';
/** Signal K route resource href (UUID v4 format). */
export declare const SignalKHrefRouteSchema: import("@sinclair/typebox").TString;
/** Signal K waypoint resource href (UUID v4 format). */
export declare const SignalKHrefWaypointSchema: import("@sinclair/typebox").TString;
/** Arrival circle radius in meters (non-negative). */
export declare const ArrivalCircleSchema: import("@sinclair/typebox").TNumber;
export type ArrivalCircleType = Static<typeof ArrivalCircleSchema>;
export type PositionType = Static<typeof PositionSchema>;
/** Type of course point. */
export declare const CoursePointTypeSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VesselPosition">, import("@sinclair/typebox").TLiteral<"RoutePoint">, import("@sinclair/typebox").TLiteral<"Location">]>;
/** Destination by waypoint href. */
export declare const HrefDestinationSchema: import("@sinclair/typebox").TObject<{
    href: import("@sinclair/typebox").TString;
}>;
export type HrefDestinationType = Static<typeof HrefDestinationSchema>;
/** Destination by position coordinates. */
export declare const PositionDestinationSchema: import("@sinclair/typebox").TObject<{
    position: import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
}>;
export type PositionDestinationType = Static<typeof PositionDestinationSchema>;
/**
 * PUT /course/destination request body.
 * Either a waypoint href or a position, optionally with an arrival circle.
 */
export declare const SetDestinationBodySchema: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    href: import("@sinclair/typebox").TString;
}>, import("@sinclair/typebox").TObject<{
    position: import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
}>]>, import("@sinclair/typebox").TObject<{
    arrivalCircle: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>]>;
export type SetDestinationBodyType = Static<typeof SetDestinationBodySchema>;
/** PUT /course/activeRoute request body. */
export declare const RouteDestinationSchema: import("@sinclair/typebox").TObject<{
    href: import("@sinclair/typebox").TString;
    pointIndex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    reverse: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    arrivalCircle: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
export type RouteDestinationType = Static<typeof RouteDestinationSchema>;
/** PUT /course/arrivalCircle request body */
export declare const ArrivalCircleBodySchema: import("@sinclair/typebox").TObject<{
    value: import("@sinclair/typebox").TNumber;
}>;
export type ArrivalCircleBodyType = Static<typeof ArrivalCircleBodySchema>;
/** PUT /course/targetArrivalTime request body */
export declare const TargetArrivalTimeBodySchema: import("@sinclair/typebox").TObject<{
    value: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
}>;
export type TargetArrivalTimeBodyType = Static<typeof TargetArrivalTimeBodySchema>;
/** PUT /course/activeRoute/nextPoint request body */
export declare const NextPointBodySchema: import("@sinclair/typebox").TObject<{
    value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
export type NextPointBodyType = Static<typeof NextPointBodySchema>;
/** PUT /course/activeRoute/pointIndex request body */
export declare const PointIndexBodySchema: import("@sinclair/typebox").TObject<{
    value: import("@sinclair/typebox").TNumber;
}>;
export type PointIndexBodyType = Static<typeof PointIndexBodySchema>;
/** PUT /course/activeRoute/reverse request body */
export declare const ReverseBodySchema: import("@sinclair/typebox").TObject<{
    pointIndex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
export type ReverseBodyType = Static<typeof ReverseBodySchema>;
/** Active route state. */
export declare const ActiveRouteSchema: import("@sinclair/typebox").TObject<{
    href: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    pointIndex: import("@sinclair/typebox").TNumber;
    pointTotal: import("@sinclair/typebox").TNumber;
    reverse: import("@sinclair/typebox").TBoolean;
}>;
export type ActiveRouteType = Static<typeof ActiveRouteSchema>;
/** Navigation point (next or previous). */
export declare const NextPreviousPointSchema: import("@sinclair/typebox").TObject<{
    href: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    type: import("@sinclair/typebox").TString;
    position: import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>;
}>;
export type NextPreviousPointType = Static<typeof NextPreviousPointSchema>;
/** Full course state response. */
export declare const CourseInfoSchema: import("@sinclair/typebox").TObject<{
    startTime: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    targetArrivalTime: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    arrivalCircle: import("@sinclair/typebox").TNumber;
    activeRoute: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        href: import("@sinclair/typebox").TString;
        name: import("@sinclair/typebox").TString;
        pointIndex: import("@sinclair/typebox").TNumber;
        pointTotal: import("@sinclair/typebox").TNumber;
        reverse: import("@sinclair/typebox").TBoolean;
    }>, import("@sinclair/typebox").TNull]>;
    nextPoint: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        href: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        type: import("@sinclair/typebox").TString;
        position: import("@sinclair/typebox").TObject<{
            latitude: import("@sinclair/typebox").TNumber;
            longitude: import("@sinclair/typebox").TNumber;
            altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    }>, import("@sinclair/typebox").TNull]>;
    previousPoint: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        href: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        type: import("@sinclair/typebox").TString;
        position: import("@sinclair/typebox").TObject<{
            latitude: import("@sinclair/typebox").TNumber;
            longitude: import("@sinclair/typebox").TNumber;
            altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    }>, import("@sinclair/typebox").TNull]>;
}>;
export type CourseInfoType = Static<typeof CourseInfoSchema>;
/**
 * Calculated course values derived from vessel position and destination.
 */
export declare const CourseCalculationsSchema: import("@sinclair/typebox").TObject<{
    calcMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"GreatCircle">, import("@sinclair/typebox").TLiteral<"Rhumbline">]>;
    crossTrackError: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    bearingTrackTrue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    bearingTrackMagnetic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    estimatedTimeOfArrival: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    distance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    bearingTrue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    bearingMagnetic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    velocityMadeGood: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    timeToGo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    targetSpeed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    previousPoint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        distance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>>;
    route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        distance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        timeToGo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        estimatedTimeOfArrival: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
}>;
export type CourseCalculationsType = Static<typeof CourseCalculationsSchema>;
/**
 * v2 course delta paths emitted on navigation.course.*
 * Emitted via handleMessage() with SKVersion.v2
 */
export declare const CourseDeltaV2Schema: import("@sinclair/typebox").TObject<{
    startTime: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    targetArrivalTime: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    activeRoute: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        href: import("@sinclair/typebox").TString;
        name: import("@sinclair/typebox").TString;
        pointIndex: import("@sinclair/typebox").TNumber;
        pointTotal: import("@sinclair/typebox").TNumber;
        reverse: import("@sinclair/typebox").TBoolean;
    }>, import("@sinclair/typebox").TNull]>;
    arrivalCircle: import("@sinclair/typebox").TNumber;
    previousPoint: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        href: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        type: import("@sinclair/typebox").TString;
        position: import("@sinclair/typebox").TObject<{
            latitude: import("@sinclair/typebox").TNumber;
            longitude: import("@sinclair/typebox").TNumber;
            altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    }>, import("@sinclair/typebox").TNull]>;
    nextPoint: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        href: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        type: import("@sinclair/typebox").TString;
        position: import("@sinclair/typebox").TObject<{
            latitude: import("@sinclair/typebox").TNumber;
            longitude: import("@sinclair/typebox").TNumber;
            altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
    }>, import("@sinclair/typebox").TNull]>;
}>;
/**
 * v1 course delta paths emitted on courseGreatCircle.* / courseRhumbline.*
 * Emitted via handleMessage() with SKVersion.v1
 */
export declare const CourseDeltaV1Schema: import("@sinclair/typebox").TObject<{
    'activeRoute.href': import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    'activeRoute.startTime': import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    'nextPoint.value.href': import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    'nextPoint.value.type': import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
    'nextPoint.position': import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>, import("@sinclair/typebox").TNull]>;
    'nextPoint.arrivalCircle': import("@sinclair/typebox").TNumber;
    'previousPoint.position': import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        latitude: import("@sinclair/typebox").TNumber;
        longitude: import("@sinclair/typebox").TNumber;
        altitude: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>, import("@sinclair/typebox").TNull]>;
    'previousPoint.value.type': import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>;
}>;
/** API config response */
export declare const CourseConfigSchema: import("@sinclair/typebox").TObject<{
    apiOnly: import("@sinclair/typebox").TBoolean;
}>;
//# sourceMappingURL=course-schemas.d.ts.map