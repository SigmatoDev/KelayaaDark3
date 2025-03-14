import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const round2 = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const convertDocToObj = (doc: any) => {
  doc._id = doc._id.toString();
  return doc;
};

export const formatNumber = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatId = (x: string) => {
  return `..${x.substring(20, 24)}`;
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function serialize<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function formatDate(date: string | Date) {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(d);
}
