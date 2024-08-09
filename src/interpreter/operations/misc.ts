import { IntervalOperation } from "../model";
import * as ia from "interval-arithmetic";

function log(value: ia.Interval, base: ia.Interval): ia.Interval {
	const badVal = ia.isEmpty(value);
	const badBase = ia.isEmpty(base);
	if (badVal || badBase) {
		return ia.constants.EMPTY;
	}
	return ia.div(ia.log(value), ia.log(base));
}

function logOnePlus(value: ia.Interval): ia.Interval {
	const badVal = ia.isEmpty(value);
	if (badVal) {
		return ia.constants.EMPTY;
	}
	return ia.ln(ia.add(value, new ia.Interval(1, 1)));
}

function ceil(value: ia.Interval): ia.Interval {
	const badVal = ia.isEmpty(value);
	if (badVal) {
		return ia.constants.EMPTY;
	}
	return new ia.Interval(Math.ceil(value.lo), Math.ceil(value.hi));
}

function floor(value: ia.Interval): ia.Interval {
	const badVal = ia.isEmpty(value);
	if (badVal) {
		return ia.constants.EMPTY;
	}
	return new ia.Interval(Math.floor(value.lo), Math.floor(value.hi));
}

function round(value: ia.Interval): ia.Interval {
	const badVal = ia.isEmpty(value);
	if (badVal) {
		return ia.constants.EMPTY;
	}
	return new ia.Interval(Math.round(value.lo), Math.round(value.hi));
}

function rational(x: ia.Interval, y?: ia.Interval): ia.Interval {
	const badX = ia.isEmpty(x);
	if (badX) {
		return ia.constants.EMPTY;
	}
	if (y === undefined) {
		return x;
	}
	return ia.divide(x, y);
}

export const MISC_OPERATIONS: Record<string, IntervalOperation> = {
	Exp: ia.exp,
	Ln: ia.ln,
	Lb: ia.log2,
	Lg: ia.log10,
	Log: log,
	LogOnePlus: logOnePlus,
	Max: ia.max,
	Min: ia.min,
	Abs: ia.abs,
	Ceil: ceil,
	Floor: floor,
	Round: round,
	Rational: rational,
};
