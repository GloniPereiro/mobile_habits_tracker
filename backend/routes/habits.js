const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const Log = require('../models/Log');

// GET all habits with completion status for a specific date
router.get('/', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: 'Date is required' });

        const habits = await Habit.find();
        const logs = await Log.find({ date });

        const habitsWithStatus = habits.map(habit => {
            const log = logs.find(l => l.habitId.toString() === habit._id.toString());
            return {
                ...habit.toObject(),
                isDone: log ? log.status : false
            };
        });

        res.json(habitsWithStatus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new permanent habit
router.post('/', async (req, res) => {
    const habit = new Habit({
        name: req.body.name,
        category: req.body.category,
    });

    try {
        const newHabit = await habit.save();
        res.status(201).json(newHabit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH to toggle status for a specific habit on a specific date
router.patch('/:id/toggle-status', async (req, res) => {
    try {
        const { date } = req.body;
        if (!date) return res.status(400).json({ message: 'Date is required' });

        let log = await Log.findOne({ habitId: req.params.id, date });

        if (log) {
            log.status = !log.status;
            await log.save();
        } else {
            log = new Log({
                habitId: req.params.id,
                date,
                status: true // If it didn't exist, we're likely marking it as done
            });
            await log.save();
        }

        res.json({ status: log.status });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a habit and its associated logs
router.delete('/:id', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        await Log.deleteMany({ habitId: req.params.id });
        res.json({ message: 'Habit and logs deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
