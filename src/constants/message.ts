export const EXCEPTION_ERROR_MESSAGE = {
  GET: (item: string) => `An unexpected error occurred when getting ${item}.`,
  ADD: (item: string) => `An unexpected error occurred when adding ${item}.`,
  UPDATE: (item: string) => `An unexpected error occurred when updating ${item}.`,
  DELETE: (item: string) => `An unexpected error occurred when deleting ${item}.`,
  CANCEL: (item: string) => `An unexpected error occurred when canceling ${item}.`,
  LOGIN: "An unexpected error occurred in the login request",
  REGISTER: "An unexpected error occurred in the register request.",
};
