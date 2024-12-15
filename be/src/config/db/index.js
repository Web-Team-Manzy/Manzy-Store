const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect(
            "mongodb+srv://hoanglenam0905:22120217@cluster0.5queg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        );
        console.log("Connect successfully!!!");
    } catch (error) {
        console.log("Connect failure!!!");
    }
}

module.exports = { connect };
