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
        const tasks = await Task.find({ user: req.body.user });
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

export default tasksRouter;