function Hero() {
  return (
    <section className="border-b border-base-300 bg-base-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-sm font-medium sm:px-4 sm:py-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            Updated daily
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            The AI world,
            <br />
            <span className="text-primary">at a glance.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-base-content/70 sm:mt-6 sm:text-lg sm:leading-8">
            Stay up to date with the latest AI news, model releases,
            product launches, developer tools, and research.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;