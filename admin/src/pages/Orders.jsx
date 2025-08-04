import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }


  }

  const statusHandler = async ( event, orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  const deleteHandler = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }
    try {
      const response = await axios.post(backendUrl + '/api/order/delete', {orderId}, { headers: {token}})
      if (response.data.success) {
        toast.success('Order deleted successfully')
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete order')
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div className='p-4'>
      <h3 className='text-2xl font-bold mb-6'>Order Management</h3>
      <div className='space-y-4'>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_0.5fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div className='mb-3'>
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className='flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0'>
                      <img 
                        className='w-12 h-12 object-cover rounded' 
                        src={Array.isArray(item.image) ? item.image[0] : item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = assets.parcel_icon;
                        }}
                      />
                      <div className='flex-1'>
                        <p className='font-medium'>{item.name}</p>
                        <p className='text-gray-500'>Qty: {item.quantity} | Price: {currency}{item.price}</p>
                        {item.category && <p className='text-xs text-gray-400'>Category: {item.category}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px] font-medium'>Order Summary</p>
                <p className='mt-2'>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p className={`${order.payment ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  Payment: {order.payment ? 'Done' : 'Pending'}
                </p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p className='text-xs text-gray-500 mt-1'>ID: {order._id}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <div className='flex flex-col gap-2'>
                <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button 
                  onClick={() => deleteHandler(order._id)}
                  className='bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        }
      </div>
      {orders.length === 0 && (
        <div className='text-center py-8 text-gray-500'>
          No orders found
        </div>
      )}
    </div>
  )
}

export default Orders