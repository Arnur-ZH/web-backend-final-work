# Football Manager App with 2FA

This web application is designed to manage football player cards, aggregate news, and visualize financial data. Built using Node.js, MongoDB, and Express, it features robust authentication, including Two-Factor Authentication (2FA).

---

## Features

1. **User Registration and Authentication**:
    - Registration with email and username validation.
    - Password hashing using `bcrypt.js`.
    - Role-based access: `user` and `admin`.
    - Login with optional 2FA.

2. **Two-Factor Authentication (2FA)**:
    - Implemented using `speakeasy` for Time-based One-Time Passwords (TOTP).
    - Users can enable 2FA for added security.

3. **CRUD Operations for Football Cards**:
    - Create, view, update, and delete football cards.
    - Image uploads supported via `multer`.

4. **External API Integration**:
    - Fetch news from **NewsAPI**.
    - Fetch and visualize financial data from **CoinGecko API** using `Chart.js`.

5. **Security Enhancements**:
    - JWT tokens for session management.
    - Password hashing and secure 2FA key storage.

6. **Frontend**:
    - Responsive design built with **Bootstrap**.

---

## Technologies Used

### **Backend**
- **Frameworks**: Node.js, Express.js
- **Database**: MongoDB
- **Key Libraries**:
    - `bcryptjs`: Password hashing
    - `jsonwebtoken`: Token-based authentication
    - `speakeasy`: TOTP for 2FA
    - `multer`: File uploads
    - `nodemailer`: Email notifications

### **Frontend**
- **Technologies**: HTML, CSS, Bootstrap
- **Libraries**: Chart.js for data visualization

---

## Setup and Installation

### **Prerequisites**
1. Install [Node.js](https://nodejs.org/).
2. Set up a MongoDB instance (local or cloud).
3. Get API keys for:
    - [NewsAPI](https://newsapi.org/)
    - [CoinGecko API](https://www.coingecko.com/)

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/your_username/your_repository.git
   cd your_repository
