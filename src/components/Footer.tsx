function Footer() {
  return (
    <footer className="mt-20 border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:px-6 sm:py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-center text-base-content/50 md:text-left">
          © 2026 AI Pulse. Built with React & TypeScript.
        </p>

        <p className="text-center font-medium text-base-content/60 md:text-right">
          Stay curious. Stay updated. <span className="text-accent" aria-hidden="true">●</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
