import { Application } from 'express';
import { Plugin, ServerAPI, ResourceProviderRegistry } from '@signalk/server-api';
interface ChartProviderApp extends ServerAPI, ResourceProviderRegistry, Application {
    config: {
        ssl: boolean;
        configPath: string;
        version: string;
        getExternalPort: () => number;
    };
}
declare const createPlugin: (app: ChartProviderApp) => Plugin;
export = createPlugin;
//# sourceMappingURL=index.d.ts.map