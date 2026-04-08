import { useEffect, useState } from "react";

function themeAttribute() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "Neiralight" ? "Neiravoid" : "Neiralight";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

function SwitchTheme() {
    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const initialTheme = savedTheme || "Neiravoid";
        document.documentElement.setAttribute("data-theme", initialTheme);
        setTheme(initialTheme);
    }, []);

    const handleThemeChange = () => {
        themeAttribute();
        const newTheme = document.documentElement.getAttribute("data-theme");
        setTheme(newTheme);
    };

    return (
        <label className="inline-flex items-center gap-3 rounded-full border border-base-300/70 bg-base-100/90 px-3 py-2 text-base-content shadow-[0_8px_24px_rgba(17,24,40,0.08)] backdrop-blur-sm">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input
                type="checkbox"
                aria-label="Toggle theme"
                className="toggle toggle-sm border-base-300 bg-base-300 text-[#6600FF] checked:border-[#6600FF] checked:bg-[#6600FF] checked:text-white"
                checked={theme === "Neiravoid"}
                onChange={handleThemeChange}
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z"></path>
            </svg>
        </label>
    );
}

export { SwitchTheme };
