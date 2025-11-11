import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { FaStar } from 'react-icons/fa';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const theme = {
    gold: '#FFD700',
    navy: '#001F3F',
    light: '#f9f9f9',
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}/reviews`);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, { rating, comment });
      setReviews((prevReviews) => [...prevReviews, { rating, comment }]);
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review', error);
    }
  };

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <p>Loading product details...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .back-btn {
          color: ${theme.navy};
          font-weight: 600;
          text-decoration: none;
          transition: 0.3s;
        }
        .back-btn:hover {
          color: ${theme.gold};
        }

        .product-card {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: row;
          background: #fff;
        }

        @media (max-width: 768px) {
          .product-card {
            flex-direction: column;
          }
        }

        .product-image-section {
          flex: 1;
          background: ${theme.navy};
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        .product-image-section img {
          border-radius: 10px;
          max-height: 420px;
          object-fit: contain;
        }

        .product-info {
          flex: 1;
          padding: 40px 35px;
        }
        .product-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: ${theme.navy};
        }
        .product-description {
          color: #555;
          margin-top: 10px;
          line-height: 1.6;
        }
        .product-detail {
          color: #444;
          margin-top: 8px;
          font-size: 0.95rem;
        }
        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${theme.gold};
          margin-top: 20px;
        }

        .btn-add {
          background: ${theme.gold};
          color: ${theme.navy};
          font-weight: 600;
          border: none;
          padding: 12px 25px;
          border-radius: 10px;
          margin-top: 25px;
          transition: 0.3s;
        }
        .btn-add:hover {
          background: #d4af37;
          color: #fff;
        }

        /* Review Section */
        .review-section {
          margin-top: 60px;
          background: ${theme.light};
          padding: 30px;
          border-radius: 15px;
        }
        .review-title {
          color: ${theme.navy};
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 20px;
        }
        .review-card {
          background: #fff;
          border-radius: 10px;
          padding: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          margin-bottom: 15px;
        }
        .review-rating {
          color: ${theme.gold};
          margin-bottom: 5px;
        }
      `}</style>

      {/* Back Button */}
      <div className="mb-4">
        <Button variant="link" onClick={() => navigate(-1)} className="back-btn ps-0">
          ← Back to Shopping
        </Button>
      </div>

      {/* Product Card */}
      <Card className="product-card">
        <div className="product-image-section">
          <img
            src={product.image || 'https://via.placeholder.com/600x600'}
            alt={product.name}
            className="img-fluid"
          />
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-description">
            {product.description || 'No description available for this product.'}
          </p>
          <p className="product-detail"><strong>Brand:</strong> {product.brand}</p>
          <p className="product-detail"><strong>Material:</strong> {product.material}</p>
          <p className="product-detail"><strong>Stock:</strong> {product.stock}</p>
          <p className="product-price">₱{product.price.toLocaleString()}</p>

          <Button className="btn-add" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </Card>

      {/* Review Section */}
      <div className="review-section">
        <h4 className="review-title">Customer Reviews</h4>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-rating">
                {[...Array(r.rating)].map((_, idx) => (
                  <FaStar key={idx} />
                ))}
              </div>
              <p className="mb-0">{r.comment}</p>
            </div>
          ))
        )}

        {/* Review Form */}
        <Form onSubmit={handleSubmitReview} className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label><strong>Rating:</strong></Form.Label>
            <Form.Select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><strong>Comment:</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
            />
          </Form.Group>
          <Button type="submit" className="btn-add">
            Submit Review
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ProductDetailsPage;
