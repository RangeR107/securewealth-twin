import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Fixed phone frame - 390x812 is standard iPhone size */}
      <div style={{
        width: '390px',
        height: '812px',
        background: '#ffffff',
        borderRadius: '50px',
        boxShadow: '0 0 0 11px #1a1a1a, 0 0 0 14px #3d3d3d, 0 30px 80px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '126px',
          height: '32px',
          background: '#1a1a1a',
          borderRadius: '0 0 24px 24px',
          zIndex: 200,
        }} />

        {/* Router fills phone exactly */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingTop: '0px',
        }}>
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}
