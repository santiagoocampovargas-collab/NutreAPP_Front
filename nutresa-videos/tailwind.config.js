/** Verde Nutresa: ajusta los hex al manual de marca si tienes el oficial. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nutresa: {
          50: "#EEF8F1", 100: "#D6EEDD", 200: "#A9DDB9", 500: "#00A651",
          600: "#008C45", 700: "#00753A", 900: "#0A3D26", 950: "#06251A",
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
