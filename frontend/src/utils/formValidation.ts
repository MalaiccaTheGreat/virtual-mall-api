export interface FormErrors {
  [key: string]: string | undefined;
}

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateField = (name: string, value: string): string => {
  if (!value.trim()) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
  }
  
  if (name === 'email' && !validateEmail(value)) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

export const validateForm = (formData: Record<string, string>, fields: string[]): FormErrors => {
  const errors: FormErrors = {};
  
  fields.forEach(field => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(error => Boolean(error));
};
