export type JsonValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      errors: string[];
    };

export type ValidatedJsonRunResult<T> = {
  value: T;
  rawText: string;
  attempts: number;
  repaired: boolean;
};

export async function runValidatedJsonGeneration<T>(params: {
  maxAttempts?: number;
  generate: (context: {
    attempt: number;
    previousOutput: string;
    validationErrors: string[];
  }) => Promise<string>;
  parseAndValidate: (rawText: string) => JsonValidationResult<T>;
  formatValidationErrors: (errors: string[]) => string;
  failureLabel: string;
}): Promise<ValidatedJsonRunResult<T>> {
  const maxAttempts = params.maxAttempts ?? 3;
  let rawText = "";
  let validationErrors: string[] = [];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    rawText = await params.generate({
      attempt,
      previousOutput: rawText,
      validationErrors,
    });

    const parsed = params.parseAndValidate(rawText);
    if (parsed.ok) {
      return {
        value: parsed.value,
        rawText,
        attempts: attempt,
        repaired: attempt > 1,
      };
    }

    validationErrors = parsed.errors;
  }

  throw new Error(
    [
      `${params.failureLabel} failed validation after ${maxAttempts} attempts.`,
      "Validation errors:",
      params.formatValidationErrors(validationErrors),
      "",
      "Last model output:",
      rawText,
    ].join("\n"),
  );
}
