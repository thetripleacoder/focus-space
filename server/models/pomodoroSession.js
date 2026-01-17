const mongoose = require('mongoose');

const pomodoroSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['focus', 'break'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    }, // in minutes
    completedAt: {
      type: Date,
      default: Date.now,
    },
    config: {
      focusMinutes: {
        type: Number,
        default: 25,
      },
      breakMinutes: {
        type: Number,
        default: 5,
      },
      totalSessions: {
        type: Number,
        default: 4,
      },
    },
  },
  {
    strict: true,
  },
);

pomodoroSessionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const PomodoroSession = mongoose.model(
  'PomodoroSession',
  pomodoroSessionSchema,
);

module.exports = PomodoroSession;
