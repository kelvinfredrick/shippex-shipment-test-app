// Form validation utilities
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateField = (
  value: any,
  rules: ValidationRule
): ValidationResult => {
  // Required validation
  if (rules.required && (!value || value.trim() === "")) {
    return {
      isValid: false,
      message: rules.message || "This field is required",
    };
  }

  // Skip other validations if value is empty and not required
  if (!value || value.trim() === "") {
    return { isValid: true };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      message:
        rules.message || `Minimum length is ${rules.minLength} characters`,
    };
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      message:
        rules.message || `Maximum length is ${rules.maxLength} characters`,
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return {
      isValid: false,
      message: rules.message || "Invalid format",
    };
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return {
      isValid: false,
      message: rules.message || "Invalid value",
    };
  }

  return { isValid: true };
};

// Common validation rules
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters long",
  },
  url: {
    required: true,
    custom: (value: string) => {
      try {
        new URL(value.startsWith("http") ? value : `https://${value}`);
        return true;
      } catch {
        return false;
      }
    },
    message: "Please enter a valid URL",
  },
  awbNumber: {
    required: true,
    minLength: 8,
    message: "AWB number must be at least 8 characters long",
  },
};

// Form validation
export const validateForm = (
  data: { [key: string]: any },
  rules: { [key: string]: ValidationRule }
) => {
  const errors: { [key: string]: string } = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const validation = validateField(data[field], rules[field]);
    if (!validation.isValid) {
      errors[field] = validation.message || "Invalid field";
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Login form validation
export const validateLoginForm = (data: {
  url: string;
  email: string;
  password: string;
}) => {
  const rules = {
    url: VALIDATION_RULES.url,
    email: VALIDATION_RULES.email,
    password: VALIDATION_RULES.password,
  };

  return validateForm(data, rules);
};

// Shipment search validation
export const validateShipmentSearch = (searchTerm: string) => {
  const rules = {
    searchTerm: {
      maxLength: 50,
      message: "Search term is too long",
    },
  };

  return validateForm({ searchTerm }, rules);
};
