import type { FormErrors, UserFormData } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidISODate(value: string): boolean {
  if (!ISO_DATE_REGEX.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return false;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }
  // Cannot be in the future.
  return date.getTime() <= Date.now();
}

export function validate(data: UserFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.salutation) errors.salutation = "Please select a salutation";

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "First name is too short";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!data.dateOfBirth.trim()) {
    errors.dateOfBirth = "Date of birth is required";
  } else if (!isValidISODate(data.dateOfBirth.trim())) {
    errors.dateOfBirth = "Please pick a valid date of birth";
  }

  if (!data.gender) errors.gender = "Please select a gender";
  if (!data.houseName.trim()) errors.houseName = "House name is required";
  if (!data.gothram.trim()) errors.gothram = "Gothram is required";
  if (!data.education.trim()) errors.education = "Education is required";
  if (!data.occupation.trim()) errors.occupation = "Occupation is required";
  if (!data.fatherName.trim()) errors.fatherName = "Father's name is required";

  if (!data.pincode.trim()) {
    errors.pincode = "Pincode is required";
  } else if (!PINCODE_REGEX.test(data.pincode.trim())) {
    errors.pincode = "Pincode must be 6 digits";
  }

  if (!data.mobileNumber.trim()) {
    errors.mobileNumber = "Mobile number is required";
  } else if (!MOBILE_REGEX.test(data.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!data.maritalStatus) errors.maritalStatus = "Please select marital status";

  return errors;
}
