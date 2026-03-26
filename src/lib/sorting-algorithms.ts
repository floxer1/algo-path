export interface SortStep {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  pivot?: number;
  label: string;
}

export function bubbleSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], label: 'Start' });

  for (let i = a.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: null, sorted: [...sorted], label: `Compare ${a[j]} and ${a[j + 1]}` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: null, swapping: [j, j + 1], sorted: [...sorted], label: `Swap ${a[j + 1]} and ${a[j]}` });
      }
    }
    sorted.push(i);
  }
  sorted.push(0);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: Array.from({ length: a.length }, (_, i) => i), label: 'Sorted!' });
  return steps;
}

export function mergeSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], label: 'Start' });

  function merge(start: number, mid: number, end: number) {
    const left = a.slice(start, mid + 1);
    const right = a.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      steps.push({ array: [...a], comparing: [start + i, mid + 1 + j], swapping: null, sorted: [], label: `Compare ${left[i]} and ${right[j]}` });
      if (left[i] <= right[j]) {
        a[k] = left[i];
        i++;
      } else {
        a[k] = right[j];
        j++;
      }
      steps.push({ array: [...a], comparing: null, swapping: [k, k], sorted: [], label: `Place ${a[k]} at position ${k}` });
      k++;
    }
    while (i < left.length) {
      a[k] = left[i];
      steps.push({ array: [...a], comparing: null, swapping: [k, k], sorted: [], label: `Place ${left[i]} at position ${k}` });
      i++; k++;
    }
    while (j < right.length) {
      a[k] = right[j];
      steps.push({ array: [...a], comparing: null, swapping: [k, k], sorted: [], label: `Place ${right[j]} at position ${k}` });
      j++; k++;
    }
  }

  function sort(start: number, end: number) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], label: `Divide: [${start}..${mid}] and [${mid + 1}..${end}]` });
    sort(start, mid);
    sort(mid + 1, end);
    merge(start, mid, end);
  }

  sort(0, a.length - 1);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: Array.from({ length: a.length }, (_, i) => i), label: 'Sorted!' });
  return steps;
}

export function quickSort(arr: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], label: 'Start' });

  function partition(low: number, high: number): number {
    const pivot = a[high];
    steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], pivot: high, label: `Pivot: ${pivot}` });
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({ array: [...a], comparing: [j, high], swapping: null, sorted: [], pivot: high, label: `Compare ${a[j]} with pivot ${pivot}` });
      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ array: [...a], comparing: null, swapping: [i, j], sorted: [], pivot: high, label: `Swap ${a[j]} and ${a[i]}` });
        }
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    steps.push({ array: [...a], comparing: null, swapping: [i + 1, high], sorted: [], label: `Place pivot ${pivot} at position ${i + 1}` });
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low >= high) return;
    const pi = partition(low, high);
    sort(low, pi - 1);
    sort(pi + 1, high);
  }

  sort(0, a.length - 1);
  steps.push({ array: [...a], comparing: null, swapping: null, sorted: Array.from({ length: a.length }, (_, i) => i), label: 'Sorted!' });
  return steps;
}

export function generateRandomArray(size: number, max: number = 50): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 5);
}
