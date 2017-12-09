import { AbstractControl, ValidationErrors } from '@angular/forms';


export class ValidatorExtendion {
    static range(control: AbstractControl): ValidationErrors | null {
        return null;
    }
}