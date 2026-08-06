export default function RememberMe() {
  return (
    <div className="flex items-center justify-between">

      <label className="flex items-center gap-2 text-gray-700 cursor-pointer">

        <input
          type="checkbox"
          className="w-4 h-4 accent-red-600"
        />

        Remember Me

      </label>

      <button
        type="button"
        className="text-red-600 hover:text-red-700 hover:underline font-medium transition"
      >
        Forgot Password?
      </button>

    </div>
  );
}