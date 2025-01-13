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
    
    // [GET]/statistic/bestseller?startDate=2025-01-01&endDate=25-01-08
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

    // [GET]/statistic/averageOrderValue?startDate=2025-01-01&endDate=25-01-08
    async getAverageOrderValue(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const orders = await orderM.find({
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).lean();

            const totalRevenue = orders.reduce((total, order) => total + order.amount, 0);
            const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;

            res.status(200).json({ averageOrderValue });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    // [GET]/statistic/topCustomers?startDate=2025-01-01&endDate=25-01-08&limit=5
    async getTopCustomers(req, res) {
        try {
            const { startDate, endDate, limit = 5 } = req.query;

            const topCustomers = await orderM.aggregate([
                { 
                    $match: {
                        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
                    }
                },
                {
                    $group: {
                        _id: "$customerId",
                        totalSpent: { $sum: "$amount" },
                        orderCount: { $sum: 1 }
                    }
                },
                { $sort: { totalSpent: -1 } },
                { $limit: parseInt(limit) }
            ]);

            res.status(200).json({ topCustomers });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    // [GET]/statistic/salesByCategory?startDate=2025-01-01&endDate=25-01-08
    async getSalesByCategory(req, res) {
        try {
            
            const { startDate, endDate } = req.query;

            const orders = await orderM.find({
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).lean();

            const salesByCategory = orders.reduce((total, order) => {
                order.items.forEach(item => {
                    const category = item.product.category;
                    if (!total[category]) {
                        total[category] = {
                            totalOrders: 1,
                            totalRevenue: item.amount
                        };
                    } else {
                        total[category].totalOrders += 1;
                        total[category].totalRevenue += item.amount;
                    }
                });
                return total;
            }, {});

            const formattedSalesByCategory = Object.keys(salesByCategory).map(category => ({
                category,
                totalOrders: salesByCategory[category].totalOrders,
                totalRevenue: salesByCategory[category].totalRevenue
            }));

            res.status(200).json({
                success: true,
                data: formattedSalesByCategory
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }



    // [GET]/statistic/customerRetention?startDate=2025-01-01&endDate=25-01-08
    async getCustomerRetention(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const orders = await orderM.find({
                createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }).lean();

            const customerOrderDates = orders.reduce((acc, order) => {
                if (!acc[order.customerId]) {
                    acc[order.customerId] = [];
                }
                acc[order.customerId].push(order.createdAt);
                return acc;
            }, {});

            let repeatCustomers = 0;

            Object.values(customerOrderDates).forEach(dates => {
                if (dates.length > 1) {
                    repeatCustomers += 1;
                }
            });

            const totalCustomers = Object.keys(customerOrderDates).length;
            const retentionRate = totalCustomers ? (repeatCustomers / totalCustomers) * 100 : 0;

            res.status(200).json({
                retentionRate: `${retentionRate.toFixed(2)}%`,
                totalCustomers,
                repeatCustomers
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new statisticC();