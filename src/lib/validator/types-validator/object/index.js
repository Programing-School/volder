import { validateInstance } from './instance';
import { validateWith, validateWithout, validateStrict } from './with-without-strcit';


export const objectCase = (input, optionName, optionConfigs, errors, collectErrors, unclonedInput) => {
  const isObject = typeof input[optionName] === 'object' && !Array.isArray(input[optionName]) && input[optionName] !== null;

  if (!isObject) {
    if (collectErrors) {
      errors[optionName] = optionConfigs.typeErrorMessage || `${optionName} should be an object`;
    }

    return false;
  }

  if (optionConfigs.hasOwnProperty('instance') && !validateInstance(unclonedInput[optionName], optionConfigs.instance)) {
    if (collectErrors) {
      errors[optionName] = optionConfigs.instanceErrorMessage || `${optionName} is not instance of selected constructor`;
    }

    return false;
  }
  if (optionConfigs.hasOwnProperty('with') && !validateWith(input[optionName], optionConfigs.with)) {
    if (collectErrors) {
      errors[optionName] = optionConfigs.withErrorMessage || `${optionName} has missed keys required to include`;
    }

    return false;
  }
  if (optionConfigs.hasOwnProperty('without') && !validateWithout(input[optionName], optionConfigs.without)) {
    if (collectErrors) {
      errors[optionName] = optionConfigs.withoutErrorMessage || `${optionName} has keys are not allowed to include`;
    }

    return false;
  }

  if (optionConfigs.hasOwnProperty('strict') && !validateStrict(input[optionName], optionConfigs.strict)) {
    if (collectErrors) {
      errors[optionName] = optionConfigs.strictErrorMessage || `${optionName} is matches strict config`;
    }

    return false;
  }
  
  return true;
};
