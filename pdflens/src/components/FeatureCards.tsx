const features = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-violet-400"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "100% Private",
    desc: "Everything stays on your device. We never see your files.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-violet-400"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Instant Results",
    desc: "No upload wait. Process and analyze right in your browser tab.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-violet-400"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "On-Device AI",
    desc: "Runs locally via WebGPU (Fast). No server, no API calls.",
  },
];

export default function FeatureCards() {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-4">
      <div className="grid gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center transition-colors hover:border-gray-700"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-900/30">
              {f.icon}
            </div>
            <h3 className="mb-2 text-base font-semibold text-white">
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
