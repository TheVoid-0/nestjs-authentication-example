import { Transform } from 'class-transformer';

export const TransformBoolean = () => {
  return Transform(({ value }) => {
    return transformBoolean(value);
  });
};

export function transformBoolean(value: unknown) {
  return typeof value === 'string' ? value.toUpperCase() === 'TRUE' : Boolean(value);
}
