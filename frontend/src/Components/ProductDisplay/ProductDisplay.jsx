import React, { useContext } from 'react';
import './ProductDisplay.css';
import start_icon from "../Assets/star_icon.png";
import start_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    // Fallback image if product image is missing
    const fallbackImage = 'http://localhost:4000/images/default.jpg';

    // Handle case where product might be undefined or missing image
    const imageUrl = product && product.image ? product.image : fallbackImage;

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={imageUrl} alt="Product Thumbnail" />
                    <img src={imageUrl} alt="Product Thumbnail" />
                    <img src={imageUrl} alt="Product Thumbnail" />
                    <img src={imageUrl} alt="Product Thumbnail" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={imageUrl} alt="Main Product" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product ? product.name : 'Product Name'}</h1>
                <div className="productdisplay-right-stars">
                    <img src={start_icon} alt="Star Icon" />
                    <img src={start_icon} alt="Star Icon" />
                    <img src={start_icon} alt="Star Icon" />
                    <img src={start_icon} alt="Star Icon" />
                    <img src={start_dull_icon} alt="Dull Star Icon" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                        ${product ? product.old_price : '0.00'}
                    </div>
                    <div className="productdisplay-right-price-new">
                        ${product ? product.new_price : '0.00'}
                    </div>
                </div>
                <div className="productdisplay-right-description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt laudantium possimus aspernatur unde quisquam placeat voluptatum odit impedit sit odio tenetur eaque dolorem alias illum neque eligendi, suscipit facere id!
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-sizes">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                        <div>XXL</div>
                    </div>
                </div>
                <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
                <p className='productdisplay-right-category'>
                    <span>Category :</span> Women, T-Shirt, Crop Top
                </p>
                <p className='productdisplay-right-category'>
                    <span>Tags :</span> Modern, Latest
                </p>
            </div>
        </div>
    );
}

export default ProductDisplay;
