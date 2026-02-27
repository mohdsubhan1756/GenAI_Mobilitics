// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const cors = require('cors');
// const testRoutes = require('./routes/testRoutes');
// const prescriptionRoutes = require('./routes/prescriptionRoutes');



// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://127.0.0.1:27017/balance-statics');

// app.listen(5000, () => {
//     console.log('Server running on port 5000');
// });

// app.use('/api/tests', testRoutes);
// app.use('/api/prescriptions', prescriptionRoutes);


const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const testRoutes = require('./routes/testRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const { router: authRoutes } = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/balance-statics')
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.use('/api/tests', testRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/auth', authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

