import PaystackPop from '@paystack/inline-js';

// 1. Define strict type structures for metadata
export interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value: string | number;
}

export interface PaystackMetadata {
  cart_id?: string;
  user_id?: string;
  custom_fields?: PaystackCustomField[];
  [key: string]: any; // Allows passing any other custom fields you need
}

interface UsePaystackProps {
  email: string;
  amount: number; // In kobo
  metadata?: PaystackMetadata; // Made optional using the "?" mark
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

export const usePaystack = () => {
  const initializePayment = ({ email, amount, metadata, onSuccess, onCancel }: UsePaystackProps) => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY, 
      email,
      amount,
      currency: 'NGN',
      metadata, 
      onSuccess: (transaction) => {
        onSuccess(transaction.reference);
      },
      onCancel: () => {
        if (onCancel) onCancel();
      }
    });
  };

  return { initializePayment };
};