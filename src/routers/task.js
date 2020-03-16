const express = require('express')
const Task = require('../models/task')
const router = new express.Router()


//Para crear tareas
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//Para levantar tasks de la base de datos
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

//Para levantar una tarea en particular por ID
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    
    try {
        const task = await Task.findById(_id)

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})


//Update user 
router.patch('/tasks/:id', async (req, res)=> {
    const updates = Object.keys(req.body) 
    const allowedUpdates = ['description', 'completed'] // defino lo que se puede cambiar 
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
   
    if(!isValidOperation) {
        return res.status(400).send({ error: 'Updates invalidos!! '})
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Para eliminar tasks
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router