import { PathValue } from '@signalk/server-api';
import { CourseData } from '../types';
export type CalcMethod = 'GreatCircle' | 'Rhumbline';
/**
 * Build a SignalK v2 delta message for the course calcValues subtree.
 *
 * Note the intentional quirk: `velocityMadeGood` (and the performance
 * mirror) publish `source.velocityMadeGoodToCourse`, not `velocityMadeGood`,
 * preserved verbatim from the original implementation to keep the delta
 * stream byte-compatible with existing subscribers.
 */
export declare function buildDeltaMsg(course: CourseData, method: CalcMethod): {
    updates: {
        values: PathValue[];
    }[];
};
//# sourceMappingURL=delta-msg.d.ts.map