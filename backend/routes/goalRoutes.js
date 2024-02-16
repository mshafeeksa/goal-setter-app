const express = require('express');
const router = express.Router();
const { getGoals,setGoal,updateGoal,deleteGoal } = require('../controllers/goalController');
const { set } = require('mongoose');

router.route('/').get(getGoals).post(setGoal);

router.route('/:id').put(updateGoal).delete(deleteGoal);

module.exports = router;