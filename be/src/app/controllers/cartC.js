const { source } = require('../../config/cloud/clConfig');
const userM = require('../models/userM'); 

class cartC {
    async getUserCart(req, res) {
        try {
            
            const {userId} = req.body;

            const userData = await userM.findById(userId);
            let cartData = await userData.cartData;

            res.json({success: true, cartData});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});    
        }

    }

    async addToCart(req, res) {
        try {
            
            const {userId, itemId, size} = req.body;
            
            const userData = await userM.findById(userId);
            let cartData = await userData.cartData;

            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
                }
                else {
                    cartData[itemId][size] = 1;
                }
            } else{
                cartData[itemId] = {};
                cartData[itemId][size] = 1;
            }

            await userM.findByIdAndUpdate(userId, {cartData: cartData});

            res.json({success: true, message: "Add to cart successfully"});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }

    async updateCart(req, res) {
        try {
            
            const { userId, itemId, size, quantity } = req.body;
            
            const userData = await userM.findById(userId);
            let cartData = await userData.cartData;

            cartData[itemId][size] = quantity;

            await userM.findByIdAndUpdate(userId, {cartData: cartData});

            res.json({success: true, message: "Update cart successfully"});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }

    async deleteFromCart(req, res) {
        try {
            
            const { userId, itemId, size } = req.body;
            
            const userData = await userM.findById(userId);
            let cartData = await userData.cartData;

            delete cartData[itemId][size];

            await userM.findByIdAndUpdate(userId, {cartData: cartData});

            res.json({success: true, message: "Delete from cart successfully"});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }   
}

module.exports = new cartC();




