
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


//Para crear usuarios
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    //si la promesa se cumple (guarda exitosamente el user)
    try {
        await user.save()  //guardamos el usuario
        const token = await user.generateAuthToken() // y se crea el token de acceso q permite definir la identidad del user 
        res.status(201).send({ user, token })
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

//Login de users
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password) //find user by email and password
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

//Logout de users
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})



//Para levantar usuarios de la base de datos. Unicamente se va a ejecutar y va a mostrar el perfil del user si es q esta autenticado
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
  
})

//Para levantar un usuario en particular por ID
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id 

    try {
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send()
        } 

        res.send(user)
    } catch(e) {
        res.status(500).send()
    }
})


//Update user 
router.patch('/users/:id', async (req, res)=> {
    const updates = Object.keys(req.body) 
    const allowedUpdates = ['name', 'email', 'password', 'age'] // defino lo que se puede cambiar 
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
   
    if(!isValidOperation) {
        return res.status(400).send({ error: 'Updates invalidos!! '})
    }

    try {
        
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update]) // para acceder a una propiedad dinamicamente
        await user.save()        

        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Para eliminar usuarios
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router

