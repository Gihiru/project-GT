import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";

// global variables
const currency = "inr";
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Check product availability and update quantities
    const orderItems = [];
    for (const item of items) {
      const product = await productModel.findById(item._id);
      if (!product) {
        return res.json({
          success: false,
          message: `Product ${item.name} not found`,
        });
      }
      if (product.qty < item.quantity) {
        return res.json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${product.qty}, Requested: ${item.quantity}`,
        });
      }
      // Update product quantity
      product.qty -= item.quantity;
      await product.save();
      
      console.log(`Updated ${product.name} quantity: ${product.qty + item.quantity} -> ${product.qty}`);

      // Create complete order item with all necessary product details
      orderItems.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
        category: product.category,
      });
    }

    const orderData = {
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    // Check product availability and prepare order items
    const orderItems = [];
    for (const item of items) {
      const product = await productModel.findById(item._id);
      if (!product) {
        return res.json({
          success: false,
          message: `Product ${item.name} not found`,
        });
      }
      if (product.qty < item.quantity) {
        return res.json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${product.qty}, Requested: ${item.quantity}`,
        });
      }
      orderItems.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
        category: product.category,
      });
    }

    const orderData = {
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      // Get order details to reduce product quantities
      const order = await orderModel.findById(orderId);
      if (order) {
        // Reduce product quantities
        for (const item of order.items) {
          const product = await productModel.findById(item._id);
          if (product) {
            product.qty -= item.quantity;
            await product.save();
            console.log(`Updated ${product.name} quantity: ${product.qty + item.quantity} -> ${product.qty}`);
          }
        }
      }
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Check product availability and prepare order items
    const orderItems = [];
    for (const item of items) {
      const product = await productModel.findById(item._id);
      if (!product) {
        return res.json({
          success: false,
          message: `Product ${item.name} not found`,
        });
      }
      if (product.qty < item.quantity) {
        return res.json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${product.qty}, Requested: ${item.quantity}`,
        });
      }
      orderItems.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
        category: product.category,
      });
    }

    const orderData = {
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      // Get order details to reduce product quantities
      const order = await orderModel.findById(orderInfo.receipt);
      if (order) {
        // Reduce product quantities
        for (const item of order.items) {
          const product = await productModel.findById(item._id);
          if (product) {
            product.qty -= item.quantity;
            await product.save();
            console.log(`Updated ${product.name} quantity: ${product.qty + item.quantity} -> ${product.qty}`);
          }
        }
      }
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data For Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 }); // Sort by date, newest first

    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        orders: [],
        message: "No orders found",
      });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.log("Error in userOrders:", error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// delete order from Admin Panel
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  verifyRazorpay,
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder,
};
