import {
	add,
	constants,
	divide,
	Interval,
	pow,
	sqrt,
} from "interval-arithmetic";

const TWO = new Interval(2, 2);
const MachineEpsilon = pow(TWO, -52);
const CatalanConstant = new Interval(0.915965594177219, 0.91596559417722);
const GoldenRatio = divide(add(constants.ONE, sqrt(new Interval(5, 5))), TWO);

export const CONSTANTS: Record<string, Interval> = {
	Pi: constants.PI,
	EulerGamma: constants.E,
	ExponentialE: constants.E,
	MachineEpsilon: MachineEpsilon,
	CatalanConstant: CatalanConstant,
	GoldenRatio: GoldenRatio,
};
