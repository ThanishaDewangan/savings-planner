export interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}

export class ExchangeRateService {
  private static readonly API_URL = "https://v6.exchangerate-api.com/v6/latest/USD";

  static async fetchLatestRates(): Promise<ExchangeRateResponse> {
    const response = await fetch(this.API_URL);
    
    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.result !== "success") {
      throw new Error(`Exchange rate API error: ${data["error-type"] || "Unknown error"}`);
    }

    return data;
  }

  static async getUSDToINRRate(): Promise<number> {
    const data = await this.fetchLatestRates();
    const inrRate = data.conversion_rates.INR;
    
    if (!inrRate) {
      throw new Error("INR rate not found in exchange rate data");
    }

    return inrRate;
  }

  static convertCurrency(amount: number, fromCurrency: "USD" | "INR", toCurrency: "USD" | "INR", exchangeRate: number): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    if (fromCurrency === "USD" && toCurrency === "INR") {
      return amount * exchangeRate;
    }

    if (fromCurrency === "INR" && toCurrency === "USD") {
      return amount / exchangeRate;
    }

    return amount;
  }

  static formatCurrency(amount: number, currency: "USD" | "INR"): string {
    if (currency === "USD") {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amount);
    }
  }
}
