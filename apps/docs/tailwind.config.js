/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          DEFAULT: 'var(--lg-glass)',
          active: 'var(--lg-glass-active)',
        },
        accent: 'var(--lg-accent)',
        foreground: 'var(--lg-foreground)',
        muted: 'var(--lg-muted)',
      },
    },
  },
  plugins: [],
};
