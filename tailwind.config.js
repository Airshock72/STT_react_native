/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#FBFBFB",
        divider: "#E7E7E7",
        primary: "#5A9BF7",
        primaryDark: "#3B82F6",
        primarySoft: "#EAF3FF",
        textMain: "#222222",
        textMuted: "#8F8F8F",
        iconSoft: "#7A7A7A",
        youtube: "#FF2D20",
      },
      boxShadow: {
        floating: "0 10px 28px rgba(90, 155, 247, 0.18)",
      },
    },
  },
  plugins: [],
};
