import { Interval } from "interval-arithmetic";

export type Scope = Record<string, any>;
export type ProcessedScope = Record<string, Interval>;

export type IntervalOperation = (...args: Interval[]) => Interval;

export type IntervalRelation = (x: Interval, y: Interval) => boolean;

export type Expression = [string, ...any];