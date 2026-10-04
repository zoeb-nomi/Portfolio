/** Round a chart coordinate to two decimals, so inline styles carry "13.75" and not "13.750000000000002". */
export const n2 = (v: number): number => Math.round(v * 100) / 100;
