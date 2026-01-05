import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 512,
    height: 512,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* SVG contents directly embedded for the icon */}
                <svg width="512" height="512" viewBox="0 0 512 512" fill="none">
                    <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F1C40F" />
                            <stop offset="100%" stopColor="#D4AC0D" />
                        </linearGradient>
                    </defs>
                    <circle cx="256" cy="256" r="200" stroke="url(#goldGradient)" strokeWidth="24" strokeOpacity="0.8" />
                    <circle cx="256" cy="256" r="140" stroke="url(#goldGradient)" strokeWidth="16" strokeOpacity="0.5" />
                    <circle cx="256" cy="256" r="60" fill="url(#goldGradient)" />
                    <circle cx="256" cy="65" r="24" fill="#F1C40F" />
                    <circle cx="435" cy="200" r="18" fill="#F1C40F" fillOpacity="0.8" />
                    <circle cx="395" cy="395" r="16" fill="#F1C40F" fillOpacity="0.6" />
                    <circle cx="110" cy="350" r="18" fill="#F1C40F" fillOpacity="0.7" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}
