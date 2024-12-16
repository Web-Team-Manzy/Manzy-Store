const userM = require('../models/userM'); 

class cartC {
    async getUserCart(req, res) {
        try {
            
        } catch (error) {
            
        }

    }

    async addToCart(req, res) {
        try {
            
            const {userID, itemId, size} = req.body;

            const userData = await userM.findById(userID);
            let cartData = await userData.cartDate;

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

            await userM.findByIdAndUpdate(userID, {cartData: cartData});

            res.json({success: true, message: "Add to cart successfully"});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }

    async updateCart(req, res) {
        try {
            
            const { userId, itemId, size, quantity } = req.body;

        } catch (error) {
            
        }
    }
}

module.exports = new cartC();




