const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');
// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = async (req, res) => {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
}

// @desc Set goal
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Add a text field');
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json({ goal });
})

// @desc Update goal
// @route PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(400);
        throw new Error(`Goal with id: ${req.params.id} not found`);
    }

    const user = await User.findById(req.user.id);
    
    //Check if user exists
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Check if logged in user is owner of the goal
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized to delete goal')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    res.status(200).json(updatedGoal);
})

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(400);
        throw new Error(`Cannot find Goal with id: ${req.params.id}`);
    }

    const user = await User.findById(req.user.id);
    
    //Check if user exists
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    //Check if logged in user is owner of the goal
    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized to delete goal')
    }

    await goal.deleteOne()
    res.status(200).json({ text: `Deleted goal with id: ${req.params.id}`});
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}