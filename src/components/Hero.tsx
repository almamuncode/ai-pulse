function Hero() {
  return (
    <section className="hero-shell border-b border-base-300">
      <div className="hero-content mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary sm:px-4 sm:py-2">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_rgb(6_182_212_/_0.12)]" />
            Updated daily
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            The AI world,
            <br />
            <span className="text-primary">at a glance.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-base-content/65 sm:text-lg sm:leading-8">
            Stay up to date with the latest AI news, model releases,
            product launches, developer tools, and research.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;