type ValidationRes = { status: "error"; error: string } | { status: "success" };

const SUCCESS: ValidationRes = { status: "success" };

export const validateName = (name: string): ValidationRes => {
  if (name.length < 3)
    return { status: "error", error: "Your name must have at least 3 characters" };
  return SUCCESS;
};

export const validateEmail = (email: string): ValidationRes => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
    )
    ? SUCCESS
    : { status: "error", error: "Invalid email" };
};

export const validatePassword = (password: string): ValidationRes => {
  let lowerCase = password.match(/[a-z]/g);
  let upperCase = password.match(/[A-Z]/g);
  let numbers = password.match(/[0-9]/g);

  if (password.length < 6 || password.length > 20)
    return { status: "error", error: "Must be between 6 and 20 characters" };
  if (!lowerCase) return { status: "error", error: "Must be contain lower case characters" };
  if (!upperCase) return { status: "error", error: "Must be contain upper case characters" };
  if (!numbers) return { status: "error", error: "Password must be contain at least one number" };
  return SUCCESS;
};
