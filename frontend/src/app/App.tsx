import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div
      className="min-h-screen bg-gray-300 flex justify-center"
      style={{ paddingTop: '0' }}
    >
      <div
        className="w-full bg-white overflow-hidden relative"
        style={{
          maxWidth: '390px',
          minHeight: '100vh',
          boxShadow: '0 0 40px rgba(0,0,0,0.15)',
        }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
