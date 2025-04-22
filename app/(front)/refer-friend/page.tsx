"use client";
import Image from "next/image";

export default function ReferAFriend() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-16 space-y-16 text-[#333]">
      <h1 className="text-5xl font-bold text-center mb-10 text-pink-600">
        Refer a Friend
      </h1>

      {/* Main Message */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
          Share the Joy, <span className="text-pink-600">Earn Rewards!</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We are excited to introduce our Refer a Friend program soon! 
          Start spreading the word now by sharing your unique referral code.
          Stay tuned for amazing rewards coming your way.
        </p>
      </section>

      {/* Referral Code Section */}
      <section className="bg-pink-50 p-8 md:p-12 rounded-3xl shadow-xl text-center space-y-6">
        <h2 className="text-3xl font-bold">
          Your Referral Code
        </h2>
        <div className="text-2xl font-semibold text-pink-600">
          SOFTLAUNCH
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Share this code with your friends! Once our rewards system is live, 
          you'll get exciting perks for every successful referral.
        </p>
      </section>

      {/* How it will work */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-center">
          How it Will Work (Coming Soon!)
        </h2>
        <div className="text-left max-w-4xl mx-auto space-y-4">
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>Share your referral code with your friends.</li>
            <li>Friends use your code during their first purchase.</li>
            <li>Earn exclusive rewards for every successful referral.</li>
          </ul>
          <p className="text-gray-600 text-center mt-6">
            Stay tuned — we will notify you as soon as the full program is launched!
          </p>
        </div>
      </section>

      {/* Thank You Note */}
      <section className="bg-pink-50 p-8 md:p-12 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Thank You for Being a Part of Our Journey!
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto">
          Your support means the world to us. We can't wait to reward you for helping us grow!
        </p>
      </section>
    </div>
  );
}
