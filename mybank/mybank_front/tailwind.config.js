/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f5f9ff',   // fond très clair
                    100: '#e6f0ff',
                    200: '#b8d1ff',
                    300: '#8bb2ff',
                    400: '#5c93ff',
                    500: '#2e74ff',   // couleur principale
                    600: '#1f5ad6',
                    700: '#1440a3',
                    800: '#0a276f',
                    900: '#041641',
                },
                secondary: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',   // couleur secondaire
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                danger: {
                    50: '#fff5f5',
                    100: '#ffe3e3',
                    200: '#ffc1c1',
                    300: '#ff9e9e',
                    400: '#ff7b7b',
                    500: '#ff5757',   // accent rouge pour erreurs / alertes
                    600: '#db3e3e',
                    700: '#b22424',
                    800: '#871a1a',
                    900: '#5a1010',
                },
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',   // vert pour succès
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
            },
            borderRadius: {
                'xl': '1rem',      // arrondi plus moderne pour cartes et modales
            },
            boxShadow: {
                'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
                'modal': '0 10px 25px rgba(0, 0, 0, 0.15)',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
}
