"use client";

import { PaymentElementsWrapper } from "./PaymentElementsWrapper";
import PaymentForm from "./PaymentForm";

interface PaymentFormWithElementsProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export default function PaymentFormWithElements(
  props: PaymentFormWithElementsProps
) {
  return (
    <PaymentElementsWrapper clientSecret={props.clientSecret}>
      <PaymentForm {...props} />
    </PaymentElementsWrapper>
  );
}
