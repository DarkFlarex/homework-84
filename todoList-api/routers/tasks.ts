import auth, {RequestWithUser} from "../middleware/auth";
import express from "express";
import {TaskMutation} from "../types";
import Task from "../models/Task";
import mongoose from "mongoose";

const tasksRouter = express.Router();

tasksRouter.get("/", auth, async (req:RequestWithUser, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send({error: 'User not found'});
        }
        const tasks = await Task.find({user: req.body.user });
        return res.send(tasks);
    } catch (error) {
        return next(error);
    }
});

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
    try{
        if (!req.user) {
            return res.status(401).send({ error: 'User not found' });
        }
        const taskMutation: TaskMutation = {
            user: req.body.user,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        };
        const task = new Task(taskMutation);
        await task.save();

        return res.send(task);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }

        return next(error);
    }
});

tasksRouter.delete('/:id', auth, async (req:RequestWithUser, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send({error: 'User not found'});
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Forbidden: The user does not have enough access rights to delete' });
        }

        await Task.deleteOne({_id: req.params.id});

        return res.send(task);
    } catch (error) {
        next(error);
    }
});

tasksRouter.patch('/:id', auth, async (req:RequestWithUser, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).send({error: 'User not found'});
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Forbidden: The user does not have enough access rights to update' });
        }

        await Task.updateOne({_id: req.params.id},{$set:req.body});

        return res.send(task);
    } catch (error) {
        next(error);
    }
});

export default tasksRouter;