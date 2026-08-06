export default function EmailInput({
  value,
  onChange,
  error,
}) {
  return (
    <div>

      <label className="block mb-2 font-semibold text-gray-700">
        Email
      </label>

      <input
        type="email"
        value={value}
        onChange={onChange}
        placeholder="Enter your email"
        className={`w-full h-14 rounded-xl px-5 text-lg transition
          ${
            error
              ? "border border-red-500 focus:ring-2 focus:ring-red-300"
              : "border border-gray-300 focus:ring-2 focus:ring-red-500"
          }
          focus:outline-none`}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}