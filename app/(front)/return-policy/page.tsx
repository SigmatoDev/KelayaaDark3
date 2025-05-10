"use client";
import Image from "next/image";
export default function ReturnPolicy() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-16 space-y-16 text-[#333]">
      <h1 className="text-5xl font-bold text-center mb-10 text-pink-600">
        Return Policy
      </h1>
      {/* Can I do a return? */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
          Can I do a <span className="text-pink-600">Return?</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Sometimes it’s just not right, if your item wasn’t what you expected,
          don’t worry, you have up to 14 days after receipt to return the item.
        </p>
      </section>
      {/* To qualify for a return */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">
          To qualify for a return:
        </h2>
        <ul className="list-disc list-inside text-gray-700 max-w-4xl mx-auto space-y-3">
          <li>
            Items must be in a new unused condition; we reserve the right not to
            accept the return if the product shows signs of wear.
          </li>
          <li>
            All products returned must include all original packaging materials
            and tags.
          </li>
          <li>The product is unused, not tailored, or customized.</li>
          <li>
            The product is in the same condition in which it was received.
          </li>
          <li>
            The product is returned within 14 days of the date of purchase.
          </li>
          <li>
            The product is accompanied by the original invoice/receipt and
            certificate.
          </li>
          <li>The product is not tampered with or altered.</li>
        </ul>
      </section>
      {/* Non-returnable items */}
      <section className="bg-pink-50 p-8 md:p-12 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          The below items are non-returnable:
        </h2>
        <ul className="list-disc list-inside text-gray-700 max-w-4xl mx-auto space-y-3">
          <li>
            Personalized, adjusted to fit, customized, engraved products and
            made to order.
          </li>
          
          <li>Products purchased from a different country.</li>
        </ul>
      </section>
      {/* How do I return my item? */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-center">
          How do I return my item?
        </h2>
        <p className="text-gray-600 text-center">Online purchase</p>
        <div className="text-left max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl font-semibold">To register your return:</h3>
          <div className="space-y-4">
            <p>
              <strong>Step 1:</strong> Contact our customer service at{" "}
              <span className="text-pink-600">support@kelayaa.com</span> and
              specify the order number, the number of return item(s) and the
              return reason.
            </p>
            <p>
              <strong>Return Reasons:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Description on the website was not accurate.</li>
              <li>Ordered more than one size.</li>
              <li>Style not as expected.</li>
              <li>Damaged.</li>
              <li>Dislike colour.</li>
              <li>Quality not as expected.</li>
              <li>Delivery issue.</li>
              <li>Fit or size.</li>
              <li>Incorrect product.</li>
              <li>Product uncomfortable.</li>
            </ul>
            <p>
              <strong>Step 2:</strong> Customer service personnel will process
              your return request and arrange the item(s) to be picked up by
              courier.
            </p>
            <p>
              <strong>Step 3:</strong> Pack the item(s) to be returned in the
              original carton using the original packaging materials.
            </p>
            <p>
              <strong>Step 4:</strong> Allow approximately 14 working days for
              the return process upon our receipt of your return. Once your
              online return has been processed, you will receive a return
              confirmation email and the refund will be issued to the original
              order payment method. Refunds may take up to 10 working days to
              show on your account.
            </p>
            <p>
              The item must be returned to "return in store" with Kelayaa.com
              proof of purchase within 14 days after delivery/collection for a
              refund only. The store will provide a proof of return receipt for
              the returned product and a refund will be issued within 10 working
              days.
            </p>
          </div>
        </div>
      </section>
      {/* Can I exchange my product? */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-center">
          Can I exchange my product?
        </h2>
        <div className="text-left max-w-4xl mx-auto space-y-4">
          <p>
            <strong>Online purchase:</strong> It is not possible to exchange
            online purchases returned via post. All returned products will be
            refunded to the original payment method. Please place a new online
            order for the correct product. Or for straightforward size exchanges
            of the same product subject to product availability.
          </p>
          <p>
            <strong>Instore purchase:</strong> Exchanges for a different size,
            colour or alternative product can be processed at your original
            point of purchase, subject to product availability.
          </p>
          <p>
            <strong>Custom designs:</strong> We don’t accept cancellation for
            customized jewelry products. If the customer wants refund or wants
            to exchange it with other product, in that case, making charges and
            stone charges of the ordered product will be deducted from the
            amount paid and balance will be refunded to the customer account in
            7-10 business days or will be adjusted against the exchanged
            product.
          </p>
        </div>
      </section>
      {/* When will I receive my refund? */}
      <section className="bg-pink-50 p-8 md:p-12 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          When will I receive my refund?
        </h2>
        <div className="text-left max-w-4xl mx-auto space-y-4">
          <p>
            <strong>Returned through a courier service:</strong> Please note
            that your return will be processed within 10 days from the time we
            receive the product in our warehouse. Once processed, we will send
            you a confirmation email. It may take anywhere from 14 business days
            for the funds to appear back in your account.
          </p>
          <p>
            <strong>Returns to store:</strong> Your return will be processed the
            same day; however, it may take anywhere from 10 business days for
            the funds to appear back in your account.
          </p>
        </div>
      </section>
      {/* Lost Receipt */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-center">
          I have lost my receipt?
        </h2>
        <div className="text-left max-w-4xl mx-auto space-y-4">
          <p>Alternative documents will act as proof of purchase:</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>Authenticity card, date stamped.</li>
            <li>Bank or credit card statement.</li>
            <li>Credit card slip.</li>
          </ul>
        </div>
      </section>
      {/* International Policy */}
      <section className="bg-pink-50 p-8 md:p-12 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Can I exchange a product purchased from another country?
        </h2>
        <div className="text-left max-w-4xl mx-auto space-y-4">
          <p>
            Due to various reasons, Kelayaa does not have an international
            exchange or refund policy. As a result, we are unable to exchange,
            substitute, or refund products purchased abroad.
          </p>
        </div>
      </section>
    </div>
  );
}
