import { useState } from 'react';
import Login from './Login';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleLogin = (admin = true) => {
    setLoggedIn(true);
    setIsAdmin(admin);
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header>
        <h1>📦 Store Prices</h1>
        <button onClick={() => setLoggedIn(false)} className="logout-btn">
          Logout
        </button>
      </header>

      {isAdmin && (
        <AddProduct onProductAdded={() => setRefresh(refresh + 1)} />
      )}

      <ProductList 
        key={refresh} 
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default App;