"use client";

import { HelpCircle, Phone, Handshake } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="help-center container">
      <h1 className="text-center text-4xl font-bold mb-8">Help Center</h1>
      <p className="text-center text-lg mb-8">
        Welcome to the Help Center. Here you can find resources and support to assist with your needs.
      </p>

      <h2 className="text-3xl font-semibold mb-4">Popular Topics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <div className="icon text-4xl text-blue-500 mb-4">
            <HelpCircle />
          </div>
          <h3 className="text-xl font-semibold mb-2">FAQ</h3>
          <p>Find answers to the most common questions and issues.</p>
          <a href="/faq" className="text-blue-500 hover:underline mt-4 block">Learn More</a>
        </div>

        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <div className="icon text-4xl text-green-500 mb-4">
            <Phone />
          </div>
          <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
          <p>Get in touch with our support team for personalized assistance.</p>
          <a href="/contact-support" className="text-green-500 hover:underline mt-4 block">Get Support</a>
        </div>

        <div className="card p-6 border rounded-lg shadow-lg hover:shadow-xl transition duration-300">
          <div className="icon text-4xl text-purple-500 mb-4">
            <Handshake />
          </div>
          <h3 className="text-xl font-semibold mb-2">Getting Started Guide</h3>
          <p>Get up and running quickly with our easy-to-follow guide.</p>
          <a href="/getting-started" className="text-purple-500 hover:underline mt-4 block">Start Here</a>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mt-10">Contact Us</h2>
      <p className="mt-4 text-lg">
        If you need further help, email us at{' '}
        <a href="mailto:help@example.com" className="text-blue-500 hover:underline">
          help@example.com
        </a>.
      </p>
    </div>
  );
};

export default HelpCenter;
