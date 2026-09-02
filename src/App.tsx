import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar';
import { ProductsPage } from './pages/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
