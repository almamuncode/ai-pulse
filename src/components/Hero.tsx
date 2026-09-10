function Hero() {
  return (
    <section className="border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-4 py-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-success"></span>
            Updated daily
          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            The AI world,
            <br />
            <span className="text-primary">at a glance.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-base-content/70">
            Stay up to date with the latest AI news, model releases,
            product launches, developer tools, and research.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;