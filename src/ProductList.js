import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import EditProduct from './EditProduct';

function ProductList({ isAdmin }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

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
      // Sort alphabetically
      items.sort((a, b) => a.name.localeCompare(b.name));
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
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading products...</div>;

  // if editing, show edit form instead of list
  if (editingProduct) {
    return (
        <EditProduct
        product={editingProduct}
        onCancel={handleCancelEdit}
        onUpdate={handleUpdateComplete}
        />
    )
  }

  return (
    <div className="product-list">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {filteredProducts.length === 0 ? (
        <p style={{textAlign: 'center', color: '#999'}}>
          {products.length === 0 ? 'No products yet. Add some!' : 'No products found'}
        </p>
      ) : (
        <div className="products">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div>
                <h3>{product.name}</h3>
                <p className="price">₦{product.price.toLocaleString()}</p>
              </div>
              {isAdmin && (
                <div className='button-group'>
                    <button
                    onClick={() => handleEdit(product)}
                    className='edit-btn'>
                        Edit
                    </button>
                    <button 
                    onClick={() => deleteProduct(product.id)} 
                    className="delete-btn">
                        Delete
                   </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className='product-count'>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default ProductList;