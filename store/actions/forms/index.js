import { FORMS_UPDATE, FORMS_RESET } from "../";

export const formsUpdate = (forms) => ({
  type: FORMS_UPDATE,
  payload: {forms},
});

export const formsReset = () => {
  return {
    type: FORMS_RESET,
  };
};