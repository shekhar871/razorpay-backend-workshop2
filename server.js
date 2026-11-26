const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

app.get('/api/getkey', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// create order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount) * 100, // converting to paise
      currency: "INR",
      receipt: "receipt#" + Math.floor(Math.random() * 10000)
    };
    const order = await instance.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// verify payment signature
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    console.log("payment successfull:", razorpay_payment_id);
    return res.json({ success: true, message: "payment verified successfully" });
  } else {
    return res.status(400).json({ success: false, message: "invalid signature" });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
