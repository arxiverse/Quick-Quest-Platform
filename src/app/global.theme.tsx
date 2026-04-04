import React, { useEffect, useState } from "react";

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

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        themeAttribute();
        const newTheme = document.documentElement.getAttribute("data-theme");
        setTheme(newTheme);
    };

    return (
        <label className="flex cursor-pointer gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path
                    d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input
                type="checkbox"
                className="toggle theme-controller"
                checked={theme === "Neiravoid"}
                onChange={handleThemeChange}
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </label>
    );
}

export { SwitchTheme };