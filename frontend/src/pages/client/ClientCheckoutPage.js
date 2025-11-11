import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Form, Button, Container, Row, Col, ListGroup, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const locationIQKey = process.env.REACT_APP_LOCATIONIQ_API_KEY;

const CheckoutPage = () => {
    const { cart, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [isLocating, setIsLocating] = useState(false);
    const [checkoutData, setCheckoutData] = useState({
        name: '',
        address: '',
        contact: '',
        latitude: null,
        longitude: null, 
        payment_method: 'Cash on Delivery',
    });

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setCheckoutData({ ...checkoutData, [name]: value });

        if (name === 'address' && value.length > 2) {
            try {
                const res = await axios.get(
                    `https://api.locationiq.com/v1/autocomplete.php`,
                    {
                        params: {
                            key: locationIQKey,
                            q: value,
                            limit: 5,
                            countrycodes: 'ph',
                            normalizecity: 1,
                            format: 'json',
                        },
                    }
                );
                setAutocompleteResults(res.data);
            } catch (error) {
                console.error('Autocomplete failed:', error);
            }
        } else {
            setAutocompleteResults([]);
        }
    };

    const handleSuggestionClick = (place) => {
        setCheckoutData({
            ...checkoutData,
            address: place.display_name,
            latitude: place.lat, 
            longitude: place.lon, 
        });
        setAutocompleteResults([]);
    };

    const useMyLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude, longitude } = coords;
                try {
                    const res = await axios.get(
                        `https://us1.locationiq.com/v1/reverse.php`,
                        {
                            params: {
                                key: locationIQKey,
                                lat: latitude,
                                lon: longitude,
                                format: 'json',
                            },
                        }
                    );
                    setCheckoutData({
                        ...checkoutData,
                        address: res.data.display_name,
                        latitude,
                        longitude,
                    });
                } catch (error) {
                    alert('Failed to fetch address.');
                } finally {
                    setIsLocating(false);
                }
            },
            () => {
                alert('Unable to access your location.');
                setIsLocating(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkoutData.name || !checkoutData.address || !checkoutData.contact) {
            alert('Please fill in all required fields.');
            return;
        }

        if (cart.length === 0) {
            alert('Your cart is empty. Add items before proceeding.');
            return;
        }

        const orderData = {
            ...checkoutData,
            items: cart,
            totalAmount: getCartTotal(),
            date: new Date().toISOString(),
            status: 'Pending',
        };

        try {
            const response = await axios.post('http://localhost:5000/api/orders', orderData);
            clearCart();
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            alert('Checkout failed. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <Container className="mt-5">
            <Link to="/cart" className="text-decoration-none mb-3 d-inline-block text-primary btn btn-warning text-white">
                &larr; Back to Shopping Cart
            </Link>
            <Row className="g-0">
                {/* Order Summary */}
                <Col md={6} className="mb-4">
                    <div style={{
                        background: '#001F3F',
                        borderTopLeftRadius: '20px',
                        borderBottomLeftRadius: '20px',
                        borderTopRightRadius: '0',
                        borderBottomRightRadius: '0',
                        padding: '20px',
                        height: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    }}>
                        <h4 className="text-white mb-4">Order Summary</h4>

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
                                cart.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '10px',
                                            marginBottom: '8px',
                                            borderRadius: '8px',
                                            background: 'rgba(255,255,255,0.05)',
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        <span style={{ color: '#fff'}}>{item.quantity}x {item.name}</span>
                                        <span style={{ color: '#d4af37', fontWeight: 600 }}>
                                            ₱{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white">Your cart is empty.</p>
                            )}
                            <style>{`
                                .summary-items-container::-webkit-scrollbar { width: 6px; }
                                .summary-items-container::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); border-radius: 3px; }
                            `}</style>
                        </div>

                        <div className="d-flex justify-content-between mt-4 px-1 text-white fw-bold">
                            <span>Total:</span>
                            <span>₱{getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </Col>

                {/* Shipping Details */}
                <Col md={6}>
                    <div style={{
                        background: '#fff',
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0',
                        borderTopRightRadius: '20px',
                        borderBottomRightRadius: '20px',
                        padding: '25px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        height: '600px',
                        overflowY: 'auto',
                    }}>
                        <h4 className="mb-4">Enter your shipping details</h4>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" required onChange={handleInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-3 position-relative">
                                <Form.Label>Address</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        required
                                        value={checkoutData.address}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={useMyLocation}
                                        disabled={isLocating}
                                        title="Use My Location"
                                    >
                                        📍
                                    </Button>
                                </InputGroup>

                                {autocompleteResults.length > 0 && (
                                    <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 10 }}>
                                        {autocompleteResults.map((result, idx) => (
                                            <ListGroup.Item
                                                key={idx}
                                                action
                                                onClick={() => handleSuggestionClick(result)}
                                            >
                                                {result.display_name}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Contact Number</Form.Label>
                                <Form.Control type="text" name="contact" required onChange={handleInputChange} />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Payment Method</Form.Label>
                                <Form.Control type="text" value="Cash on Delivery" disabled readOnly />
                            </Form.Group>

                            <Button
                                variant="dark"
                                type="submit"
                                className="w-100"
                                style={{ backgroundColor: '#001F3F', border: 'none', padding: '12px' }}
                            >
                                Place Order
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;
