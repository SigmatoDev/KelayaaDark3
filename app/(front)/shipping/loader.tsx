export const GuestLoaderOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
      <svg
        className="animate-spin h-8 w-8 text-pink-500 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      <p className="text-sm font-medium text-gray-700">{message}</p>
    </div>
  </div>
);
