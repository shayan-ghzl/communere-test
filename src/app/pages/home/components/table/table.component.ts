import { Component, OnDestroy, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Subject, take, takeUntil } from 'rxjs';
import { Reminder } from '../../models/models';
import { DaysArrayPipe } from '../../pipes/days-array.pipe';
import { FilterPipe } from '../../pipes/filter.pipe';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { TimeArrayPipe } from '../../pipes/time-array.pipe';
import { StatesService } from '../../services/states.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    FilterPipe,
    MatButtonModule,
    MatIconModule,
    FormatDatePipe,
    TimeArrayPipe,
    DaysArrayPipe
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnDestroy {
  displayedColumns = ['title', 'dosage', 'frequency', 'lastUpdated', 'operation'];

  reminders: Signal<Reminder[]>;

  searchFilter: Signal<string>;

  unsubscribeAll$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private statesService: StatesService,
    private matSnackBar: MatSnackBar,
  ) {
    this.reminders = this.statesService.getReminders();
    this.searchFilter = this.statesService.getSearchFilter();
  }

  openDialog(reminder: Reminder): void {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      panelClass: ['communere-dialog-container'],
      maxWidth: '576px',
      width: '100%',
      autoFocus: false,
      data: reminder
    });

    dialogRef.afterClosed().pipe(
      take(1),
      takeUntil(this.unsubscribeAll$),
    ).subscribe(result => {
      if (result) {
        this.openSnackBar(`${result} has been successfully edited`);
      }
    });
  }

  openSnackBar(message: string, state: 'danger' | 'success' = 'success') {
    this.matSnackBar.open(message, '', {
      panelClass: [state],
      duration: 3000,
      verticalPosition: 'bottom',
    });
  }

  remove(reminder: Reminder): void {
    if (confirm(`Are you sure you want to delete ${reminder.title}?`)) {
      this.statesService.removeItem(reminder);
    }
  }

  unsubscribeAll(): void {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
