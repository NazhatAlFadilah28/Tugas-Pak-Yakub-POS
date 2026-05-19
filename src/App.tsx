import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Sales from './pages/Sales';
import Purchase from './pages/Purchase';
import Products from './pages/Products';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
