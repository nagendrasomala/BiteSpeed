const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const identifyRoutes = require('./controller/identify');
const PORT = process.env.PORT || 5000;


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/identify', identifyRoutes);



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;