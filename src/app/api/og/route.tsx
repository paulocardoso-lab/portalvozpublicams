import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f0f',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '96px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-4px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span>VOZ</span>
            <span style={{ color: '#c9956c', fontSize: '64px', fontWeight: 300 }}>|</span>
            <span style={{ fontSize: '64px', fontWeight: 400, letterSpacing: '-2px' }}>PÚBLICA MS</span>
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#888888',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            Jornalismo Independente · Mato Grosso do Sul
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
