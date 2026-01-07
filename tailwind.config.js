/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#002955",
        secondary: "#f4ebde",
        success: "#93C565",
        info: "#65AEC5",
        danger: "#C56567",
        warning: "#C5A565",
        gray: "#A9A9A9",
        "dark-gray": "#333333",
      },
    },
  },
  plugins: [],
};
