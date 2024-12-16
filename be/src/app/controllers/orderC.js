const orderM = require('../models/orderM'); 

class orderC {

    async placeOrder(req, res) {

        try {
            
            const { userId, items, amount, address } = req.body;

            const orderData = {
                userId,
                items,
                amount,
                address,
                paymentMethod: "COD", // Cash on delivery
                payment: false,
            };

            const newOrder = new orderM(orderData);
            await newOrder.save();

            await userModels.findByIdAndUpdate(userId, {cartData: {}});

            res.json({success: true, message: "Order placed successfully"});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }

    }
    
    // All ordes data for admin panel
    async allOrders(req, res) {
        try {
            
            const orders = await orderM.find({});
            res.json({success: true, orders});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }

    // User orders data for FE
    async userOrders(req, res) {

        try {
            const { userId } = req.body;

            const orders = await orderM.find({ userId });
            res.json({success: true, orders});

        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }

    // update order status from admin Panel
    async updateStatus (req, res) {
        try {

            const { orderId, status } = req.body;

            await orderM.findByIdAndUpdate(orderId, { status });
            res.json({success: true, message: "Order status updated successfully"});
            
        } catch (error) {
            console.log(error);
            res.json({success: false, message: error.message});
        }
    }

}

module.exports = new orderC();




