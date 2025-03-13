export type Size = "small" | "medium" | "large";

const sizes = {
  small: 32,
  medium: 50,
  large: 80,
};

export function getSize(size: Size): number {
  return sizes[size] || sizes.medium;
}
