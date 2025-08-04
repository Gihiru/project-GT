import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, quantity = 1 } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId] += quantity
        } else {
            cartData[itemId] = quantity
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId, itemId, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData || {};

        if (quantity <= 0) {
            delete cartData[itemId]
        } else {
            cartData[itemId] = quantity
        }

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData || {};
        
        // Migration: Convert old size-based format to simple quantity format
        let needsUpdate = false;
        const migratedCartData = {};
        
        for (const itemId in cartData) {
            if (typeof cartData[itemId] === 'object' && cartData[itemId] !== null) {
                // Old format: cartData[itemId][size] = quantity
                let totalQuantity = 0;
                for (const size in cartData[itemId]) {
                    totalQuantity += cartData[itemId][size] || 0;
                }
                if (totalQuantity > 0) {
                    migratedCartData[itemId] = totalQuantity;
                }
                needsUpdate = true;
            } else {
                // New format: cartData[itemId] = quantity
                migratedCartData[itemId] = cartData[itemId];
            }
        }
        
        // Update database if migration was needed
        if (needsUpdate) {
            await userModel.findByIdAndUpdate(userId, { cartData: migratedCartData });
            cartData = migratedCartData;
        }

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart }