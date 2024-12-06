import { Component, effect, Inject, NgZone, Optional, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { _closeDialogVia, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Reminder } from '../../models/models';
import { ControlErrorPipe } from '../../pipes/control-error.pipe';
import { StatesService } from '../../services/states.service';

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatButtonModule,
    MatButtonToggleModule,
    MatTimepickerModule,
    ControlErrorPipe,
  ],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss'
})
export class AddDialogComponent {

  formGroup = new FormGroup({
    title: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)]),
    dosage: new FormControl<string | null>(null, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]),
    unit: new FormControl<string>('Capsules', [Validators.required]),
    days: new FormControl<string[] | null>(null, [Validators.required]),
    time: new FormArray([
      new FormControl<Date>(new Date(), [Validators.required]),
    ])
  });

  loadingSpinner = signal(false);

  get time(): FormArray {
    return this.formGroup.get('time') as FormArray;
  }

  constructor(
    private statesService: StatesService,
    private ngZone: NgZone,
    @Optional() public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: Reminder
  ) {
    effect(() => {
      if (this.loadingSpinner()) {
        this.formGroup.disable();
      } else {
        this.formGroup.enable();
      }
    });

    if (this.data) {
      const { title, dosage, unit, days, time } = this.data;
      this.initForm(time);

      this.formGroup.patchValue({ title, dosage, unit, days });
    }
  }

  addItem(): void {
    if (this.loadingSpinner()) {
      return;
    }
    const newItem = new FormControl(new Date(), [Validators.required]);
    this.time.push(newItem);
    this.formGroup.markAsDirty();
  }

  removeItem(index: number): void {
    this.time.removeAt(index);
  }

  initForm(time: Date[] | string[]): void {
    this.time.clear();

    time.forEach(date => {
      const newItem = new FormControl<Date>(new Date(date), [Validators.required]);
      this.time.push(newItem);
    });
  }

  addOrEdit(): void {
    if (this.formGroup.invalid || this.formGroup.pristine || this.loadingSpinner()) {
      return;
    }
    this.loadingSpinner.set(true);

    const value = this.formGroup.value as { title: string; dosage: string; unit: string; days: string[]; time: Date[]; };

    this.ngZone.run(() => {
      setTimeout(() => {
        if (this.data) {
          this.statesService.editItem({ ...value, id: this.data.id, lastUpdated: new Date() });
        } else {
          this.statesService.addItem({ ...value, id: this.statesService.maxId(), lastUpdated: new Date() });
        }
        _closeDialogVia(this.dialogRef, 'mouse', value.title);
      }, 1000);
    });

  }
}
