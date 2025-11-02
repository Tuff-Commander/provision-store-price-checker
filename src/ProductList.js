import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import EditProduct from './EditProduct';

function ProductList({ isAdmin }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // name, price-low, price-high, recent

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(items);
      setLoading(false);
    } catch (error) {
      alert('Error loading products: ' + error.message);
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteDoc(doc(db, 'products', id));
      loadProducts();
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleUpdateComplete = () => {
    setEditingProduct(null);
    loadProducts();
  };

  // Filter by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'recent':
        const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      default:
        return 0;
    }
  });

  if (loading) return <div className="loading">Loading products...</div>;

  // If editing, show edit form instead of list
  if (editingProduct) {
    return (
      <EditProduct 
        product={editingProduct}
        onCancel={handleCancelEdit}
        onUpdate={handleUpdateComplete}
      />
    );
  }

  return (
    <div className="product-list">
      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <div className="sort-controls">
        <label>Sort by:</label>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
          <option value="recent">Recently Updated</option>
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <p style={{textAlign: 'center', color: '#999', padding: '40px 20px'}}>
          {products.length === 0 ? 'No products yet. Add some!' : 'No products found'}
        </p>
      ) : (
        <div className="products">
          {sortedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">₦{product.price.toLocaleString()}</p>
              </div>
              {isAdmin && (
                <div className="button-group">
                  <button 
                    onClick={() => handleEdit(product)} 
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)} 
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="product-count">
        {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default ProductList;