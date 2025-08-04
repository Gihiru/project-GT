// Test script to verify order creation and display
// This can be run in browser console to test the fixes

const testOrderData = {
  _id: "test123",
  userId: "user123",
  items: [
    {
      _id: "product1",
      name: "Test Product",
      price: 100,
      image: ["test-image.jpg"],
      quantity: 2,
      category: "test"
    }
  ],
  status: "Order Placed",
  payment: false,
  paymentMethod: "COD",
  date: Date.now(),
  address: {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    street: "123 Test St",
    city: "Test City",
    state: "Test State",
    zipcode: "12345",
    country: "Test Country",
    phone: "1234567890"
  }
};

// Test the order processing logic
function testOrderProcessing(order) {
  const allOrdersItem = [];
  
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach((item) => {
      allOrdersItem.push({
        ...item,
        qty: item.quantity, // Map quantity to qty for frontend display
        status: order.status || "Processing",
        payment: order.payment,
        paymentMethod: order.paymentMethod,
        date: order.date,
        orderId: order._id,
        address: order.address,
      });
    });
  }
  
  return allOrdersItem;
}

// Run test
const processedOrder = testOrderProcessing(testOrderData);
console.log("Processed order:", processedOrder);

// Verify required fields
const requiredFields = ['_id', 'name', 'price', 'image', 'qty', 'status', 'payment', 'paymentMethod', 'date', 'orderId'];
const missingFields = requiredFields.filter(field => !processedOrder[0].hasOwnProperty(field));

if (missingFields.length === 0) {
  console.log("✅ All required fields present");
} else {
  console.log("❌ Missing fields:", missingFields);
}