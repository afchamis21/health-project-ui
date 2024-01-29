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
