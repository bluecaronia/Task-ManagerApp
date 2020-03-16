const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


//Mongoose schema para crear usuarios
const userSchema = new mongoose.Schema({
        name: {
            type: String,
            //required: true,
            trim: true
        },
        email: {
            type: String,
            //unique: true,
            //required: true,
            trim: true,
            lowercase: true,
            // validate(value) { 
            //     if(!validator.isEmail(value)) {
            //         throw new Error('El email es inválido')
            //     }
            // }
        },
     
        password: {
            type: String,
            //required: true,
            minlength: 7,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password"')
                }
            }
        },
        age: {
            type: Number,
            defalut: 0,
            validate(value) {
                if(value < 0) {
                    throw new Error ('La edad debe ser un nro positivo')
                }
            }
        },
        tokens: [{   //array de tokens
            token: {
                type: String,
                required: true
            }
        }]
    })

    //Para generar JSONweb tokens
    userSchema.methods.generateAuthToken = async function () {
        const user = this
        const token = jwt.sign({ _id: user._id.toString() }, 'holahola')
    
        user.tokens = user.tokens.concat({ token })
        await user.save()
    
        return token
    }

    //Validacion de email y passwd para el login del usuario
    userSchema.statics.findByCredentials = async (email, password) => {
        const user = await User.findOne({ email })
    
        if (!user) {
            throw new Error('No es posible loguearse')
        }
    
        const isMatch = await bcrypt.compare(password, user.password)
    
        if (!isMatch) {
            throw new Error('No es posible loguearse')
        }
    
        return user
    }


    //Hashear la passwd antes de que se guarden los users
    userSchema.pre('save', async function (next) {
        const user = this
    
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8) // la cantidad de veces q va a ejecutar el algoritmo de hash
        }
    
        next()
    })

 
const User = mongoose.model('User', userSchema)

module.exports = User

