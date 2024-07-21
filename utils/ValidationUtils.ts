import { camelCaseToReadable } from './TextUtils';

interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

type ValidatableValue = string | number | boolean | null | undefined;

type ValidatableObject = {
  [key: string]: ValidatableValue | ValidatableObject;
};

export const validateRequiredFields = (
  fields: ValidatableObject
): ValidationResult => {
  const missingFields: string[] = [];

  const checkFields = (obj: ValidatableObject, prefix: string = '') => {
    Object.entries(obj).forEach(([fieldName, value]) => {
      if (value && typeof value === 'object') {
        checkFields(value as ValidatableObject, `${prefix}${fieldName}.`);
      } else if (value === undefined || value === null || value === '') {
        missingFields.push(`${prefix}${camelCaseToReadable(fieldName)}`);
      }
    });
  };

  checkFields(fields);

  const cleanedMissingFields = missingFields.map((field) =>
    field.replace(/^unsafeMetadata\./, '')
  );

  return {
    isValid: cleanedMissingFields.length === 0,
    missingFields: cleanedMissingFields,
  };
};
