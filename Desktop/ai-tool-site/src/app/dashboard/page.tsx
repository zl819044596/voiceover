export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your account and usage.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900">Voiceover Quota</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">3 / 3</p>
          <p className="mt-1 text-xs text-gray-400">Free tier · Resets daily</p>
        </div>

        <div className="rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900">Current Plan</h3>
          <p className="mt-2 text-xl font-bold text-gray-900">Free</p>
          <p className="mt-1 text-xs text-gray-400">
            <a href="/pricing" className="text-purple-600 hover:underline">
              Upgrade to Pro
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
