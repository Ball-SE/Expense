import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Calculator from './pages/Calculator';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-background text-on-background">
        <aside className="w-64 bg-surface-lowest text-on-surface p-4 hidden md:block border-r border-surface-low">
          <nav className="flex flex-col space-y-4">
            <h1 className="text-xl font-bold mb-8 text-primary">Taxx Sanctuary</h1>
            <a href="/dashboard" className="hover:bg-surface-low p-2 rounded">Dashboard</a>
            <a href="/income" className="hover:bg-surface-low p-2 rounded">Income Management</a>
            <a href="/expenses" className="hover:bg-surface-low p-2 rounded">Expense Management</a>
            <a href="/calculator" className="hover:bg-surface-low p-2 rounded">Tax Calculator</a>
          </nav>
        </aside>
        
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
