import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            setIsDark(true);
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            setIsDark(false);
            document.documentElement.setAttribute("data-theme", "light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";

        setIsDark(!isDark);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-base-300/80 bg-base-100/85 backdrop-blur-xl">
            <div className="navbar mx-auto flex max-w-7xl items-center px-3 sm:px-4">
                <div className="flex-1">
                    <Link
                        to="/"
                        className="text-2xl font-black tracking-[-0.04em]"
                    >
                        AI<span className="text-primary">Pulse</span><span className="ml-1 text-accent">.</span>
                    </Link>
                </div>

                <div className="flex flex-none items-center">
                    <ul className="flex items-center gap-1 text-xs font-bold sm:gap-2 sm:text-sm">
                        <li>
                            <Link
                                to="/?category=All#news"
                                className="inline-flex items-center rounded-lg border border-transparent px-2 py-2 text-base-content/70 hover:border-primary/20 hover:bg-primary/10 hover:text-primary sm:px-3"
                            >
                                News
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/?category=Models#news"
                                className="inline-flex items-center rounded-lg border border-transparent px-2 py-2 text-base-content/70 hover:border-primary/20 hover:bg-primary/10 hover:text-primary sm:px-3"
                            >
                                Releases
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/?category=Research#news"
                                className="inline-flex items-center rounded-lg border border-transparent px-2 py-2 text-base-content/70 hover:border-primary/20 hover:bg-primary/10 hover:text-primary sm:px-3"
                            >
                                Research
                            </Link>
                        </li>
                    </ul>
                </div>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle ml-2 text-xl"
                    aria-label="Toggle theme"
                >
                    {isDark ? "☀️" : "🌙"}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;