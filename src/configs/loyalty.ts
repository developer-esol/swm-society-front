// Points to currency conversion
// POINT_VALUE is the currency amount (GBP) per 1 point.
// Default is 1 (1 point = £1). Can be overridden with VITE_POINT_VALUE env var.
export const POINT_VALUE: number = import.meta.env.VITE_POINT_VALUE
  ? Number(import.meta.env.VITE_POINT_VALUE)
  : 1;

export default POINT_VALUE;
