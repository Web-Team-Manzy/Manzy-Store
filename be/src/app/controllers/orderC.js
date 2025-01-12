const { processPayment } = require("../../services/paymentService");
const { sendOrderConfirmationEmail, sendPinEmail } = require("../../services/EmailService");
const orderM = require("../models/orderM");
const userModels = require("../models/userM");
const bcrypt = require("bcrypt");
const pinM = require("../models/pinM");

class orderC {
    // [POST] /send-order-confirmation-pin
    async sendOrderConfirmationPin(req, res) {
        try {
            const userEmail = req.user.email;
            console.log("req.user", req.user.id);

            console.log("userEmail", userEmail);

            // Generate a random PIN for transaction confirmation
            const transactionPin = Math.floor(100000 + Math.random() * 900000).toString();

            // Hash the PIN
            const hashedPin = await bcrypt.hash(transactionPin, 10);

            await pinM.deleteMany({
                email: userEmail,
                purpose: "order_confirmation",
            });

            // Save the hashed PIN and expiration time to the pin collection
            const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
            const pinData = {
                email: userEmail,
                pin: hashedPin,
                purpose: "order_confirmation",
                expirationTime,
            };
            const newPin = new pinM(pinData);
            await newPin.save();

            // Send transaction PIN email
            await sendPinEmail(userEmail, transactionPin, "order_confirmation");

            res.json({
                success: true,
                message: "Please check your email for the transaction PIN to confirm the payment.",
            });
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }
    }

    // [POST] /confirm-order
    async placeOrder(req, res) {
        try {
            const { transactionPin, items, amount, address, paymentMethod } = req.body;
            const userId = req.user.id;

            console.log("req.user", req.user);

            // Get user email
            const user = await userModels.findById(userId);
            const userEmail = user.email;

            if (paymentMethod !== "COD") {
                // Find the pin by email and purpose
                const pinData = await pinM.findOne({
                    email: userEmail,
                    purpose: "order_confirmation",
                });
                if (!pinData || new Date() > pinData.expirationTime) {
                    return res.json({
                        success: false,
                        message: "Invalid or expired transaction PIN",
                    });
                }

                // Compare the provided PIN with the hashed PIN
                const isMatch = await bcrypt.compare(transactionPin, pinData.pin);
                if (!isMatch) {
                    return res.json({
                        success: false,
                        message: "Invalid transaction PIN",
                    });
                }

                // Remove the pin data after confirmation
                await pinM.findByIdAndDelete(pinData._id);
            }

            // Create order data
            const orderData = {
                userId,
                items,
                amount,
                address,
                paymentMethod,
                payment: paymentMethod === "COD" ? false : true,
            };

            const newOrder = new orderM(orderData);
            await newOrder.save();

            const orderId = newOrder._id;

            if (paymentMethod !== "COD") {
                // Call processPayment
                const response = await processPayment(userId, amount, orderId);

                if (response && +response.EC === 0 && response.DT.status === "COMPLETED") {
                    await orderM.findByIdAndUpdate(orderId, { payment: true });
                    await userModels.findByIdAndUpdate(userId, { cartData: {} });

                    // Send order confirmation email
                    await sendOrderConfirmationEmail(userEmail, orderData);

                    res.json({
                        success: true,
                        message: "Payment confirmed and order placed successfully",
                    });
                } else {
                    res.json({ success: false, message: "Payment failed" });
                }
            } else {
                // Send order confirmation email for COD
                await sendOrderConfirmationEmail(userEmail, orderData);
                await userModels.findByIdAndUpdate(userId, { cartData: {} });
                res.json({
                    success: true,
                    message: "Order placed successfully with Cash on Delivery",
                });
            }
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

    // Get orders by date for payment system
    async getOrdersByDate(req, res) {
        try {
            let startDate = new Date(req.params.startDate);
            let endDate = new Date(req.params.endDate);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.json({
                    EC: 1,
                    EM: "Invalid date format",
                });
            }

            const orders = await orderM.find({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            });

            if (!orders) {
                return res.json({
                    EC: 1,
                    EM: "No orders found",
                });
            }

            res.json({
                EC: 0,
                EM: "Success",
                DT: orders,
            });
        } catch (error) {
            console.log(error);
            res.json({ EC: 1, EM: error.message });
        }
    }
}

module.exports = new orderC();
