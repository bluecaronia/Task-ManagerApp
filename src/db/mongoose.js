//Mongoose para crear Schemas
const mongoose = require('mongoose')


//Para conectarse a la BD
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


