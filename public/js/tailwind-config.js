window.tailwind = {
    config: {
        darkMode: 'class',
        theme: {
            extend: {
                colors: {
                    gamityDark: 'var(--bg-main)',
                    gamityPurple: 'var(--accent-primary)',
                    gamityGreen: '#10b981',
                    surface: 'var(--bg-card)',
                    surfaceLight: 'var(--bg-input)',
                    messageMe: 'var(--accent-primary)',
                    messageOther: 'var(--bg-input)'
                },
                backgroundImage: {
                    'neon-gradient': 'linear-gradient(135deg, var(--accent-primary) 0%, #10b981 100%)',
                }
            }
        }
    }
};
