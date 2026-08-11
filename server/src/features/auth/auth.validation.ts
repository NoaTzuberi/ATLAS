interface RegisterInput {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}

interface LoginInput {
  email?: unknown;
  password?: unknown;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateRegisterInput(input: RegisterInput): string | null {
  const { name, email, password } = input;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return 'Name is required.';
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return 'A valid email is required.';
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return null;
}

export function validateLoginInput(input: LoginInput): string | null {
  const { email, password } = input;

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return 'A valid email is required.';
  }
  if (typeof password !== 'string' || password.length === 0) {
    return 'Password is required.';
  }

  return null;
}
