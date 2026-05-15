"use strict";
/**
 * TypeBox Schema Definitions for the Signal K Discovery API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesModelSchema = exports.PluginMetaDataSchema = exports.DiscoveryDataSchema = exports.V1EndpointSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
/**
 * v1 endpoint descriptor — protocol addresses for a specific API version.
 */
exports.V1EndpointSchema = typebox_1.Type.Object({
    version: typebox_1.Type.String({
        description: 'Version of the Signal K API',
        examples: ['1.1.0']
    }),
    'signalk-http': typebox_1.Type.Optional(typebox_1.Type.String({
        description: "Address of the server's http API.",
        examples: ['http://192.168.1.88:3000/signalk/v1/api/']
    })),
    'signalk-ws': typebox_1.Type.Optional(typebox_1.Type.String({
        description: "Address of the server's WebSocket API.",
        examples: ['ws://192.168.1.88:3000/signalk/v1/stream']
    })),
    'signalk-tcp': typebox_1.Type.Optional(typebox_1.Type.String({
        description: "Address of the server's Signal K over TCP API.",
        examples: ['tcp://192.168.1.88:8375']
    }))
}, { $id: 'V1Endpoint' });
/**
 * Discovery response — server version and service endpoints.
 */
exports.DiscoveryDataSchema = typebox_1.Type.Object({
    endpoints: typebox_1.Type.Object({
        v1: typebox_1.Type.Optional(exports.V1EndpointSchema)
    }),
    server: typebox_1.Type.Object({
        id: typebox_1.Type.String({
            description: 'Id of the server implementation',
            examples: ['signalk-server-node']
        }),
        version: typebox_1.Type.String({
            description: 'Server software version'
        })
    })
}, {
    $id: 'DiscoveryData',
    description: 'Server version and service endpoint discovery data'
});
/**
 * Plugin metadata for feature discovery.
 */
exports.PluginMetaDataSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String({ description: 'Plugin ID.' }),
    name: typebox_1.Type.String({ description: 'Plugin name.' }),
    version: typebox_1.Type.String({ description: 'Plugin version.' })
}, {
    $id: 'PluginMetaData',
    description: 'Plugin metadata.'
});
/**
 * Server features response — available APIs and installed plugins.
 */
exports.FeaturesModelSchema = typebox_1.Type.Object({
    apis: typebox_1.Type.Array(typebox_1.Type.String(), {
        description: 'Implemented APIs.'
    }),
    plugins: typebox_1.Type.Array(exports.PluginMetaDataSchema, {
        description: 'Installed Plugins.'
    })
}, {
    $id: 'FeaturesModel',
    description: 'Features response'
});
