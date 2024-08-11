import { constants, Interval } from "interval-arithmetic";
import { ProcessedScope, Scope } from "./model";
import { OPERATORS } from "./operations";
import { CONSTANTS } from "./constants";

type MathJSONExpression = [string, ...any];

export function evalMathJSON(mathJson: string, scope: Scope): Interval {
	const mathVal = JSON.parse(mathJson);
	const processed = processScope(scope);

	const res = evaluate(mathVal, processed);
    return res;
}

function processScope(scope: Scope): ProcessedScope {
	const processed: ProcessedScope = {};
	Object.keys(scope).forEach(function (k) {
		const value = scope[k];
		if (typeof value === "number") {
			processed[k] = new Interval(value);
		} else if (Array.isArray(value)) {
			processed[k] = new Interval(value[0], value[1]);
		}
		if (typeof value === "object" && "lo" in value && "hi" in value) {
			processed[k] = new Interval(value.lo, value.hi);
		} else {
			processed[k] = constants.EMPTY;
		}
	});

	return processed;
}

function evaluate(value: any, scope: ProcessedScope): Interval {
    if (Array.isArray(value)) {
        if (value.length === 0 || typeof value === "string") {
            throw new Error(`Invalid expression: ${value}`);
        }

        return evaluateExp(value as MathJSONExpression, scope);
    }
    if (typeof value === "number") {
        return new Interval(value, value);
    }
    if (typeof value === "string") {
        const scopedVal = scope[value];
        if (scopedVal !== undefined) {
            return scopedVal;
        }

        const constant = CONSTANTS[value];
        if (constant !== undefined) {
            return constant;
        }

        throw new Error(`Unknown variable: ${value}`);
    }
    if (typeof value === "object" && "lo" in value && "hi" in value) {
        return new Interval(value.lo, value.hi);
    }
    
    throw new Error(`Invalid value: ${value}`);
}

function evaluateExp(exp: MathJSONExpression, scope: ProcessedScope): Interval {
	const operator: string = exp[0];

    if (operator === "Sequence") {
        return constants.EMPTY;
    }

    if (operator === "Error") {
        throw new Error(exp.map(String).join("\n"));
    }

    const operatorFunc = OPERATORS[operator];
	if (!operatorFunc) {
		throw new Error(`Operator not supported: ${operator}`);
	}

    if (exp.length === 2) {
        return OPERATORS[operator](evaluate(exp[1], scope));
    }

    // go through all arguments
    let result = evaluate(exp[1], scope);
    for (let i = 2; i < exp.length; i++) {
        result = OPERATORS[operator](result, evaluate(exp[i], scope));
    }
    return result;
}
