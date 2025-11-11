import React from 'react';
import { useCart } from '../../context/CartContext';
import { Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (id, action) => {
        const item = cart.find(i => i._id === id);
        if (!item) return;

        if (action === 'increase') {
            updateQuantity(id, item.quantity + 1);
        } else if (action === 'decrease') {
            if (item.quantity === 1) {
                removeFromCart(id);
            } else {
                updateQuantity(id, item.quantity - 1);
            }
        }
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        navigate('/checkout');
    };

    return (
        <div style={{ paddingBottom: '100px', fontFamily: 'Poppins, sans-serif' }} className="container mt-5 pt-5">
            <style>{`
                .cart-title { font-size: 2rem; font-weight: 700; color: #021f39; }
                .btn-clear { background: transparent; border: 1px solid #ffd700; color: #ffd700; font-weight: 600; transition: 0.3s; }
                .btn-clear:hover { background: #ffd700; color: #fff; }
                .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-radius: 10px; background: #f9f9f9; margin-bottom: 15px; transition: transform 0.2s, box-shadow 0.2s; }
                .cart-item:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
                .cart-item img { width: 90px; height: 90px; object-fit: cover; border-radius: 10px; }
                .item-name { font-weight: 600; color: #021f39; font-size: 1.05rem; }
                .item-price { color: #555; font-size: 0.9rem; margin-bottom: 8px; }
                .quantity-control { display: flex; max-width: 100px; border: 1px solid #ffd700; border-radius: 8px; overflow: hidden; }
                .quantity-control button { border: none; background: #ffd700; color: #fff; width: 32px; font-size: 1.2rem; cursor: pointer; transition: 0.3s; }
                .quantity-control input { border: none; text-align: center; width: 40px; font-weight: 500; }
                .item-total { font-size: 1rem; color: #021f39; font-weight: 700; }

                .order-summary-card { 
                    background: #021f39; 
                    color: white; 
                    padding: 25px; 
                    border-radius: 20px; 
                    position: fixed; 
                    top: 110px; 
                    width: 100%; 
                    max-width: 450px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
                    display: flex; 
                    flex-direction: column;
                    height: 600px; /* fixed height */
                }
                .summary-items-container {
                    overflow-y: auto;
                    flex-grow: 1;
                    margin-bottom: 15px;
                    padding-right: 5px; /* space for scrollbar */
                }
                .summary-items-container::-webkit-scrollbar { width: 6px; }
                .summary-items-container::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); border-radius: 3px; }

                .summary-item { display: flex; justify-content: space-between; padding: 10px 0; border-radius: 8px; transition: background 0.2s; }
                .summary-item:hover { background: rgba(255, 255, 255, 0.05); }
                .summary-item-name { font-weight: 500; }
                .summary-item-price { font-weight: 600; color: #d4af37; }
                .summary-totals { font-size: 0.95rem; display: flex; justify-content: space-between; font-weight: 600; margin-top: 5px; }
                .btn-checkout { background: #ffd700; color: white; font-weight: 600; padding: 14px 0; border-radius: 10px; transition: 0.3s; width: 100%; margin-top: 10px; }
                .btn-checkout:hover { background: #d4af37; color: #021f39; }
            `}</style>

            <Row>
                {/* CART ITEMS */}
                <Col md={8} className="mb-4">
                    <div 
                        style={{
                            background: '#fff', 
                            padding: '20px', 
                            borderRadius: '20px', 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                            marginTop: '20px'
                        }}
                    >
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="cart-title" style={{ color: '#021f39' }}>Shopping Cart</h3>
                            <Button className="btn-clear" onClick={clearCart}>Empty Cart</Button>
                        </div>

                        {/* Cart items */}
                        {cart.length === 0 ? (
                            <p style={{ color: '#777' }}>Your cart is empty.</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={item.image} alt={item.name} />
                                        <div style={{ marginLeft: '1rem' }}>
                                            <h5 className="item-name">{item.name}</h5>
                                            <p className="item-price">₱{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                            <div className="quantity-control">
                                                <button onClick={() => handleQuantityChange(item._id, 'decrease')}>−</button>
                                                <input type="text" value={item.quantity} readOnly />
                                                <button onClick={() => handleQuantityChange(item._id, 'increase')}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="item-total">₱{Number(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            ))
                        )}
                    </div>
                </Col>

                {/* ORDER SUMMARY */}
                <Col md={4}>
                   <Card className="order-summary-card">
                    <Card.Body className="d-flex flex-column h-100 p-3">
                        <Card.Title style={{ fontSize: '1.5rem', marginBottom: '15px',  }}>Order Summary</Card.Title>

                        <div className='divider border-bottom'></div>
                        <div
                        className="summary-items-container"
                        style={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            paddingRight: '5px',
                            marginBottom: '15px',
                        }}
                        >
                        {cart.length > 0 ? (
                            cart.map((item) => (
                            <div
                                key={item._id}
                                className="summary-item"
                                style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '10px',
                                borderRadius: '8px',
                                transition: 'background 0.2s',
                                marginBottom: '5px',
                                }}
                            >
                                <span className="summary-item-name" style={{ fontWeight: 500 }}>{item.quantity}x {item.name}</span>
                                <span className="summary-item-price" style={{ fontWeight: 600, color: '#d4af37' }}>
                                ₱{Number(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            ))
                        ) : (
                            <p style={{ color: '#ccc' }}>No items</p>
                        )}
                        </div>

                        <div className='divider border-top'></div>
                        <div className="summary-totals" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '5px' }}>
                        <span>Total Items:</span>
                        <span>{getCartCount()}</span>
                        </div>
                        <div className="summary-totals" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '10px' }}>
                        <span>Total Amount:</span>
                        <span>₱{Number(getCartTotal()).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>

                        {/* Checkout button */}
                        <button
                        className="btn-checkout"
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        style={{ marginTop: 'auto' }}
                        >
                        Proceed to Checkout
                        </button>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage;
