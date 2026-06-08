declare module '@paystack/inline-js' {
  export interface PaystackArgs {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: Record<string, any>;
    onSuccess: (transaction: { reference: string; [key: string]: any }) => void;
    onCancel?: () => void;
    [key: string]: any;
  }

  export default class PaystackPop {
    constructor();
    newTransaction(options: PaystackArgs): void;
  }
}