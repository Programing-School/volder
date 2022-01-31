import { validateInput } from './validate-input';
import { Volder } from '../volder';
import { deepClone } from '../utils/deep-clone';

export const validator = (volderMap, input, collectErrors = true, isSingleVolder = false) => {
  const clonedInput = deepClone(input);
  const errors = {};
  let valid = true;

  volderMap.forEach((optionConfigs, optionName) => {
    let validCurInput = true;

    // check if option is required
    if (!clonedInput.hasOwnProperty(optionName)) {
      if (optionConfigs.required) {
        if (collectErrors) errors[optionName] = optionConfigs.requiredErrorMessage || `${optionName} is required`;
        validCurInput = false;
      } else if (optionConfigs.hasOwnProperty('default')) {
        clonedInput[optionName] = optionConfigs.default;
      }
    } else {
      if (optionConfigs.type instanceof Volder) {
        const isObject =
          typeof clonedInput[optionName] === 'object' &&
          !Array.isArray(clonedInput[optionName]) &&
          clonedInput[optionName] !== null;

        if (isObject) {
          const validationResult = validator(optionConfigs.type.volderMap, clonedInput[optionName], collectErrors);

          validCurInput = collectErrors ? validationResult.valid : validationResult;

          if (collectErrors && Object.keys(validationResult.errors).length > 0) errors[optionName] = validationResult.errors;
        } else {
          if (collectErrors) errors[optionName] = optionConfigs.typeErrorMessage || `${optionName} should be an object`;
          validCurInput = false;
        }
      } else {
        validCurInput = validateInput(clonedInput, optionName, optionConfigs, errors, collectErrors, input);

        // pattern config validation
        if (optionConfigs.hasOwnProperty('pattern') && !optionConfigs.pattern(clonedInput[optionName]) && validCurInput) {
          if (collectErrors) {
            errors[optionName] = optionConfigs.patternErrorMessage || `${optionName} is not in proper pattern`;
          }

          validCurInput = false;
        }

        // transform config validation
        if (optionConfigs.hasOwnProperty('transform') && validCurInput) {
          clonedInput[optionName] = optionConfigs.transform(clonedInput[optionName]);
        }
      }
    }

    if (!validCurInput) valid = false;
  });

  if (collectErrors)
    return {
      valid,
      errors: !isSingleVolder ? errors : valid ? null : errors[''],
      value: isSingleVolder ? clonedInput[''] : valid ? clonedInput : {}
    };
  else return valid;
};
