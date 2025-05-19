import { useEffect } from "react";

export default function PaymentStatus({
  params,
}: {
  params: { transactionId: string };
}) {
  useEffect(() => {
    // You can fetch transaction status from your backend or PhonePe here
    console.log("Transaction ID:", params.transactionId);
  }, [params.transactionId]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-bold">Processing your payment...</h1>
      <p>Transaction ID: {params.transactionId}</p>
    </div>
  );
}
