import {AbstractControl} from "@angular/forms";

export function confirmPasswordValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    const confirmPasswordControl = control.get('confirmPassword')
    confirmPasswordControl?.setErrors({mismatch: true, ...confirmPasswordControl?.errors});
  }

  return null;
}

export function passwordValidator(control: AbstractControl) {
  const errors: { [key: string]: true } = {}

  const passControl = control.get('password');

  const password: string = passControl?.value

  const hasUpperCaseLetter = password.split('')
    .filter(letter => letter === letter.toUpperCase())
    .length > 0

  if (!hasUpperCaseLetter) {
    errors["hasUpperCase"] = true
  }

  const hasLowerCaseLetter = password.split('')
    .filter(letter => letter === letter.toLowerCase())
    .length > 0

  if (!hasLowerCaseLetter) {
    errors["hasLowerCase"] = true
  }

  const hasDigit = password.split('')
    .filter(letter => !isNaN(Number(letter)))
    .length > 0

  if (!hasDigit) {
    errors["hasDigit"] = true
  }

  const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*"]
  const hasSpecialChar = password.split('')
    .filter(letter => specialChars.includes(letter))
    .length > 0

  if (!hasSpecialChar) {
    errors["hasSpecialChar"] = true
  }

  if (password.includes(" ")) {
    errors["hasSpace"] = true
  }

  if (Object.keys(errors).length) {
    passControl?.setErrors({...passControl?.errors, ...errors});
  }

  return null;
}

export function rgDocumentValidator(control: AbstractControl) {
  const documentControl = control.get('document');
  const document: string = documentControl?.value.replace(/[^0-9Xx]/g, '');

  if (document.length < 9) {
    return null
  }

  const lastDigit = document.charAt(document.length - 1)

  // Calculate the verification digit
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const digit = parseInt(document.charAt(i));
    sum += digit * (i + 1);
  }

  const remainder = sum % 11;
  const verificationDigit = 11 - remainder;

  const formatRg = (rg: string) => {
    return `${rg.slice(0, 2)}.${rg.slice(2, 5)}.${rg.slice(5, 8)}-${rg.charAt(8)}`;
  }

  if (verificationDigit.toString() === lastDigit
    || verificationDigit === 10 && lastDigit === "X" // Edge case that when the verification digit is 10, th rg has an X
    || verificationDigit === 11 && lastDigit === "0" // Edge case that when the verification digit is 11, it is instead a 0
  ) {
    const formatedValue = formatRg(document)
    documentControl?.setValue(formatedValue)
    return null
  }

  // Check if the calculated verification digit matches the provided verification digit
  documentControl?.setErrors({document: true, ...documentControl?.errors});
  return null
}
