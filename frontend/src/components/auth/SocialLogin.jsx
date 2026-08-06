export default function SocialLogin() {
  return (
    <div className="mt-8">

      <div className="flex items-center mb-6">

        <div className="flex-1 border-t border-gray-300"></div>

        <span className="mx-4 text-gray-400 text-sm">
          OR
        </span>

        <div className="flex-1 border-t border-gray-300"></div>

      </div>

      <button
        className="w-full h-14 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700 flex items-center justify-center gap-3"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-6 h-6"
        />

        Continue with Google

      </button>

    </div>
  );
}