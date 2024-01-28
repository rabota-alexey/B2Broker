import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subject, debounceTime, interval } from 'rxjs';
import { WorkerService } from './app.service';
import { DataModel } from './models/data';

const updateTableDataTimeout = 1500; // How often refresh screen with new data
const updateSettingsTimeout = 1000; // Seconds to wait till update values

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  //changeDetection: ChangeDetectionStrategy.OnPush, not needed because of Signal in table array
})
export class AppComponent implements OnInit {
  private readonly workerService = inject(WorkerService);
  // private readonly cdr = inject(ChangeDetectorRef);
  private inputChanged = new Subject<boolean>();

  timerInterval = 1000; // Default interval in milliseconds
  dataArraySize = 100; // Default size of data array
  additionalIds: string = ''; // Additional IDs, comma-separated
  rawData: DataModel[] = []; // Raw data from worker
  displayedData = signal<DataModel[]>([]); // Data to display (last 10 elements)
  refreshDataInterval = interval(updateTableDataTimeout);

  ngOnInit() {
    this.refreshDataInterval.subscribe(() => {
      this.updateDisplayedData();
      // this.cdr.detectChanges();  Let web controls be responsive, but not needed anymore because of Signal
    });

    this.initializeWorker();
    this.updateSettings(); // Start the worker with initial settings
    this.updateDisplayedData();

    this.inputChanged
      .pipe(debounceTime(updateSettingsTimeout))
      .subscribe(() => {
        this.updateSettings();
      });
  }

  initializeWorker() {
    // Can be very heavy if data is large
    this.workerService.onMessage((data) => {
      this.rawData = data; // Update data every time it's received from Worker
    });
  }

  // Function to update worker settings
  updateSettings() {
    this.workerService.sendMessage({
      interval: this.timerInterval || 1000,
      size: this.dataArraySize || 100,
    });
  }

  updateDisplayedData() {
    const lastTen = this.rawData.slice(-10); // Get last 10 elements

    // Overwrite IDs if additionalIds are provided
    if (this.additionalIds) {
      const ids = this.additionalIds.split(',');
      lastTen.forEach((item, index) => {
        if (ids[index]) {
          item.id = ids[index].trim();
        }
      });
    }

    this.displayedData.set(lastTen);
  }

  toNumber(value: string): number {
    try {
      let numberValue = +value;
      return isNaN(numberValue) ? 0 : numberValue;
    } catch {
      return 0;
    }
  }

  onInputChange() {
    this.timerInterval = this.toNumber(this.timerInterval?.toString()) || 1000;
    this.dataArraySize = this.toNumber(this.dataArraySize?.toString()) || 100;
    this.inputChanged.next(true);
  }
}
