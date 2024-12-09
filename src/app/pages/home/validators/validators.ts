import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateNotDuplicatedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const formArray = control as FormArray;
        const dates = formArray.controls;

        const dateSet = new Set<number>();

        for (let i = 0; i < dates.length; i++) {
            const dateControl = dates[i];
            const date = dateControl.value as Date | null;

            if (date) {
                const timeValue = date.getHours() * 3600000 + date.getMinutes() * 60000;

                if (dateSet.has(timeValue)) {
                    dateControl.setErrors({ dateDuplicated: true });
                } else {
                    dateSet.add(timeValue);

                    const existingErrors = dateControl.errors || {};
                    delete existingErrors['dateDuplicated'];

                    dateControl.setErrors(Object.keys(existingErrors).length ? existingErrors : null);
                }
            }
        }

        return null;
    };
}