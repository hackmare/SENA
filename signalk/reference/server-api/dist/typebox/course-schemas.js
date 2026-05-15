"use strict";
/**
 * TypeBox Schema Definitions for the Signal K Course API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseConfigSchema = exports.CourseDeltaV1Schema = exports.CourseDeltaV2Schema = exports.CourseCalculationsSchema = exports.CourseInfoSchema = exports.NextPreviousPointSchema = exports.ActiveRouteSchema = exports.ReverseBodySchema = exports.PointIndexBodySchema = exports.NextPointBodySchema = exports.TargetArrivalTimeBodySchema = exports.ArrivalCircleBodySchema = exports.RouteDestinationSchema = exports.SetDestinationBodySchema = exports.PositionDestinationSchema = exports.HrefDestinationSchema = exports.CoursePointTypeSchema = exports.ArrivalCircleSchema = exports.SignalKHrefWaypointSchema = exports.SignalKHrefRouteSchema = exports.ErrorResponseSchema = exports.OkResponseSchema = exports.PositionSchema = exports.IsoTimeSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const shared_schemas_1 = require("./shared-schemas");
Object.defineProperty(exports, "PositionSchema", { enumerable: true, get: function () { return shared_schemas_1.PositionSchema; } });
Object.defineProperty(exports, "IsoTimeSchema", { enumerable: true, get: function () { return shared_schemas_1.IsoTimeSchema; } });
Object.defineProperty(exports, "OkResponseSchema", { enumerable: true, get: function () { return shared_schemas_1.OkResponseSchema; } });
Object.defineProperty(exports, "ErrorResponseSchema", { enumerable: true, get: function () { return shared_schemas_1.ErrorResponseSchema; } });
/** Signal K route resource href (UUID v4 format). */
exports.SignalKHrefRouteSchema = typebox_1.Type.String({
    $id: 'SignalKHrefRoute',
    pattern: `^/resources/routes/${shared_schemas_1.SignalKUuidPattern}$`,
    description: 'Pointer to route resource.',
    examples: ['/resources/routes/ac3a3b2d-07e8-4f25-92bc-98e7c92f7f1a']
});
/** Signal K waypoint resource href (UUID v4 format). */
exports.SignalKHrefWaypointSchema = typebox_1.Type.String({
    $id: 'SignalKHrefWaypoint',
    pattern: `^/resources/waypoints/${shared_schemas_1.SignalKUuidPattern}$`,
    description: 'Pointer to waypoint resource.',
    examples: ['/resources/waypoints/ac3a3b2d-07e8-4f25-92bc-98e7c92f7f1a']
});
/** Arrival circle radius in meters (non-negative). */
exports.ArrivalCircleSchema = typebox_1.Type.Number({
    $id: 'ArrivalCircle',
    minimum: 0,
    description: 'Radius of arrival zone in meters',
    examples: [500]
});
/** Type of course point. */
exports.CoursePointTypeSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal('VesselPosition'),
    typebox_1.Type.Literal('RoutePoint'),
    typebox_1.Type.Literal('Location')
], {
    $id: 'CoursePointType',
    description: 'Type of course point'
});
/** Destination by waypoint href. */
exports.HrefDestinationSchema = typebox_1.Type.Object({
    href: typebox_1.Type.String({
        pattern: `^/resources/waypoints/${shared_schemas_1.SignalKUuidPattern}$`,
        description: 'Reference to a related waypoint resource. A pointer to the resource UUID.',
        examples: ['/resources/waypoints/ac3a3b2d-07e8-4f25-92bc-98e7c92f7f1a']
    })
}, { $id: 'HrefDestination' });
/** Destination by position coordinates. */
exports.PositionDestinationSchema = typebox_1.Type.Object({
    position: shared_schemas_1.PositionSchema
}, { $id: 'PositionDestination', description: 'Location coordinates.' });
/**
 * PUT /course/destination request body.
 * Either a waypoint href or a position, optionally with an arrival circle.
 */
exports.SetDestinationBodySchema = typebox_1.Type.Intersect([
    typebox_1.Type.Union([exports.HrefDestinationSchema, exports.PositionDestinationSchema]),
    typebox_1.Type.Object({
        arrivalCircle: typebox_1.Type.Optional(exports.ArrivalCircleSchema)
    })
], { $id: 'SetDestinationBody' });
/** PUT /course/activeRoute request body. */
exports.RouteDestinationSchema = typebox_1.Type.Object({
    href: exports.SignalKHrefRouteSchema,
    pointIndex: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        default: 0,
        description: '0 based index of the point in the route to set as the destination'
    })),
    reverse: typebox_1.Type.Optional(typebox_1.Type.Boolean({
        default: false,
        description: 'Set to true to navigate the route points in reverse order.'
    })),
    arrivalCircle: typebox_1.Type.Optional(exports.ArrivalCircleSchema)
}, { $id: 'RouteDestination' });
/** PUT /course/arrivalCircle request body */
exports.ArrivalCircleBodySchema = typebox_1.Type.Object({
    value: exports.ArrivalCircleSchema
}, { $id: 'ArrivalCircleBody' });
/** PUT /course/targetArrivalTime request body */
exports.TargetArrivalTimeBodySchema = typebox_1.Type.Object({
    value: typebox_1.Type.Union([
        typebox_1.Type.String({
            pattern: shared_schemas_1.IsoTimePattern,
            description: 'ISO 8601 date-time string'
        }),
        typebox_1.Type.Null()
    ])
}, { $id: 'TargetArrivalTimeBody' });
/** PUT /course/activeRoute/nextPoint request body */
exports.NextPointBodySchema = typebox_1.Type.Object({
    value: typebox_1.Type.Optional(typebox_1.Type.Number({
        default: 1,
        description: 'Index offset of point in route (-ve = previous)'
    }))
}, { $id: 'NextPointBody' });
/** PUT /course/activeRoute/pointIndex request body */
exports.PointIndexBodySchema = typebox_1.Type.Object({
    value: typebox_1.Type.Number({
        minimum: 0,
        description: 'Index of point in route to set as destination.',
        examples: [2]
    })
}, { $id: 'PointIndexBody' });
/** PUT /course/activeRoute/reverse request body */
exports.ReverseBodySchema = typebox_1.Type.Object({
    pointIndex: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        description: 'Index of point in route to set as destination.',
        examples: [2]
    }))
}, { $id: 'ReverseBody' });
/** Active route state. */
exports.ActiveRouteSchema = typebox_1.Type.Object({
    href: exports.SignalKHrefRouteSchema,
    name: typebox_1.Type.String({
        description: 'Name of route.',
        examples: ['Here to eternity.']
    }),
    pointIndex: typebox_1.Type.Number({
        minimum: 0,
        description: '0 based index of the point in the route that is the current destination'
    }),
    pointTotal: typebox_1.Type.Number({
        description: 'Total number of points in the route'
    }),
    reverse: typebox_1.Type.Boolean({
        description: 'When true indicates the route points are being navigated in reverse order.'
    })
}, { $id: 'ActiveRoute' });
/** Navigation point (next or previous). */
exports.NextPreviousPointSchema = typebox_1.Type.Object({
    href: typebox_1.Type.Optional(typebox_1.Type.String({ description: 'Reference to a waypoint resource.' })),
    type: typebox_1.Type.String({
        description: "Type of point. Known values: VesselPosition (vessel's current location), RoutePoint (a point on the active route), Location (an arbitrary geographic position).",
        examples: ['RoutePoint', 'Location', 'VesselPosition']
    }),
    position: shared_schemas_1.PositionSchema
}, { $id: 'NextPreviousPoint' });
/** Full course state response. */
exports.CourseInfoSchema = typebox_1.Type.Object({
    startTime: typebox_1.Type.Union([typebox_1.Type.String({ pattern: shared_schemas_1.IsoTimePattern }), typebox_1.Type.Null()], {
        description: 'ISO 8601 timestamp when the course was set, or null when no course is active'
    }),
    targetArrivalTime: typebox_1.Type.Union([typebox_1.Type.String({ pattern: shared_schemas_1.IsoTimePattern }), typebox_1.Type.Null()], {
        description: 'ISO 8601 target arrival time, or null when not set'
    }),
    arrivalCircle: typebox_1.Type.Number({
        minimum: 0,
        description: 'Radius of arrival zone in meters',
        units: 'm'
    }),
    activeRoute: typebox_1.Type.Union([exports.ActiveRouteSchema, typebox_1.Type.Null()], {
        description: 'The active route, or null when navigating to a point'
    }),
    nextPoint: typebox_1.Type.Union([exports.NextPreviousPointSchema, typebox_1.Type.Null()], {
        description: 'The next navigation point, or null when no course is set'
    }),
    previousPoint: typebox_1.Type.Union([exports.NextPreviousPointSchema, typebox_1.Type.Null()], {
        description: 'The previous navigation point (departure point or last waypoint passed), or null when no course is set'
    })
}, {
    $id: 'CourseInfo',
    description: 'Course state including active route and navigation points.'
});
/**
 * Calculated course values derived from vessel position and destination.
 */
exports.CourseCalculationsSchema = typebox_1.Type.Object({
    calcMethod: typebox_1.Type.Union([typebox_1.Type.Literal('GreatCircle'), typebox_1.Type.Literal('Rhumbline')], {
        description: 'Calculation method by which values are derived.',
        default: 'GreatCircle',
        examples: ['Rhumbline']
    }),
    crossTrackError: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: "The distance from the vessel's present position to the closest point on a line (track) between previousPoint and nextPoint. A negative number indicates that the vessel is currently to the left of this line (and thus must steer right to compensate), a positive number means the vessel is to the right of the line (steer left to compensate).",
        units: 'm',
        examples: [458.784]
    })),
    bearingTrackTrue: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        description: 'The bearing of a line between previousPoint and nextPoint, relative to true north',
        units: 'rad',
        examples: [4.58491]
    })),
    bearingTrackMagnetic: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        description: 'The bearing of a line between previousPoint and nextPoint, relative to magnetic north',
        units: 'rad',
        examples: [4.51234]
    })),
    estimatedTimeOfArrival: typebox_1.Type.Optional(typebox_1.Type.String({
        pattern: shared_schemas_1.IsoTimePattern,
        description: 'The estimated time of arrival at nextPoint position.'
    })),
    distance: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        description: "The distance between the vessel's present position and the nextPoint",
        units: 'm',
        examples: [10157]
    })),
    bearingTrue: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        description: "The bearing of a line between the vessel's current position and nextPoint, relative to true north",
        units: 'rad',
        examples: [4.58491]
    })),
    bearingMagnetic: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        description: "The bearing of a line between the vessel's current position and nextPoint, relative to magnetic north",
        units: 'rad',
        examples: [4.51234]
    })),
    velocityMadeGood: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: 'The velocity component of the vessel towards the nextPoint',
        units: 'm/s',
        examples: [7.2653]
    })),
    timeToGo: typebox_1.Type.Optional(typebox_1.Type.Number({
        minimum: 0,
        description: "Time to reach nextPoint's perpendicular with current speed and direction",
        units: 's',
        examples: [8491]
    })),
    targetSpeed: typebox_1.Type.Optional(typebox_1.Type.Number({
        description: 'The average velocity required to reach the destination at the targetArrivalTime',
        units: 'm/s',
        examples: [2.2653]
    })),
    previousPoint: typebox_1.Type.Optional(typebox_1.Type.Object({
        distance: typebox_1.Type.Optional(typebox_1.Type.Number({
            minimum: 0,
            description: "The distance between the vessel's present position and the start point",
            units: 'm',
            examples: [10157]
        }))
    })),
    route: typebox_1.Type.Optional(typebox_1.Type.Object({
        distance: typebox_1.Type.Optional(typebox_1.Type.Number({
            minimum: 0,
            description: 'The distance along the route to the last point',
            units: 'm',
            examples: [15936]
        })),
        timeToGo: typebox_1.Type.Optional(typebox_1.Type.Number({
            minimum: 0,
            description: 'Time to reach perpendicular of last point in route with current speed and direction',
            units: 's',
            examples: [10452]
        })),
        estimatedTimeOfArrival: typebox_1.Type.Optional(typebox_1.Type.String({
            pattern: shared_schemas_1.IsoTimePattern,
            description: 'The estimated time of arrival at last point in route.'
        }))
    }))
}, {
    $id: 'CourseCalculations',
    description: 'Calculated course data values.'
});
/**
 * v2 course delta paths emitted on navigation.course.*
 * Emitted via handleMessage() with SKVersion.v2
 */
exports.CourseDeltaV2Schema = typebox_1.Type.Object({
    startTime: typebox_1.Type.Union([
        typebox_1.Type.String({ pattern: shared_schemas_1.IsoTimePattern }),
        typebox_1.Type.Null()
    ]),
    targetArrivalTime: typebox_1.Type.Union([
        typebox_1.Type.String({ pattern: shared_schemas_1.IsoTimePattern }),
        typebox_1.Type.Null()
    ]),
    activeRoute: typebox_1.Type.Union([exports.ActiveRouteSchema, typebox_1.Type.Null()]),
    arrivalCircle: typebox_1.Type.Number({
        minimum: 0,
        description: 'Radius of arrival zone in meters',
        units: 'm'
    }),
    previousPoint: typebox_1.Type.Union([exports.NextPreviousPointSchema, typebox_1.Type.Null()]),
    nextPoint: typebox_1.Type.Union([exports.NextPreviousPointSchema, typebox_1.Type.Null()])
}, {
    $id: 'CourseDeltaV2',
    description: 'Course delta values emitted under navigation.course.* (Signal K v2)'
});
/**
 * v1 course delta paths emitted on courseGreatCircle.* / courseRhumbline.*
 * Emitted via handleMessage() with SKVersion.v1
 */
exports.CourseDeltaV1Schema = typebox_1.Type.Object({
    'activeRoute.href': typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    'activeRoute.startTime': typebox_1.Type.Union([
        typebox_1.Type.String({ pattern: shared_schemas_1.IsoTimePattern }),
        typebox_1.Type.Null()
    ]),
    'nextPoint.value.href': typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    'nextPoint.value.type': typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()]),
    'nextPoint.position': typebox_1.Type.Union([shared_schemas_1.PositionSchema, typebox_1.Type.Null()]),
    'nextPoint.arrivalCircle': typebox_1.Type.Number({
        minimum: 0,
        description: 'Radius of arrival zone in meters',
        units: 'm'
    }),
    'previousPoint.position': typebox_1.Type.Union([shared_schemas_1.PositionSchema, typebox_1.Type.Null()]),
    'previousPoint.value.type': typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Null()])
}, {
    $id: 'CourseDeltaV1',
    description: 'Course delta values emitted under navigation.courseGreatCircle.* and navigation.courseRhumbline.* (Signal K v1)'
});
/** API config response */
exports.CourseConfigSchema = typebox_1.Type.Object({
    apiOnly: typebox_1.Type.Boolean({
        description: 'When true, course data is only available via the API and not emitted as v1 deltas'
    })
}, { $id: 'CourseConfig', description: 'Course API configuration' });
