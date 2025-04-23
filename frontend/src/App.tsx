import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/UserContext';
import { SocketProvider } from './contexts/SocketContext';
import { GameProvider } from './contexts/GameContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <SocketProvider>
            <GameProvider>
              <Router>
                <div className="min-h-screen bg-light-gray">
                  <Routes>
                    {/* Routes will be added in the component implementation phase */}
                    <Route path="/" element={<div className="flex items-center justify-center min-h-screen">
                      <div className="card p-8 text-center">
                        <h1 className="text-3xl font-montserrat font-bold text-primary-blue mb-4">
                          Football Guess Who
                        </h1>
                        <p className="text-lg text-dark-gray mb-6">
                          The foundation setup is complete. Components will be implemented in the next phase.
                        </p>
                      </div>
                    </div>} />
                  </Routes>
                </div>
              </Router>
            </GameProvider>
          </SocketProvider>
        </UserProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
