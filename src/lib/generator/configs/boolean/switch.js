import { assertType } from "../../../utils/assert-type";

export const setupSwitchConfig = (optionConfigs) => {
  if (optionConfigs.hasOwnProperty('switch')) {
    assertType(optionConfigs.switch, 'boolean', 'switch property');
    
    // auto set sensiable to true;
    optionConfigs.sensible = true;
  }
};
