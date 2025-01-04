const { processPayment } = require("../../services/paymentService");
const orderM = require("../models/orderM");
const userModels = require("../models/userM");

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

            const orderId = newOrder._id;

            // Call processPayment
            const response = await processPayment(userId, amount, orderId);

            console.log(">>> processPayment response: ", response);

            await userModels.findByIdAndUpdate(userId, { cartData: {} });

            res.json({ success: true, message: "Order placed successfully" });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // All ordes data for admin panel
    async allOrders(req, res) {
        try {
            const orders = await orderM.find({}).lean();

            const userIds = orders.map((order) => order.userId).filter(Boolean);

            const users = await userModels.find({ _id: { $in: userIds } }).lean();

            const userMap = users.reduce((map, user) => {
                map[user._id] = user.displayName;
                return map;
            }, {});

            const enrichedOrders = orders.map((order) => {
                const userId = order.userId;

                order.displayName = userMap[userId] || "Unknown";

                console.log(">>> order: ", order);

                return order;
            });

            res.json({ success: true, orders: enrichedOrders });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // User orders data for FE
    async userOrders(req, res) {
        try {
            const { userId } = req.body;

            const orders = await orderM.find({ userId });
            res.json({ success: true, orders });
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
