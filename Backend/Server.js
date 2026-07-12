const cors = require('cors');   
const express = require('express');
const db = require('./Confiq/db');
const userRoutes = require('./Routes/UserRoutes');
const productRoutes = require('./Routes/ProductRoutes');
const orderRoutes = require('./Routes/OrderRoutes');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

async function startServer() {
    try {
        await db.authenticate();
        console.log('Database connected successfully');
        await db.sync();
        console.log('Database synchronized successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to start server:', err);
        process.exit(1);
    }
}

startServer();