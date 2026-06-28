export interface ResetPasswordFormData {
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordFormErrors {
  new_password?: string;
  confirm_password?: string;
}
