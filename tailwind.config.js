/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class', // Enable class-based dark mode
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				bg: {
					primary: 'hsl(var(--background))',
					secondary: 'hsl(var(--muted))',
					tertiary: 'hsl(var(--card))',
					elevated: 'hsl(var(--popover))',
					hover: 'hsl(var(--secondary))'
				},
				'bg-light': {
					primary: '#FFFFFF',
					secondary: '#F3F4F6',
					tertiary: '#E5E7EB',
					elevated: '#F9FAFB',
					hover: '#F3F4F6'
				},
				text: {
					primary: 'hsl(var(--foreground))',
					secondary: 'hsl(var(--muted-foreground))',
					tertiary: 'hsl(var(--muted-foreground))',
					disabled: 'hsl(var(--muted-foreground))',
					inverse: 'hsl(var(--background))'
				},
				'text-light': {
					primary: '#1F2937',
					secondary: '#4B5563',
					tertiary: '#9CA3AF',
					disabled: '#D1D5DB',
					inverse: '#FFFFFF'
				},
				accent: {
					primary: 'hsl(var(--primary))',
					secondary: 'hsl(var(--secondary))',
					highlight: '#3B82F6',
					success: '#10B981',
					warning: '#F59E0B', // Keeping warning as functional color
					error: '#EF4444',
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				'border-primary': 'hsl(var(--border))',
				'border-secondary': 'hsl(var(--input))',
				'border-focus': 'hsl(var(--ring))',
				'border-hover': 'hsl(var(--ring))',
				'border-light-primary': '#E5E7EB',
				'border-light-secondary': '#D1D5DB',
				'border-light-focus': '#3B82F6',
				'border-light-hover': '#9CA3AF',
				neutral: {
					'0': '#000000',
					'50': '#0A0A0A',
					'100': '#1A1A1A',
					'200': '#2A2A2A',
					'300': '#3A3A3A',
					'400': '#4A4A4A',
					'500': '#707070',
					'600': '#A0A0A0',
					'700': '#C0C0C0',
					'800': '#E0E0E0',
					'900': '#FFFFFF'
				},
				primary: {
					'50': '#FFFFFF',
					'100': '#F5F5F5',
					'200': '#E0E0E0',
					'300': '#C0C0C0',
					'400': '#A0A0A0',
					'500': '#FFFFFF',
					'600': '#E0E0E0',
					'700': '#C0C0C0',
					'800': '#A0A0A0',
					'900': '#707070',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					'50': '#2A2A2A',
					'100': '#252525',
					'200': '#222222',
					'300': '#1F1F1F',
					'400': '#1A1A1A',
					'500': '#1A1A1A',
					'600': '#151515',
					'700': '#111111',
					'800': '#0D0D0D',
					'900': '#0A0A0A',
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				success: {
					DEFAULT: '#10B981',
					light: 'rgba(16, 185, 129, 0.1)',
					dark: '#059669'
				},
				warning: {
					DEFAULT: '#F59E0B',
					light: 'rgba(245, 158, 11, 0.1)',
					dark: '#D97706'
				},
				error: {
					DEFAULT: '#EF4444',
					light: 'rgba(239, 68, 68, 0.1)',
					dark: '#DC2626'
				},
				info: {
					DEFAULT: '#3B82F6',
					light: 'rgba(59, 130, 246, 0.1)',
					dark: '#2563EB'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				none: '0',
				sm: 'calc(var(--radius) - 4px)',
				DEFAULT: '0.5rem',
				md: 'calc(var(--radius) - 2px)',
				lg: 'var(--radius)',
				xl: '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
				full: '9999px',
				pill: '9999px'
			},
			fontFamily: {
				sans: [
					'var(--font-inter)',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				],
				display: [
					'var(--font-inter)',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				],
				mono: [
					'SF Mono',
					'Monaco',
					'Inconsolata',
					'Fira Code',
					'Courier New',
					'monospace'
				]
			},
			fontSize: {
				xs: '0.75rem',
				sm: '0.875rem',
				base: '1rem',
				lg: '1.125rem',
				xl: '1.25rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
				'4xl': '2.5rem',
				'5xl': '3.5rem',
				'6xl': '4.5rem',
				'7xl': '6rem'
			},
			fontWeight: {
				light: '300',
				normal: '400',
				medium: '500',
				semibold: '600',
				bold: '700'
			},
			lineHeight: {
				none: '1',
				tight: '1.1',
				snug: '1.25',
				normal: '1.5',
				relaxed: '1.75',
				loose: '2'
			},
			letterSpacing: {
				tighter: '-0.02em',
				tight: '-0.01em',
				normal: '0',
				wide: '0.01em',
				wider: '0.02em'
			},
			boxShadow: {
				xs: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
				sm: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
				DEFAULT: '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
				md: '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
				lg: '0 8px 16px 0 rgba(0, 0, 0, 0.5)',
				xl: '0 12px 24px 0 rgba(0, 0, 0, 0.5)',
				'2xl': '0 24px 48px 0 rgba(0, 0, 0, 0.6)',
				'glow-sm': '0 0 10px rgba(255, 255, 255, 0.1)',
				'glow-md': '0 0 20px rgba(255, 255, 255, 0.15)',
				'glow-lg': '0 0 30px rgba(255, 255, 255, 0.2)',
				none: 'none'
			},
			transitionDuration: {
				instant: '100ms',
				fast: '200ms',
				DEFAULT: '300ms',
				slow: '400ms',
				slower: '600ms'
			},
			transitionTimingFunction: {
				linear: 'linear',
				in: 'cubic-bezier(0.4, 0, 1, 1)',
				out: 'cubic-bezier(0, 0, 0.2, 1)',
				'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
				smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'fade-in-up': 'fadeInUp 0.6s ease-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'scale-in': 'scaleIn 0.4s ease-out',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				float: 'float 6s ease-in-out infinite',
				'spin-slow': 'spin 8s linear infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				fadeInUp: {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				slideUp: {
					'0%': {
						transform: 'translateY(10px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				scaleIn: {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				}
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require("tailwindcss-animate")
	],
};
