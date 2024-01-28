import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { WorkerService } from './app.service';
import { DataToSend } from './models/data';
import { generateDataArray } from './data.worker';
import { incorrectTestData } from './test.mock';

describe(WorkerService.name, () => {
  let mockWorkerService: WorkerService;
  let mockWorker: any;

  beforeEach(async () => {
    mockWorker = {
      postMessage: jest.fn(),
      onmessage: null,
    };
    window.Worker = jest.fn().mockImplementation(() => mockWorker);
    mockWorkerService = new WorkerService();
  });

  it('should create a web worker on service instantiation', () => {
    expect(window.Worker).toHaveBeenCalled();
  });

  it('should send messages to worker', () => {
    const testMessage: DataToSend = { interval: 100, size: 100 };
    mockWorkerService.sendMessage(testMessage);
    expect(mockWorker.postMessage).toHaveBeenCalledWith(testMessage);
  });

  it('should handle messages from worker', () => {
    const mockCallback = jest.fn();
    const testData = generateDataArray(20);

    mockWorkerService.onMessage(mockCallback);
    mockWorker.onmessage({ data: testData });

    expect(mockCallback).toHaveBeenCalledWith(testData);
  });
});

describe(AppComponent.name, () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let mockWorker: any;
  let changeDetectorRefMock: any;
  let inputChangedSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockWorker = {
      onMessage: jest.fn(),
      sendMessage: jest.fn(),
    };
    window.Worker = jest.fn().mockImplementation(() => mockWorker);

    changeDetectorRefMock = {
      detectChanges: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent], // As it's standalone component
      providers: [
        { provide: WorkerService, useValue: mockWorker },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Init property inputChanged as Subject
    component['inputChanged'] = new Subject<boolean>();
    inputChangedSpy = jest.spyOn(component['inputChanged'], 'next');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize worker and set up data stream', () => {
    expect(component.refreshDataInterval).toBeDefined();
    expect(component.timerInterval).toBeDefined();
    expect(component.dataArraySize).toBeDefined();
  });

  it('should update settings and data display on initialization', () => {
    expect(mockWorker.sendMessage).toHaveBeenCalledWith({
      interval: component.timerInterval,
      size: component.dataArraySize,
    });
    expect(component.displayedData()).toBeDefined();
  });

  it('should update displayed data correctly', () => {
    const corectTestData = generateDataArray(20);
    component.rawData = corectTestData;
    component.updateDisplayedData();
    expect(component.displayedData().length).toBeLessThanOrEqual(10);
    expect(component.displayedData()[0]?.id).toBe(
      corectTestData[corectTestData?.length - 10]?.id
    );
  });

  it('should handle incorrect data without crashing', () => {
    component.rawData = incorrectTestData;
    expect(() => {
      component.updateDisplayedData();
    }).not.toThrow();
  });

  it('should handle input changes and update settings', () => {
    // Arrange
    component.timerInterval = 2000;
    component.dataArraySize = 50;

    // Act
    component.onInputChange();

    // Assert
    expect(component.timerInterval).toBe(2000);
    expect(component.dataArraySize).toBe(50);
    expect(inputChangedSpy).toHaveBeenCalled();
  });

  it('should convert string input to number correctly', () => {
    expect(component.toNumber('100')).toBe(100);
    expect(component.toNumber('invalid')).toBe(0);
    expect(component.toNumber('')).toBe(0);
  });
});
