import * as ia from "interval-arithmetic";
import { IntervalOperation } from "../model";

function square(value: ia.Interval): ia.Interval {
	return ia.pow(value, 2);
}

function pow(value: ia.Interval, power: ia.Interval | number): ia.Interval {
	if (ia.constants.E.lo === value.lo && ia.constants.E.hi === value.hi) {
		const powerInterval = ia.isInterval(power)
			? power as ia.Interval
			: new ia.Interval(power, power);
		return ia.exp(powerInterval);
	}

	return ia.pow(value, power);
}

export const ALGEBRA_OPERATIONS: Record<string, IntervalOperation> = {
	Mod: ia.fmod,
	Power: pow,
	Root: ia.nthRoot,
	Sqrt: ia.sqrt,
	Square: square,
};
