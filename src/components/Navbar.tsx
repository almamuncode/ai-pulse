import { useEffect, useState } from "react";

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
        <nav className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
            <div className="navbar mx-auto max-w-7xl px-4">
                <div className="flex-1">
                    <a className="text-2xl font-black tracking-tight">
                        AI<span className="text-primary">Pulse</span>
                    </a>
                </div>

                <div className="hidden flex-none sm:block">
                    <ul className="menu menu-horizontal gap-1">
                        <li>
                            <a href="#news">News</a>
                        </li>
                        <li>
                            <a href="#releases">Releases</a>
                        </li>
                        <li>
                            <a href="#research">Research</a>
                        </li>
                    </ul>
                </div>

                <button
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