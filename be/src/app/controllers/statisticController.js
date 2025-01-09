const orderM = require("../models/orderM");

class statisticC {

    // [GET]/statistic/total?startDate=2025-01-01&endDate=25-01-08&tag
    async getStatistic(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const orders = await orderM.find({
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).lean();

            const totalOrders = orders.length;

            const totalRevenue = orders.reduce((total, order) => {
                return total + order.amount;
            }, 0);

            const codOrders = orders.filter(order => order.paymentMethod === 'COD');
            const paymentOrders = orders.filter(order => order.paymentMethod === 'PAYMENT');

            const codRevenue = codOrders.reduce((total, order) => {
                return total + order.amount;
            }, 0);

            const paymentRevenue = paymentOrders.reduce((total, order) => {
                return total + order.amount;
            }, 0);

            res.status(200).json({ 
                totalOrders, 
                totalRevenue, 
                codOrders: codOrders.length, 
                codRevenue, 
                paymentOrders: paymentOrders.length, 
                paymentRevenue 
            });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    // [GET]/statistic/product?startDate=2025-01-01&endDate=25-01-08&tag
    async getProductStatistic(req, res) {
        try {
            const { startDate, endDate, page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
    
            const orders = await orderM.find({
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).lean();
    
            const products = orders.reduce((total, order) => {
                order.items.forEach(item => {
                    const productId = item.product._id;
                    const productQuantity = Object.values(item.sizes).reduce((sum, qty) => sum + qty, 0);
    
                    if (!total[productId]) {
                        total[productId] = {
                            product: item.product, 
                            sold: productQuantity,
                        };
                    } else {
                        total[productId].sold += productQuantity;
                    }
                });
                return total;
            }, {});
    
            const productStatistic = Object.values(products);
    
            // Phân trang
            const paginatedProductStatistic = productStatistic.slice(skip, skip + limit);
            const total = productStatistic.length;
    
            res.status(200).json({
                success: true,
                data: paginatedProductStatistic,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            });
    
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    // [GET]/statistic/chart?startDate=2025-01-01&endDate=25-01-08&tag=day
    async getChartStatistic(req, res) {
        try {
            const { startDate, endDate, tag } = req.query;
    
            const orders = await orderM.find({
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).lean();
    
            const chartData = orders.reduce((total, order) => {
                const date = new Date(order.createdAt);
                let key = '';
    
                if (tag === 'day') {
                    key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                } else if (tag === 'month') {
                    key = `${date.getMonth() + 1}/${date.getFullYear()}`;
                } else if (tag === 'year') {
                    key = `${date.getFullYear()}`;
                }
    
                if (!total[key]) {
                    total[key] = {
                        totalOrders: 1,
                        totalRevenue: order.amount
                    };
                } else {
                    total[key].totalOrders += 1;
                    total[key].totalRevenue += order.amount;
                }
    
                return total;
            }, {});
    
            const chartStatistic = Object.keys(chartData).map(key => {
                return {
                    date: key,
                    totalOrders: chartData[key].totalOrders,
                    totalRevenue: chartData[key].totalRevenue
                };
            });
    
            res.status(200).json({
                tag, 
                startDate,
                endDate,
                statistics: chartStatistic});
    
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async getBestSeller(req, res) {
        try {
            const { startDate, endDate } = req.query;
    
            const orders = await orderM.find({
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).lean();
    
            const productSales = orders.reduce((total, order) => {
                order.items.forEach((item) => {
                    const productId = item.product._id;
                    const productQuantity = Object.values(item.sizes).reduce(
                        (sum, qty) => sum + qty,
                        0
                    );
    
                    if (!total[productId]) {
                        total[productId] = {
                            product: item.product,
                            sold: productQuantity
                        };
                    } else {
                        total[productId].sold += productQuantity;
                    }
                });
                return total;
            }, {});
    
            const bestSellingProducts = Object.values(productSales)
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 10);
    
            res.status(200).json({
                success: true,
                data: bestSellingProducts
            });
    
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new statisticC();