import mongoose, {Types} from 'mongoose';
import User from "./User";

const Statuses = ['new', 'in_progress', 'complete'];

const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
   user:{
       type: Schema.Types.ObjectId,
       ref:"User",
       required:true,
       validate: {
           validator: async (value: Types.ObjectId) => {
            const user = await User.findById(value);
            return Boolean(user);
           },
           message: 'User does not exist'
       }
   },
    title: {
        type: String,
        required: true,
    },
    description: String,
    status:{
        type: String,
        required: true,
    }
});

TaskSchema.methods.checkStatus = function (status: string): boolean {
    return Statuses.includes(status);
};

TaskSchema.pre('save', async function (next) {
    if (!Statuses.includes(this.status)) {
        return next(Error('Invalid status'));
    }
    next();
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;