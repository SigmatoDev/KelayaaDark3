import Link from "next/link";
import { FaGem, FaRing, FaWrench, FaShapes, FaRuler, FaFileAlt, FaUndoAlt, FaPhoneAlt, FaEnvelope, FaEllipsisH, FaFeather } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
const MobileDrawer = ({ closeDrawer }: { closeDrawer: () => void }) => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg flex flex-col p-6 space-y-4 overflow-y-auto">
      {/* Top Close Button */}
      <button onClick={closeDrawer} className="text-right text-black mb-4 font-semibold">
        ✖ Close
      </button>

      {/* Main Menu Links */}
      <div className="flex flex-col space-y-4 text-black">
        <Link href="/search?materialType=silver" onClick={closeDrawer} className="flex items-center space-x-3 text-gray-700 hover:text-pink-600">
          <HiOutlineSparkles className="w-5 h-5" />
          <span>Silver</span>
        </Link>

        <Link href="/search?materialType=gold" onClick={closeDrawer} className="flex items-center space-x-3 text-gray-700 hover:text-pink-600">
          <FaRing className="w-5 h-5" />
          <span>Gold & Diamonds</span>
        </Link>

        <div className="flex items-center space-x-3 text-gray-400">
          <FaEllipsisH className="w-5 h-5" />
          <span>Beads (Coming Soon)</span>
        </div>

        <Link href="/custom-design" onClick={closeDrawer} className="flex items-center space-x-3 text-gray-700 hover:text-pink-600">
          <FaWrench className="w-5 h-5" />
          <span>Custom Design</span>
        </Link>

        <Link href="/search?productCategory=collections" onClick={closeDrawer} className="flex items-center space-x-3 text-gray-700 hover:text-pink-600">
          <FaShapes className="w-5 h-5" />
          <span>Collections</span>
        </Link>

        <Link href="/ring-bangle-size-guide" onClick={closeDrawer} className="flex items-center space-x-3 text-gray-700 hover:text-pink-600">
          <FaRuler className="w-5 h-5" />
          <span>Size Guide</span>
        </Link>

        
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 my-6" />

      {/* Contact Information */}
      <div className="flex flex-col space-y-4 text-gray-700">
        <div className="flex items-center space-x-3">
          <FaEnvelope className="w-5 h-5" />
          <span>info@kelayaa.com</span>
        </div>

        <div className="flex items-center space-x-3">
          <FaPhoneAlt className="w-5 h-5" />
          <span>+91 9945000100</span>
        </div>

        <div className="flex items-center space-x-3">
          <FaPhoneAlt className="w-5 h-5" />
          <span>+91 8431358078</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 my-6" />

      {/* Footer Links */}
      <div className="flex flex-col space-y-2 text-gray-500 text-sm">
        <Link href="/about-us" onClick={closeDrawer} className="hover:text-pink-600">About Us</Link>
        <Link href="/privacy-policy" onClick={closeDrawer} className="hover:text-pink-600">Privacy Policy</Link>
        <Link href="/terms-and-conditions" onClick={closeDrawer} className="hover:text-pink-600">Terms & Conditions</Link>
        <Link href="/return-policy" onClick={closeDrawer} className="hover:text-pink-600">Refund Policy</Link>
      </div>
    </div>
  );
};

export default MobileDrawer;
