# ASD Workshop 2 - Razorpay Integration

Backend project for ASD Workshop 2 covering Razorpay payment order creation and signature verification.

## Tech Stack
- Node.js
- Express.js
- Razorpay SDK
- Crypto module (for HMAC SHA256 verification)

## Setup instructions
1. Install dependencies:
```bash
npm install
```
2. Create `.env` file from `.env.example` and add your razorpay test key and secret:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
PORT=5000
```
3. Run project:
```bash
npm start
```
Open `http://localhost:5000` in browser to test checkout.

## API Endpoints
- `POST /api/create-order` : Creates order with razorpay
- `POST /api/verify-payment` : Verifies payment callback signature using HMAC SHA256 (`order_id + "|" + payment_id`)
