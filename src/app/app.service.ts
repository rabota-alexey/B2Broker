import { Injectable } from '@angular/core';
import { DataModel, DataToSend } from './models/data';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(new URL('./data.worker', import.meta.url), {
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
