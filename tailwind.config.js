import daisyui from "daisyui"
import {addDynamicIconSelectors} from "@iconify/tailwind"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
    addDynamicIconSelectors()
  ],
}

