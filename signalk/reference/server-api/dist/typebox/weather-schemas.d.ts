/**
 * TypeBox Schema Definitions for the Signal K Weather API
 *
 * Units follow SI conventions: K (temperature), Pa (pressure), m/s (speed),
 * rad (direction), m (distance/visibility), ratio (humidity/cloud).
 */
import { type Static } from '@sinclair/typebox';
/** Weather data type */
export declare const WeatherDataTypeSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"daily">, import("@sinclair/typebox").TLiteral<"point">, import("@sinclair/typebox").TLiteral<"observation">]>;
/** Pressure tendency */
export declare const PressureTendencySchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"steady">, import("@sinclair/typebox").TLiteral<"decreasing">, import("@sinclair/typebox").TLiteral<"increasing">]>;
/** Precipitation type */
export declare const PrecipitationTypeSchema: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"rain">, import("@sinclair/typebox").TLiteral<"thunderstorm">, import("@sinclair/typebox").TLiteral<"snow">, import("@sinclair/typebox").TLiteral<"freezing rain">, import("@sinclair/typebox").TLiteral<"mixed/ice">]>;
/**
 * Weather data model — observation, daily forecast, or point forecast.
 */
export declare const WeatherDataModelSchema: import("@sinclair/typebox").TObject<{
    date: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"daily">, import("@sinclair/typebox").TLiteral<"point">, import("@sinclair/typebox").TLiteral<"observation">]>;
    sun: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        sunrise: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        sunset: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
    outside: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        uvIndex: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        cloudCover: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        horizontalVisibility: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        horizontalVisibilityOverRange: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        temperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        feelsLikeTemperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        dewPointTemperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        pressure: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        pressureTendency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"steady">, import("@sinclair/typebox").TLiteral<"decreasing">, import("@sinclair/typebox").TLiteral<"increasing">]>>;
        absoluteHumidity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        relativeHumidity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        precipitationType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"rain">, import("@sinclair/typebox").TLiteral<"thunderstorm">, import("@sinclair/typebox").TLiteral<"snow">, import("@sinclair/typebox").TLiteral<"freezing rain">, import("@sinclair/typebox").TLiteral<"mixed/ice">]>>;
        precipitationVolume: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>>;
    wind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        averageSpeed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        speedTrue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        directionTrue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        gust: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        gustDirectionTrue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>>;
    water: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        temperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        level: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        levelTendency: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"steady">, import("@sinclair/typebox").TLiteral<"decreasing">, import("@sinclair/typebox").TLiteral<"increasing">]>>;
        waves: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            significantHeight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            directionTrue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            period: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>>;
        swell: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            height: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            directionTrue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            period: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>>;
        seaState: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        salinity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        ice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>>;
    current: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        drift: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        set: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    }>>;
}>;
export type WeatherDataModel = Static<typeof WeatherDataModelSchema>;
/**
 * Weather warning — time-bound severe weather advisory.
 */
export declare const WeatherWarningModelSchema: import("@sinclair/typebox").TObject<{
    startTime: import("@sinclair/typebox").TString;
    endTime: import("@sinclair/typebox").TString;
    source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    details: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type WeatherWarningModel = Static<typeof WeatherWarningModelSchema>;
//# sourceMappingURL=weather-schemas.d.ts.map