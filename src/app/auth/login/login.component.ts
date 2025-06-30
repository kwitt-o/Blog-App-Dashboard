import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;



  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(24),
        Validators.pattern(/^(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?~\\/-])/),
        this.noSpacesValidator(),
        this.containsNumber(),
        this.containsUppercase(),
        this.containsLowercase()
      ]]
    });

    
    
  }

  // 🛠 Custom Validators

  noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasSpace = /\s/.test(control.value);
      return hasSpace ? { noSpaces: true } : null;
    };
  }

  containsNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasNumber = /\d/.test(control.value);
      return hasNumber ? null : { noNumber: true };
    };
  }

  containsUppercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasUpper = /[A-Z]/.test(control.value);
      return hasUpper ? null : { noUppercase: true };
    };
  }

  containsLowercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasLower = /[a-z]/.test(control.value);
      return hasLower ? null : { noLowercase: true };
    };
  }

  get fc() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    const {email, password} = this.loginForm.value;
    this.authService.login(email, password);
  }
}