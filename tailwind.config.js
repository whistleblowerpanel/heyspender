/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./app/**/*.{js,jsx,ts,tsx}',
		'./src/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		screens: {
			'xs': '475px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			fontFamily: {
				sans: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				'space-grotesk': ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
			},
			fontSize: {
				// Mobile-optimized font sizes
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				// Mobile-specific sizes
				'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],
				'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'mobile-base': ['1rem', { lineHeight: '1.5rem' }],
				'mobile-lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'mobile-xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'mobile-2xl': ['1.5rem', { lineHeight: '2rem' }],
				'mobile-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
			},
			colors: {
				'black': '#161B47',
				gray: {
					800: '#161B47',
					900: '#161B47',
					950: '#161B47',
				},
				'brand-purple': '#7c3bed',
				'brand-purple-dark': '#7c3bed',
				'brand-purple-light': '#e5d4ff',
				'brand-orange': '#E98144',
				'brand-green': '#86E589',
				'brand-beige': '#F6D9AD',
				'brand-salmon': '#EEA67F',
				'brand-accent-red': '#E94B29',
				'brand-pink-light': '#FFDDFF',
				'brand-cream': '#FDF4E8',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				'flat-left': '-4px 4px 0px #161B47',
				'flat-left-hard': '-8px 8px 0px #161B47',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'blob': {
					'0%': {
						transform: 'translate(0px, 0px) scale(1)',
					},
					'33%': {
						transform: 'translate(30px, -50px) scale(1.1)',
					},
					'66%': {
						transform: 'translate(-20px, 20px) scale(0.9)',
					},
					'100%': {
						transform: 'translate(0px, 0px) scale(1)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'blob': 'blob 7s infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};