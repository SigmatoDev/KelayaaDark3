'use client';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: March 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>Welcome to Kelayaa. Your privacy is important to us, and this Privacy Policy explains how we collect, use, and protect your personal information.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <p>We collect information such as your name, email, phone number, billing/shipping address, and payment details when you make a purchase or sign up for our services.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside">
          <li>To process and fulfill your orders</li>
          <li>To improve our website and customer experience</li>
          <li>To send promotional offers and updates (only with your consent)</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Sharing of Information</h2>
        <p>We do not sell or rent your personal data. We may share your information with third-party service providers for order fulfillment, payment processing, and marketing, ensuring they comply with privacy standards.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p>We implement security measures to protect your personal data. However, no method of transmission over the internet is 100% secure.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <p>You can request access to your personal data, corrections, or deletion by contacting us at <strong>support@kelayaa.com</strong>.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Cookies</h2>
        <p>We use cookies to enhance your experience. You can manage your cookie preferences through your browser settings.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Continued use of our website signifies your acceptance of the updated terms.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, contact us at <strong>support@kelayaa.com</strong>.</p>
      </section>
    </div>
  );
}