import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Aureon One - Illuminate Your Marketing';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 64,
                    background: '#0A0A0A',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Orbit Logo */}
                <div style={{ display: 'flex', marginBottom: 40 }}>
                    <svg width="200" height="200" viewBox="0 0 512 512" fill="none">
                        <defs>
                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#F1C40F" />
                                <stop offset="100%" stopColor="#D4AC0D" />
                            </linearGradient>
                        </defs>
                        <circle cx="256" cy="256" r="200" stroke="url(#goldGradient)" strokeWidth="12" strokeOpacity="0.8" />
                        <circle cx="256" cy="256" r="140" stroke="url(#goldGradient)" strokeWidth="8" strokeOpacity="0.5" />
                        <circle cx="256" cy="256" r="60" fill="url(#goldGradient)" />
                        <circle cx="256" cy="65" r="15" fill="#F1C40F" />
                        <circle cx="435" cy="200" r="12" fill="#F1C40F" fillOpacity="0.8" />
                    </svg>
                </div>

                {/* Text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'white', fontWeight: 700, letterSpacing: '0.05em' }}>AUREON</span>
                    <span style={{ color: '#F1C40F', fontWeight: 400, letterSpacing: '0.05em' }}>ONE</span>
                </div>

                <div style={{ fontSize: 32, color: '#888888', marginTop: 20 }}>
                    Illuminate Your Marketing
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
