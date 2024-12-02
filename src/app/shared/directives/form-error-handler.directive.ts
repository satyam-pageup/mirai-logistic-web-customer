import { Directive, ElementRef, Input, Optional } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFormErrorHandler]',
})
export class FormErrorHandlerDirective {
  @Input('appFormErrorHandler') controlName!: string; // Correctly binding to the directive selector

  private formGroup!: FormGroup;

  constructor(
    private el: ElementRef,
    @Optional() private controlContainer: ControlContainer
  ) {}

  ngOnInit(): void {
    // Find the parent FormGroup using ControlContainer
    if (!this.controlContainer || !(this.controlContainer.control instanceof FormGroup)) {
      console.error('No parent FormGroup found for control:', this.controlName);
      return;
    }

    this.formGroup = this.controlContainer.control as FormGroup;

    const control = this.formGroup.get(this.controlName);

    if (!control) {
      console.error(`Control with name '${this.controlName}' not found in the FormGroup`);
      return;
    }

    // Subscribe to control status changes to display errors
    control.statusChanges.subscribe(() => {
      this.updateErrorMessage(control);
    });

    // Display error messages initially
    this.updateErrorMessage(control);
  }

  private updateErrorMessage(control: AbstractControl): void {
    const errorElement = this.getErrorElement();

    if (control.invalid && (control.dirty || control.touched)) {
      const errors = control.errors;
      if (errors) {
        errorElement.textContent = this.getErrorMessage(errors);
        errorElement.style.display = 'block';
      }
    } else {
      errorElement.style.display = 'none';
    }
  }

  private getErrorElement(): HTMLElement {
    let errorElement = this.el.nativeElement.nextElementSibling;

    if (!errorElement || errorElement.tagName !== 'SPAN') {
      errorElement = document.createElement('span');
      errorElement.style.color = 'red';
      errorElement.style.display = 'none';
      this.el.nativeElement.parentElement?.appendChild(errorElement);
    }

    return errorElement;
  }

  private getErrorMessage(errors: any): string {
    if (errors.required) return 'This field is required.';
    if (errors.minlength) return `Minimum length is ${errors.minlength.requiredLength} characters.`;
    if (errors.maxlength) return `Maximum length is ${errors.maxlength.requiredLength} characters.`;
    if (errors.pattern) return 'Invalid format.';
    if (errors.email) return 'Invalid email address.';
    return 'Invalid input.';
  }
}
