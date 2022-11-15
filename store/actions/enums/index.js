import { ENUM_UPDATE, ENUM_RESET } from "../";

export const enumUpdate = (enums) => ({
  type: ENUM_UPDATE,
  payload: enums,
});

export const enumReset = () => {
  return {
    type: ENUM_RESET,
  };
};