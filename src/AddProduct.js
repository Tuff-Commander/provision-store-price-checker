import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

function AddProduct({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !price) {
      alert('Please fill all fields');
      return;
    }

    setAdding(true);

    try {
      await addDoc(collection(db, 'products'), {
        name: name.trim(),
        price: parseFloat(price),
        createdAt: new Date()
      });

      setName('');
      setPrice('');
      alert('Product added!');
      onProductAdded();
    } catch (error) {
      alert('Error adding product: ' + error.message);
    }

    setAdding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h2>Add New Product</h2>
      <input
        type="text"
        placeholder="Product name (e.g. Indomie)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={adding}
      />
      <input
        type="number"
        placeholder="Price in Naira"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        disabled={adding}
      />
      <button type="submit" disabled={adding}>
        {adding ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}

export default AddProduct;