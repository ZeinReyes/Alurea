import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaSearch, FaEye } from 'react-icons/fa';
import './ClientProductPage.css';

const ClientProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');   
    const [typeFilter, setTypeFilter] = useState([]);
    const [materialFilter, setMaterialFilter] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [visibleCount, setVisibleCount] = useState(9); // ⬅️ show 9 initially
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                const inStockProducts = res.data.filter(p => p.stock > 0);
                setProducts(inStockProducts);
                setFiltered(inStockProducts);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let data = [...products];

        if (search) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        if (typeFilter.length > 0) data = data.filter(p => typeFilter.includes(p.type));
        if (materialFilter.length > 0) data = data.filter(p => materialFilter.includes(p.material));
        data = data.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        setFiltered(data);
        setVisibleCount(9); // ⬅️ reset to 9 when filters/search change
    }, [search, typeFilter, materialFilter, priceRange, products]);

    const handleAddToCart = (product) => addToCart(product);

    const handleCheckboxChange = (value, setFunc, current) => {
        if (current.includes(value)) {
            setFunc(current.filter(i => i !== value));
        } else {
            setFunc([...current, value]);
        }
    };

    const loadMore = () => setVisibleCount(prev => prev + 9); // ⬅️ load 9 more

    return (
        <div className="client-store-container">
            <Row>
                <Col md={3}>
                    <div className="filter-wrapper">
                        <div className="filter-search-box">
                            <FaSearch className="filter-search-icon" />
                            <Form.Control
                                placeholder="Search Products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="filter-search-input"
                            />
                        </div>

                        <h5 className="filter-label-title">Filters</h5>
                        <div className="filter-section">
                            <p className="filter-section-title">Type</p>
                            {["Necklace", "Ring", "Bracelet", "Earrings", "Set"].map(t => (
                                <label key={t} className="filter-option">
                                    <input
                                        type="checkbox"
                                        value={t}
                                        checked={typeFilter.includes(t)}
                                        onChange={() => handleCheckboxChange(t, setTypeFilter, typeFilter)}
                                    />
                                    {t}
                                </label>
                            ))}
                        </div>

                        <div className="filter-section">
                            <p className="filter-section-title">Materials</p>
                            {["Gold", "Silver", "Platinum", "Rose Gold", "White Gold", "Titanium"].map(m => (
                                <label key={m} className="filter-option">
                                    <input
                                        type="checkbox"
                                        value={m}
                                        checked={materialFilter.includes(m)}
                                        onChange={() => handleCheckboxChange(m, setMaterialFilter, materialFilter)}
                                    />
                                    {m}
                                </label>
                            ))}
                        </div>

                        <div className="price-range">
                            <p className="filter-section-title">
                                Price Range: ₱{priceRange[0].toLocaleString()} - ₱{priceRange[1].toLocaleString()}
                            </p>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="500"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            />
                        </div>
                    </div>
                </Col>

                <Col md={9}>
                    <Row>
                        {filtered.slice(0, visibleCount).map(product => (
                            <Col md={6} lg={4} className="mb-4" key={product._id}>
                                <Card className="product-card">
                                    <div className="product-image-container">
                                        <Card.Img
                                            src={product.image || 'https://via.placeholder.com/300'}
                                            className="product-image"
                                        />
                                    </div>

                                    <Card.Body className="product-body">
                                        <Card.Title className="product-name">{product.name}</Card.Title>
                                        <Card.Text className="product-type-material">
                                            {product.type} | {product.material}
                                        </Card.Text>
                                        <Card.Text className="product-price">
                                            ₱{product.price.toLocaleString()}
                                        </Card.Text>
                                        <Card.Text className="product-stock">
                                            Stock: {product.stock}
                                        </Card.Text>
                                    </Card.Body>

                                    <div className="product-buttons">
                                        <Button className="btn-view-icon" onClick={() => navigate(`/product/${product._id}`)}>
                                            <FaEye />
                                        </Button>
                                        <Button className="btn-cart-full" onClick={() => handleAddToCart(product)}>
                                            ADD TO CART
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {visibleCount < filtered.length && (
                        <div className="text-center mt-4">
                            <Button variant="secondary" onClick={loadMore}>
                                Load More
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ClientProductPage;