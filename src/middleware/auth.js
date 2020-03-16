//Authentication middleware
const jwt = require('jsonwebtoken')
const User = require('../models/user')

//Middleware function
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') //header that the user provides
        const decoded = jwt.verify(token, 'holahola')                    //valida el header
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) //busca el user asociado del header provisto
        //2 caminos: 
        if (!user) {
            throw new Error()    
        }
        //A) se llama a next() para q se ejecute el handler 
        
        req.token = token  
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'P/F Autenticarse.' }) //B) Si no esta autenticado, lanza cod de error 401
    }
}

module.exports = auth



// Without middleware: new req -> run route handler
//
// With middleware:    new req -> do something -> run route handler
//Middleware: función q se puede ejecutar antes o después del manejo de una ruta; tiene acceso al objeto Request, Response y la función next().