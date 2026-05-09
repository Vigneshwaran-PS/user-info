export type Gender = "Male" | "Female" | "Other";
export type MaritalStatus = "Married" | "Unmarried";
export type Salutation = "Mr" | "Mrs" | "Miss" | "Master" | "Dr";

export interface UserFormData {
  salutation: Salutation | "";
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender | "";
  houseName: string;
  gothram: string;
  education: string;
  occupation: string;
  fatherName: string;
  pincode: string;
  mobileNumber: string;
  email: string;
  maritalStatus: MaritalStatus | "";
}

export type FormErrors = Partial<Record<keyof UserFormData, string>>;
