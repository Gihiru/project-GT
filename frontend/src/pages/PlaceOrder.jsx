import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, userId, getProductsData } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name:'Order Payment',
            description:'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response)
                try {
                    
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        
        if (!token) {
            toast.error('Please login to place an order')
            navigate('/login')
            return
        }
        
        try {

            let orderItems = []

            for (const itemId in cartItems) {
                if (cartItems[itemId] > 0) {
                    const itemInfo = products.find(product => product._id === itemId)
                    if (itemInfo) {
                        orderItems.push({
                            _id: itemInfo._id,
                            name: itemInfo.name,
                            price: itemInfo.price,
                            image: itemInfo.image,
                            quantity: cartItems[itemId],
                            category: itemInfo.category
                        })
                    }
                }
            }

            let orderData = {
                // userId will be set by auth middleware from token
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }
            
            console.log("Placing order with data:", orderData);
            

            switch (method) {

                // API Calls for COD
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place',orderData,{headers:{token}})
                    if (response.data.success) {
                        setCartItems({})
                        getProductsData()
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                case 'stripe':
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe',orderData,{headers:{token}})
                    if (responseStripe.data.success) {
                        getProductsData()
                        const {session_url} = responseStripe.data
                        window.location.replace(session_url)
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;

                case 'razorpay':

                    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}})
                    if (responseRazorpay.data.success) {
                        getProductsData()
                        initPay(responseRazorpay.data.order)
                    }

                    break;

                default:
                    break;
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-yellow-600/30'>
            {!token && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-gray-800 p-6 rounded-lg text-center'>
                        <p className='text-gray-100 mb-4'>Please login to place an order</p>
                        <button onClick={() => navigate('/login')} className='bg-yellow-500 text-gray-900 px-6 py-2 rounded hover:bg-yellow-400 transition-colors'>
                            Login
                        </button>
                    </div>
                </div>
            )}
            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-yellow-600 bg-gray-700 text-gray-100 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {/* --------------- Payment Method Selection ------------- */}
                    <div className='flex gap-3 flex-col'>
                        <div onClick={() => setMethod('stripe')} className={`flex items-center gap-3 border p-3 cursor-pointer rounded-lg transition-all duration-300 ${method === 'stripe' ? 'border-yellow-500 bg-yellow-500/10' : 'border-yellow-600/30 bg-gray-800/50 hover:border-yellow-500/50'}`}>
                            <p className={`w-4 h-4 border-2 border-yellow-600 rounded-full flex-shrink-0 ${method === 'stripe' ? 'bg-yellow-400 border-yellow-400' : ''}`}></p>
                            <img className='h-5 flex-shrink-0 payment-logo' src={assets.stripe_logo} alt="Stripe" />
                            <span className='text-gray-300 text-sm font-medium'>Stripe</span>
                        </div>
                        <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-3 border p-3 cursor-pointer rounded-lg transition-all duration-300 ${method === 'razorpay' ? 'border-yellow-500 bg-yellow-500/10' : 'border-yellow-600/30 bg-gray-800/50 hover:border-yellow-500/50'}`}>
                            <p className={`w-4 h-4 border-2 border-yellow-600 rounded-full flex-shrink-0 ${method === 'razorpay' ? 'bg-yellow-400 border-yellow-400' : ''}`}></p>
                            <img className='h-5 flex-shrink-0 payment-logo' src={assets.razorpay_logo} alt="Razorpay" />
                            <span className='text-gray-300 text-sm font-medium'>Razorpay</span>
                        </div>
                        <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border p-3 cursor-pointer rounded-lg transition-all duration-300 ${method === 'cod' ? 'border-yellow-500 bg-yellow-500/10' : 'border-yellow-600/30 bg-gray-800/50 hover:border-yellow-500/50'}`}>
                            <p className={`w-4 h-4 border-2 border-yellow-600 rounded-full flex-shrink-0 ${method === 'cod' ? 'bg-yellow-400 border-yellow-400' : ''}`}></p>
                            <span className='text-gray-300 text-sm font-medium'>CASH ON DELIVERY</span>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-yellow-500 text-gray-900 px-16 py-3 text-sm rounded hover:bg-yellow-400 transition-colors font-semibold'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
