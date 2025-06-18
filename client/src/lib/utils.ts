import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string, currency: "USD" | "INR"): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (currency === "USD") {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numAmount);
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numAmount);
  }
}

export function convertCurrency(
  amount: number | string, 
  fromCurrency: "USD" | "INR", 
  toCurrency: "USD" | "INR", 
  exchangeRate: number
): number {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (fromCurrency === toCurrency) {
    return numAmount;
  }

  if (fromCurrency === "USD" && toCurrency === "INR") {
    return numAmount * exchangeRate;
  }

  if (fromCurrency === "INR" && toCurrency === "USD") {
    return numAmount / exchangeRate;
  }

  return numAmount;
}

export function calculateProgress(saved: number | string, target: number | string): number {
  const numSaved = typeof saved === "string" ? parseFloat(saved) : saved;
  const numTarget = typeof target === "string" ? parseFloat(target) : target;
  
  if (numTarget === 0) return 0;
  
  return Math.min((numSaved / numTarget) * 100, 100);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function validatePositiveNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

export function formatNumberInput(value: string): string {
  // Remove non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleaned;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
