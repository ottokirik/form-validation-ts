export type ValidationRule<T> = (data: T) => boolean;

type RequiresAll<T> = ValidationRule<T>;
type RequiresAny<T> = ValidationRule<T>;

export const all =
  <T>(rules: List<ValidationRule<T>>): RequiresAll<T> =>
  (data) =>
    rules.every((isValid) => isValid(data));

export const some =
  <T>(rules: List<ValidationRule<T>>): RequiresAny<T> =>
  (data) =>
    rules.some((isValid) => isValid(data));

export type ErrorMessage = string;
export type ErrorMessages<TData> = Partial<Record<keyof TData, ErrorMessage>>;

export type ValidationRules<TData> = Partial<Record<keyof TData, ValidationRule<TData>>>;

type ValidationResult<TData> = {
  valid: boolean;
  errors: ErrorMessages<TData>;
};

export const createValidator = <TData>(rules: ValidationRules<TData>, errors: ErrorMessages<TData>) => {
  return function validate(data: TData): ValidationResult<TData> {
    const result: ValidationResult<TData> = {
      valid: true,
      errors: {},
    };

    Object.keys(rules).forEach((key) => {
      // Для каждого из полей находим правило проверки:
      const field = key as keyof TData;
      const validate = rules[field];

      // Если правила нет, пропускаем поле:
      if (!validate) return;

      // Если значение поля невалидно, указываем ошибку:
      if (!validate(data)) {
        result.valid = false;
        result.errors[field] = errors[field];
      }
    });

    return result;
  };
};
