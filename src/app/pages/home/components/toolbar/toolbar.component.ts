import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, take, takeUntil } from 'rxjs';
import { StatesService } from '../../services/states.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnDestroy {

  unsubscribeAll$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private statesService: StatesService,
    private matSnackBar: MatSnackBar,
  ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      panelClass: ['communere-dialog-container'],
      maxWidth: '576px',
      width: '100%',
      autoFocus: false,
    });

    dialogRef.afterClosed().pipe(
      take(1),
      takeUntil(this.unsubscribeAll$),
    ).subscribe(result => {
      if (result) {
        this.openSnackBar(`${result} has been successfully added`);
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

  setFilter(event: Event): void {
    const searchKey = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.statesService.setSearchFilter(searchKey);
  }

  unsubscribeAll(): void {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
