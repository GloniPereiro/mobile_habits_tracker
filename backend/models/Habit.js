const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['poranne', 'dzienne', 'wieczorne'],
    required: true,
  },
  // Removed date and tasks, as it's now a recurring template
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
