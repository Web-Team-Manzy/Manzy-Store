const { processGetAccountBalance } = require("../../services/paymentService");
const User = require("../models/userM");
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const moment = require('moment');
require("dotenv").config();

class UserController {
    // [GET] /users
    async index(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;

            const users = await User.find().select("-password").skip(skip).limit(limit);

            const totalUsers = await User.countDocuments();

            if (!users || users.length === 0) {
                return res.status(400).json({
                    EC: 1,
                    EM: "No user found",
                    DT: [],
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: {
                    totalUsers,
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers / limit),
                    users,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal server error",
                DT: [],
            });
        }
    }

    // [GET] /users/:id
    async show(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Invalid id",
                    DT: [],
                });
            }

            const user = await User.findById(id).select("-password");

            if (!user) {
                return res.status(400).json({
                    EC: 1,
                    EM: "No user found",
                    DT: [],
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: user,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal server error",
                DT: [],
            });
        }
    }

    // [PUT] /users/:id
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { email, phone, address, firstName, lastName, role, displayName } = req.body;

            if (!id) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Invalid id",
                    DT: [],
                });
            }

            if (!email || !displayName || !role) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Missing required fields",
                    DT: [],
                });
            }

            const user = await User.findByIdAndUpdate(
                id,
                { displayName, email, phone, firstName, lastName, role, address },
                { new: true }
            ).select("-password");

            if (!user) {
                return res.status(400).json({
                    EC: 1,
                    EM: "No user found",
                    DT: [],
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: user,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal server error",
                DT: [],
            });
        }
    }

    // [DELETE] /users/:id
    async destroy(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Invalid id",
                    DT: [],
                });
            }

            const user = await User.findByIdAndDelete(id).select("-password");

            if (!user) {
                return res.status(400).json({
                    EC: 1,
                    EM: "No user found",
                    DT: [],
                });
            }

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: user,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal server error",
                DT: [],
            });
        }
    }

    // [GET] /users/:id/balance
    async getBalance(req, res, next) {
        try {
            let { id } = req.params || req.user;
            if (!id) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Invalid id",
                    DT: {},
                });
            }

            const response = await processGetAccountBalance(id);
            console.log(">>> response: ", response);

            if (response && +response.EC === 0) {
                return res.status(200).json({
                    EC: 0,
                    EM: "Success",
                    DT: response.DT,
                });
            } else {
                return res.status(400).json({
                    EC: 1,
                    EM: response.EM,
                    DT: {},
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal server error",
                DT: {},
            });
        }
    }

    async sendFormData(req, res, next) {
        try {
            const { email, name, subject, message } = req.body;

            if (!email || !subject || !message || !name) {
                return res.status(400).json({
                    EC: 1,
                    EM: "Missing required fields",
                    DT: {},
                });
            }

            // Gửi dữ liệu lên Google Sheets
            const currentDate = new Date();
            const format = "HH:mm DD/MM/YYYY";
            const formattedDate = moment(currentDate).format(format);

            const serviceAccountAuth = new JWT({
                // env var values here are copied from service account credentials generated by google
                // see "Authentication" section in docs for more info
                email: process.env.client_email,
                key: process.env.private_key.replace(/\\n/g, '\n'),
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
              });

            
            const doc = new GoogleSpreadsheet(process.env.sheet_id, serviceAccountAuth);

            await doc.loadInfo();
            console.log(doc.title);
            const sheet = doc.sheetsByIndex[0]; 

            await sheet.addRow({
                "Email": email,
                "Name": name,
                "Subject": subject,
                "Message": message,
                "Timestamp": formattedDate
            });

            return res.status(200).json({
                EC: 0,
                EM: "Success",
                DT: {},
            });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                EC: 1,
                EM: "Internal server error",
                DT: {},
            });
        }
    }
}

module.exports = new UserController();
