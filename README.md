# 💎 Alurea – Fine Jewelry Online Store

Alurea is a full-stack **MERN (MongoDB, Express, React, Node.js)** eCommerce platform designed to showcase and deliver elegant fine jewelry pieces.  
Unlike multi-vendor marketplaces, **Alurea** operates as a **single-vendor store** — meaning the company itself manages all listings, inventory, and deliveries.

The platform supports three user roles: **Client**, **Admin**, and **Rider**, each with tailored features to ensure a seamless and efficient shopping experience.

---

## 🚀 Features

### 👩‍💻 Clients
- Browse curated collections of fine jewelry with detailed specifications and high-resolution images.  
- Add items to cart and proceed to order confirmation (no online payment — handled externally).  
- Track orders in real time via an integrated live map.  
- Secure login and registration using JWT-based authentication.

### 🛠️ Admin
- Manage products (Create, Read, Update, Delete).  
- View all users and assign roles (Client, Admin, Rider).  
- Monitor product updates and user activities.

### 🚚 Rider
- View assigned deliveries.  
- Update delivery and order status.  
- Send real-time location updates for live order tracking.

---

## 🧰 Tech Stack

- **Frontend:** React, React Router, Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Real-time Updates:** Socket.io  
- **Maps & Routing:** Leaflet + OpenRouteService API + LocationIQ API  
- **Authentication:** Secure JWT-based authentication  
- **Styling:** Bootstrap 5  

---

## 🔧 Setup Instructions

1. **Clone the repository**
- git clone https://github.com/yourusername/dialuxe.git
- cd Alurea
2. **Install dependencies**
- cd backend && npm install
- cd ../frontend && npm install
3. **Configure .env**
- PORT=5000
- MONGO_URI=your_mongo_connection_string
- JWT_SECRET=your_secret_key
4. **Run the app**
- cd backend
- npm start
- cd frontend
- npm start
