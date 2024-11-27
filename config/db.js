const mongoose = require("mongoose");
require("dotenv").config();

const DBconnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
      })
      .then(() => console.log('Db connected'))
      .catch(err => console.log('Error connecting to DB:', err));
};

module.exports = DBconnect;
