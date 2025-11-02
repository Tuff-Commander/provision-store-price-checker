import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

function EditProduct({ product, onCancel, onUpdate }) {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [updating, setUpdating] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!name || !price) {
            alert('Please fill all fields');
            return;
        }

        setUpdating(true);

        try{
            const productRef = doc(db, 'products', product.id);
            await updateDoc(productRef, {
                name: name.trim(),
                price: parseFloat(price),
                updateAt: new Date()
            });

            alert('Product updated!');
            onUpdate();
        } catch (error) {
            alert('Error updating product: ' + error.message);
        }

        setUpdating(false);
    };

    return (
        <form onSubmit={handleUpdate} className="edit-form">
            <h2>Edit Product</h2>
            <input 
            type='text'
            placeholder='Product name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={updating}
            />
            <input
            type='number'
            placeholder="price in Naira"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={updating}
            />
            <div className='button-group'>
                <button type='submit' disabled={updating}>
                    {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="cancel-btn"
                    disabled={updating}
                    >
                        Cancel
                </button>
            </div>
        </form>
    );
}

export default EditProduct;