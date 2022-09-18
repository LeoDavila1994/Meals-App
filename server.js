const { app } = require('./app');

const { db } = require('./utils/database.utils');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const { initialModels } = require('./models/initialModels');

const startServer = async () => {
    try {
        await db.authenticate().then(console.log('Database Authenticated'));

        initialModels();

        await db.sync().then(console.log('Database Synchronized'));

        app.listen(process.env.PORT_LISTENER, () => {
            console.log('Express app runing!');
        });
    } catch (error) {
        console.log(error);
    }
};

startServer();
