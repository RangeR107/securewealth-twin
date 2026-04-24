import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#c8c8c8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Phone frame */}
      <div style={{
        width: '390px',
        height: '812px',
        background: '#ffffff',
        borderRadius: '46px',
        border: '10px solid #1c1c1e',
        boxShadow: '0 0 0 1px #3a3a3c, inset 0 0 0 1px #3a3a3c, 0 30px 80px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>

        {/* Status bar */}
        <div style={{
          height: '44px',
          background: '#1A6B3C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 150,
        }}>
          {/* Time */}
          <span style={{ color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: 'Arial' }}>
            9:41
          </span>

          {/* Notch cutout in center */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120px',
            height: '28px',
            background: '#1c1c1e',
            borderRadius: '0 0 20px 20px',
          }} />

          {/* Battery only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Battery icon */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '22px',
                height: '11px',
                border: '1.5px solid rgba(255,255,255,0.8)',
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  left: '1px',
                  top: '1px',
                  bottom: '1px',
                  width: '70%',
                  background: 'white',
                  borderRadius: '1.5px',
                }} />
              </div>
              {/* Battery nub */}
              <div style={{
                width: '2px',
                height: '5px',
                background: 'rgba(255,255,255,0.6)',
                borderRadius: '0 1px 1px 0',
                marginLeft: '1px',
              }} />
            </div>
          </div>
        </div>

        {/* App content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}
