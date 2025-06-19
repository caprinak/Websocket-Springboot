export interface Stock {
  code: string;
  price: number;
  dateFormatted: string;
  date?: string; // Raw date from backend, if ever needed
}