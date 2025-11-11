import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ClientOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [proofImage, setProofImage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('ongoing');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders');
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders.');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleShowProof = (image, order) => {
    setProofImage(image);
    setOrderDetails(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProofImage('');
    setOrderDetails(null);
  };

  const theme = {
    gold: '#FFD700',
    navy: '#001F3F',
    light: '#f9f9f9',
    red: '#ff4d4f',
    green: '#28a745',
  };

  const filteredOrders =
    activeTab === 'ongoing'
      ? orders.filter((o) => o.status.toLowerCase() !== 'delivered')
      : orders.filter((o) => o.status.toLowerCase() === 'delivered');

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }} className="container mt-5 pt-5">
      <style>{`
        .orders-header {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: ${theme.navy};
          margin-bottom: 20px;
        }

        .tabs-container {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
        }
        .tab-btn {
          background: transparent;
          border: 2px solid ${theme.gold};
          color: ${theme.gold};
          font-weight: 600;
          padding: 10px 25px;
          border-radius: 8px;
          transition: 0.3s;
        }
        .tab-btn.active,
        .tab-btn:hover {
          background: ${theme.gold};
          color: ${theme.navy};
        }

        /* Grid layout for cards */
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .order-card {
          background: #fff;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        /* Colored border bar */
        .order-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
        }
        .border-pending::before { background: ${theme.red}; }
        .border-delivering::before { background: ${theme.gold}; }
        .border-delivered::before { background: ${theme.green}; }

        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .order-date {
          font-weight: 600;
          color: ${theme.navy};
          font-size: 0.95rem;
        }

        .order-status {
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: capitalize;
          border-radius: 6px;
          padding: 4px 10px;
        }
        .status-pending { background: ${theme.red}; color: #fff; }
        .status-delivering { background: ${theme.gold}; color: ${theme.navy}; }
        .status-delivered { background: ${theme.green}; color: #fff; }

        .order-body {
          margin-top: 5px;
        }
        .order-items {
          list-style: none;
          padding-left: 0;
          margin-bottom: 8px;
          color: #555;
          font-size: 0.9rem;
        }
        .order-items li {
          margin-bottom: 4px;
        }

        .order-total {
          font-weight: 700;
          color: ${theme.navy};
          margin-top: 5px;
        }

        .order-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
        }

        .btn-proof, .btn-track {
          border: 1px solid ${theme.gold};
          background: transparent;
          color: ${theme.gold};
          font-weight: 600;
          border-radius: 8px;
          padding: 7px 14px;
          transition: 0.3s;
        }
        .btn-proof:hover, .btn-track:hover {
          background: ${theme.gold};
          color: ${theme.navy};
        }

        /* Modal Styling */
        .modal-header {
          background: ${theme.navy};
          color: ${theme.gold};
          border-bottom: none;
        }
        .modal-body img {
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
      `}</style>

      <h3 className="orders-header">My Orders</h3>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          Ongoing Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Order History
        </button>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger py-5">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-5 text-muted">No orders found.</div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => {
            const statusClass = `border-${order.status.toLowerCase()}`;
            return (
              <div key={order._id} className={`order-card ${statusClass}`}>
                <div>
                  <div className="order-header">
                    <span className="order-date">
                      {new Date(order.date).toLocaleString()}
                    </span>
                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-body">
                    <ul className="order-items">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                    <div className="order-total">
                      ₱{order.totalAmount.toLocaleString('en-PH', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  {order.status.toLowerCase() === 'delivered' && order.proofPhoto ? (
                    <Button
                      className="btn-proof"
                      size="sm"
                      onClick={() => handleShowProof(order.proofPhoto, order)}
                    >
                      View Proof
                    </Button>
                  ) : ['pending', 'delivering'].includes(order.status.toLowerCase()) ? (
                    <Link to={`/track-order/${order._id}`}>
                      <Button className="btn-track" size="sm">
                        Track
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proof Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Proof of Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6} className="text-center">
              <img
                src={`http://localhost:5000/uploads/proofs/${proofImage}`}
                alt="Proof of Delivery"
                className="img-fluid"
              />
            </Col>
            <Col md={6}>
              {orderDetails && (
                <>
                  <h5 style={{ color: theme.navy, fontWeight: 700 }}>Order Details</h5>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li><strong>Date:</strong> {new Date(orderDetails.date).toLocaleString()}</li>
                    <li><strong>Total:</strong> ₱{orderDetails.totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</li>
                    <li><strong>Status:</strong> {orderDetails.status}</li>
                  </ul>
                  <h6 style={{ color: theme.navy, marginTop: '10px' }}>Items</h6>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {orderDetails.items.map((item, idx) => (
                      <li key={idx}>{item.name} × {item.quantity}</li>
                    ))}
                  </ul>
                </>
              )}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClientOrdersPage;
