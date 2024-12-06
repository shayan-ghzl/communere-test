import { computed, effect, Injectable, signal } from '@angular/core';
import { Reminder } from '../models/models';

const STORAGE_KEY = 'communere-medicator';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  private searchFilter = signal<string>('');

  private reminders = signal<Reminder[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

  maxId = computed(() => {
    const reminders = this.reminders();
    return reminders.length > 0 ? (Math.max(...reminders.map(reminder => reminder.id)) + 1) : 1;
  });

  syncStorage = effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reminders()));
  });

  getReminders() {
    return this.reminders.asReadonly();
  }

  editItem(updatedReminder: Reminder) {
    this.reminders.update(items =>
      items.map(reminder =>
        reminder.id === updatedReminder.id ? { ...reminder, ...updatedReminder } : reminder
      )
    );
  }

  addItem(reminder: Reminder) {
    this.reminders.update(items => [...items, reminder]);
  }

  removeItem(reminder: Reminder) {
    this.reminders.update(items => items.filter(item => item.id !== reminder.id));
  }

  clearReminders() {
    this.reminders.set([]);
  }

  getSearchFilter() {
    return this.searchFilter.asReadonly();
  }

  setSearchFilter(searchKey: string) {
    this.searchFilter.set(searchKey);
  }
}
