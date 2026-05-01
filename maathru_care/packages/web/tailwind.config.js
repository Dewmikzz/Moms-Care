/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FFF9F5', // Warm off-white
        },
        brand: {
          primary: '#FFB6C1', // Soft pink
          secondary: '#A8E6CF', // Mint (Calm)
          distressed: '#FF6B6B', // Soft red
          userBubble: '#E8F4FD', // Very light blue
          botBubble: '#F9F9F9', // Light grey
          botBubbleGentle: '#E6F5ED', // Soft mint
          textPrimary: '#2D2D2D',
          textSecondary: '#999999',
        },
        mood: {
          calm: '#A8E6CF', // Green
          mild: '#FFD93D', // Yellow
          distressed: '#FF6B6B', // Red
        }
      },
      borderRadius: {
        '3xl': '1.5rem', // 24px
        '4xl': '2rem',   // 32px
        '5xl': '2.5rem', // 40px
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        sinhala: ['"Noto Sans Sinhala"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 6px rgba(0,0,0,0.05)',
        'float': '0 10px 30px rgba(0,0,0,0.08)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        typingBounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        }
      },
      animation: {
        breathe: 'breathe 2s ease-in-out infinite',
        typingBounce: 'typingBounce 1s infinite',
        pulseRing: 'pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
      },
    },
  },
  plugins: [],
}
