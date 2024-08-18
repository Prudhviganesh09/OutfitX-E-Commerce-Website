import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInfo = async () => {
        try {
            const res = await fetch('http://localhost:4000/allproducts');
            if (!res.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await res.json();
            setAllProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const removeProduct = async (id) => {
        try {
            const res = await fetch('http://localhost:4000/removeproduct', {
                method: 'DELETE',  // Correct method for deletion
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }), // Send the id in the body
            });
            if (!res.ok) {
                throw new Error('Failed to remove product');
            }
            await fetchInfo(); // Refresh the product list after deletion
        } catch (error) {
            console.error("Error removing product:", error);
            alert('Error removing product');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='list-product'>
            <h1>All Products List</h1>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allproducts.map((product, index) => (
                    <div key={index} className="listproduct-format-main listproduct-format">
                        <img src={product.image} alt={product.name} className='listproduct-product-icon' />
                        <p>{product.name}</p>
                        <p>${product.old_price}</p>
                        <p>${product.new_price}</p>
                        <p>{product.category}</p>
                        <img 
                            src={cross_icon} 
                            alt="Remove" 
                            className="listproduct-remove-icon" 
                            onClick={() => removeProduct(product.id)} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListProduct;
