const { processPayment } = require("../../services/paymentService");
const { sendOrderConfirmationEmail } = require("../../services/emailService");
const orderM = require("../models/orderM");
const userModels = require("../models/userM");

class orderC {
    async placeOrder(req, res) {
        try {
            const { userId, items, amount, address, paymentMethod } = req.body;

            const orderData = {
                userId,
                items,
                amount,
                address,
                paymentMethod, 
                payment: false,
            };

            const newOrder = new orderM(orderData);
            await newOrder.save();

            const orderId = newOrder._id;

            // Call processPayment
            const response = await processPayment(userId, amount, orderId);

            if(response && +response.EC === 0 && response.DT.status === "COMPLETED"){
                // Update order payment status
                await orderM.findByIdAndUpdate(orderId, { payment: true });
            }

            console.log(">>> processPayment response: ", response);

            await userModels.findByIdAndUpdate(userId, { cartData: {} });

            // Get user email
            const user = await userModels.findById(userId);
            const userEmail = user.email;

            // Send order confirmation email
            await sendOrderConfirmationEmail(userEmail, orderData);

            res.json({ success: true, message: "Order placed successfully" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // All ordes data for admin panel
    async allOrders(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;

            const orders = await orderM.find({}).skip(skip).limit(limit).lean();

            const userIds = orders.map((order) => order.userId).filter(Boolean);

            const users = await userModels.find({ _id: { $in: userIds } }).lean();

            const userMap = users.reduce((map, user) => {
                map[user._id] = user.displayName;
                return map;
            }, {});

            const enrichedOrders = orders.map((order) => {
                const userId = order.userId;
                order.displayName = userMap[userId] || "Unknown";
                return order;
            });

            const totalOrders = await orderM.countDocuments();

            res.json({
                success: true,
                totalOrders,
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                orders: enrichedOrders,
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // User orders data for FE
    async userOrders(req, res) {
        try {
            const { userId } = req.body;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;

            const orders = await orderM.find({ userId }).skip(skip).limit(limit).lean();

            const totalOrders = await orderM.countDocuments({ userId });
            
            const userIds = orders.map((order) => order.userId).filter(Boolean);

            const users = await userModels.find({ _id: { $in: userIds } }).lean();

            const userMap = users.reduce((map, user) => {
                map[user._id] = user.displayName;
                return map;
            }, {});

            const enrichedOrders = orders.map((order) => {
                const userId = order.userId;
                order.displayName = userMap[userId] || "Unknown";
                return order;
            });

            res.json({
                success: true,
                totalOrders,
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                orders: enrichedOrders,
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // update order status from admin Panel
    async updateStatus(req, res) {
        try {
            const { orderId, status } = req.body;
            await orderM.findByIdAndUpdate(orderId, { status });
            res.json({ success: true, message: "Order status updated successfully" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }
}

module.exports = new orderC();
