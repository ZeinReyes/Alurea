import React from 'react';
import Navbar from '../../components/CustomNavbar';
import Footer from '../../components/Footer';
import './ClientDashboard.css';

function ClientDashboard() {
  return (
    <div>
      <Navbar />

      <main className="hero-section">
        <div className="hero-content mt-5">
          <h1>
            Timeless <span className="highlight">Elegance</span>, 
            Crafted Just for You.
          </h1>
          <p>
            Discover the art of fine jewelry with <span className="highlight">Alurea</span> — 
            where every piece tells a story of beauty, brilliance, and craftsmanship.
          </p>
          <div className="hero-buttons">
            <button className="button btn-primary">Shop Now</button>
            <button className="button btn-secondary">View Collections</button>
          </div>
        </div>

        <div className="hero-images">
          <div className="hero-necklace"></div>
          <div className="hero-ring"></div>
        </div>
      </main>

      <section className="features-section">
        <div className="features-header">
          <h2>Experience the Essence of Luxury</h2>
          <p>
            From radiant diamonds to exquisite gold craftsmanship, Alurea delivers
            timeless pieces that celebrate your unique brilliance.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-gem"></i>
            </div>
            <h4>Finest Craftsmanship</h4>
            <p>
              Every design is meticulously handcrafted to perfection, 
              blending artistry with precision.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-heart"></i>
            </div>
            <h4>Ethically Sourced</h4>
            <p>
              Our materials are responsibly and ethically sourced to ensure 
              every sparkle comes with integrity.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-star"></i>
            </div>
            <h4>Custom Creations</h4>
            <p>
              Bring your vision to life with bespoke designs tailored to your story and style.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ClientDashboard;