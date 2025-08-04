import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    qty: '',
    category: '',
    description: ''
  })

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const startEdit = (product) => {
    setEditingProduct(product._id)
    setEditForm({
      name: product.name,
      price: product.price,
      qty: product.qty,
      category: product.category,
      description: product.description || ''
    })
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditForm({ name: '', price: '', qty: '', category: '', description: '' })
  }

  const updateProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/update',
        { id, ...editForm },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Product updated successfully')
        setEditingProduct(null)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to update product')
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Products Management</h2>
        <p className='text-gray-600'>{list.length} products total</p>
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[80px_1fr_120px_80px_100px_150px] items-center py-3 px-4 bg-gray-50 border-b font-medium text-gray-700'>
          <span>Image</span>
          <span>Product Details</span>
          <span>Category</span>
          <span>Stock</span>
          <span>Price</span>
          <span className='text-center'>Actions</span>
        </div>

        {/* Product List */}
        <div className='divide-y divide-gray-200'>
          {list.map((item, index) => (
            <div key={index} className='p-4'>
              {editingProduct === item._id ? (
                // Edit Mode
                <div className='grid grid-cols-1 md:grid-cols-[80px_1fr_120px_80px_100px_150px] gap-4 items-center'>
                  <img className='w-16 h-16 object-cover rounded' src={item.image[0]} alt="" />
                  
                  <div className='space-y-2'>
                    <input
                      type='text'
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className='w-full p-2 border rounded text-sm'
                      placeholder='Product name'
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className='w-full p-2 border rounded text-xs'
                      rows='2'
                      placeholder='Description'
                    />
                  </div>
                  
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className='p-2 border rounded text-sm'
                  >
                    <option value='wiring&cables'>Wiring & Cables</option>
                    <option value='cableProtection'>Cable Protection</option>
                    <option value='switchgear&panels'>Switchgear & Panels</option>
                    <option value='lightningSolutions'>Lighting Solutions</option>
                    <option value='tools&safetyGear'>Tools & Safety Gear</option>
                    <option value='energyManagement'>Energy Management</option>
                    <option value='industrialComponents'>Industrial Components</option>
                    <option value='accessories'>Accessories</option>
                  </select>
                  
                  <input
                    type='number'
                    value={editForm.qty}
                    onChange={(e) => setEditForm({...editForm, qty: e.target.value})}
                    className='p-2 border rounded text-sm w-full'
                    min='0'
                  />
                  
                  <input
                    type='number'
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className='p-2 border rounded text-sm w-full'
                    min='0'
                  />
                  
                  <div className='flex gap-2'>
                    <button
                      onClick={() => updateProduct(item._id)}
                      className='bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600'
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className='bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className='grid grid-cols-1 md:grid-cols-[80px_1fr_120px_80px_100px_150px] gap-4 items-center'>
                  <img className='w-16 h-16 object-cover rounded' src={item.image[0]} alt="" />
                  
                  <div>
                    <h3 className='font-medium text-gray-900'>{item.name}</h3>
                    <p className='text-sm text-gray-500 mt-1 line-clamp-2'>{item.description}</p>
                    <p className='text-xs text-gray-400 mt-1'>ID: {item._id}</p>
                  </div>
                  
                  <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
                    {item.category}
                  </span>
                  
                  <div className='text-center'>
                    <span className={`font-medium ${
                      item.qty === 0 ? 'text-red-600' : 
                      item.qty < 10 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {item.qty}
                    </span>
                    <p className='text-xs text-gray-500'>
                      {item.qty === 0 ? 'Out of stock' : 
                       item.qty < 10 ? 'Low stock' : 'In stock'}
                    </p>
                  </div>
                  
                  <div className='font-medium text-gray-900'>
                    {currency}{item.price}
                  </div>
                  
                  <div className='flex gap-2 justify-center'>
                    <button
                      onClick={() => startEdit(item)}
                      className='bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className='bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {list.length === 0 && (
          <div className='text-center py-12 text-gray-500'>
            No products found
          </div>
        )}
      </div>
    </div>
  )
}

export default List