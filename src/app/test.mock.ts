import { DataModel } from './models/data';

export const correctTestData: DataModel[] = [
  {
    id: '1',
    int: 10,
    float: 10.5,
    color: 'red',
    child: { id: 'c1', color: 'blue' },
  },
];

export const incorrectTestData: any[] = [
  {
    id: null,
    int: 'invalid',
    float: 'invalid',
    color: 123,
    child: { id: null, color: null },
  },
];
