export default function Hero() {
  return (
    <section className="pt-24 pb-8 text-center">
      <p className="mb-4 text-sm font-medium tracking-wide text-violet-400 uppercase">
        No Signup • No Upload • 100% Private
      </p>
      <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
        AI-Powered PDF Summaries{" "}
        <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
          Right In Your Browser
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
        Your PDF never leaves your device. Get instant summaries, key points,
        and answers — all processed locally with on-device AI.
      </p>
    </section>
  );
}
