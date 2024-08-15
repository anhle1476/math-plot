/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { ComputeEngine } from "@cortex-js/compute-engine";
import functionPlot from "function-plot";
import { MathfieldElement } from "mathlive";
import { useEffect, useRef, useState } from "react";
import { evalMathJSON, isImplicitFunction } from "./interpreter";
import "//unpkg.com/mathlive";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"math-field": React.DetailedHTMLProps<
				React.HTMLAttributes<MathfieldElement>,
				MathfieldElement
			>;
		}
	}
}

function App() {
	const ref = useRef<HTMLDivElement>(null);
	const [sampler, setSampler] = useState<"interval" | "builtIn">("interval");
	const [value, setValue] = useState<string>("\\sin\\left(x\\right)");
	const [mathJsonValue, setMathJsonValue] = useState<string>('[ "Sin", "x" ]');
	const [compiledFn, setCompiledFn] = useState<{
		func: ((args: Record<string, any>) => any | undefined) | undefined;
	}>({
		func: undefined,
	});

	const mf = useRef<MathfieldElement>(null);

	// Customize the mathfield when it is created
	useEffect(() => {
		if (mf.current) {
			// @ts-expect-error expected
			MathfieldElement.computeEngine = new ComputeEngine();

			mf.current.mathVirtualKeyboardPolicy = "manual";
			mf.current.addEventListener("focusin", () =>
				window.mathVirtualKeyboard.show()
			);
			mf.current.addEventListener("focusout", () =>
				window.mathVirtualKeyboard.hide()
			);
		}
	}, [mf]);

	useEffect(() => {
		if (!ref.current) return;

		const evaluator = compiledFn.func ? compiledFn.func : mathJsonValue;
		const isImplicit = isImplicitFunction(mathJsonValue);
		try {
			const chart = functionPlot({
				target: "#app",
				grid: true,
				tip: {
					xLine: true, // dashed line parallel to y = 0
					yLine: true, // dashed line parallel to x = 0
				},
				data: [
					{
						fn: evaluator,
						sampler: sampler === "interval" ? "interval" : "builtIn",
						graphType: sampler === "interval" ? "interval" : "polyline",
						fnType: isImplicit ? "implicit" : "linear",
					},
				],
			});
			console.log(chart)
		} catch (error) {
			console.error(error);
		}
	}, [ref, mathJsonValue, compiledFn, sampler]);

	useEffect(() => {
		try {
			const expr = mf.current!.expression;
			if (sampler === "interval") {
				setCompiledFn({
					func: (scope = {}) => {
						try {
							return evalMathJSON(mathJsonValue, scope);
						} catch (error) {
							console.error(error);
							return undefined;
						}
					},
				});
				return;
			} else {
				const fn = expr.compile();
				if (fn) {
					const wrapper = (scope = {}) => {
						try {
							return fn!(scope);
						} catch (error) {
							console.error(error);
							return undefined;
						}
					};
					setCompiledFn({
						func: wrapper,
					});
					return;
				}
			}
			setCompiledFn({
				func: undefined,
			});
		} catch (error) {
			setCompiledFn({
				func: undefined,
			});
			console.warn("compile failed", error);
		}
	}, [mathJsonValue, sampler]);

	const setMfValue = () => {
		const value = mf.current!.getValue();
		setValue(value);
		const expr = mf.current!.expression;
		const mathJson = JSON.stringify(expr, undefined, 2);
		setMathJsonValue(mathJson);

		console.clear();
		console.log(mathJson);
	};

	return (
		<>
			<div>
				<math-field
					style={{ display: "block" }}
					ref={mf}
					onInput={() => setMfValue()}
				>
					{value}
				</math-field>
			</div>

			<p>
				<strong>Latex:</strong>
			</p>
			<p>{value}</p>
			<p>
				<strong>Math JSON:</strong>
			</p>
			<p>{mathJsonValue}</p>
			<button
				style={{ color: "white" }}
				onClick={() =>
					setSampler(sampler === "interval" ? "builtIn" : "interval")
				}
			>
				{sampler}
			</button>

			<div ref={ref} id="app"></div>
		</>
	);
}

export default App;
