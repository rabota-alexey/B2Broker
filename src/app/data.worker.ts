import { DataModel, DataToSend } from './models/data';

const MAX_ARRAY_SIZE = 100000;

// Function to generate a random data object
function generateDataObject(): DataModel {
  return {
    id: Math.random().toString(36).substring(2, 9),
    int: Math.floor(Math.random() * 100),
    float: parseFloat((Math.random() * 100).toFixed(18)),
    color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)})`,
    child: {
      id: Math.random().toString(36).substring(2, 9),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    },
  };
}

// Function to generate an array of data objects
export function generateDataArray(size: number): DataModel[] {
  return Array.from(
    { length: Math.min(size, MAX_ARRAY_SIZE) },
    generateDataObject
  );
}

let intervalIds: NodeJS.Timeout[] = [];
let lastInterval = 1000;
let lastSize = 100;

function clearAllIntervals() {
  intervalIds.forEach((id) => clearInterval(id));
  intervalIds = [];
}

// Web Worker message event listener
addEventListener('message', ({ data }) => {
  const { interval, size } = data as DataToSend;

  if (
    lastInterval !== interval ||
    lastSize !== size ||
    intervalIds.length >= MAX_ARRAY_SIZE
  ) {
    clearAllIntervals(); // Clear all previous timers
  }
  lastInterval = interval;

  // Interval to generate and post data
  const newId = setInterval(() => {
    const dataArray = generateDataArray(size);
    postMessage(dataArray);
  }, interval);

  intervalIds.push(newId);
});
