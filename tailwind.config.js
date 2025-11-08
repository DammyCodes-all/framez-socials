/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./globals.css",
  ],
  presets: [require("nativewind/preset")],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       custom: ["monofont"],
  //     },
  //   },
  // },
  plugins: [],
  darkMode: "class",
};
