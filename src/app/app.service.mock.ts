import { Injectable } from '@angular/core';
import { DataModel, DataToSend } from './models/data';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private worker: Worker;

  constructor() {
    // Also we can use SharedWorker, but it's not in test issue
    this.worker = new Worker(new URL('./data.worker', ''), {
      type: 'module',
    });
  }

  sendMessage(message: DataToSend): void {
    this.worker.postMessage(message);
  }

  onMessage(callback: (data: DataModel[]) => void): void {
    this.worker.onmessage = ({ data }) => callback(data);
  }
}
