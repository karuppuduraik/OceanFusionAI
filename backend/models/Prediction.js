const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['CYCLONE_NUMERICAL', 'CYCLONE_IMAGE', 'TSUNAMI_ASSESSMENT'],
    },
    inputParameters: {
      type: Object,
      default: {},
    },
    imageName: {
      type: String,
      default: null,
    },
    prediction: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: null,
    },
    probability: {
      type: Number,
      default: null,
    },
    confidence: {
      type: Number,
      default: null,
    },
    windSpeed: {
      type: Number,
      default: null,
    },
    riskLevel: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Fallback in-memory storage array if MongoDB service is unavailable locally
const inMemoryStore = [];

PredictionSchema.statics.saveRecord = async function (data) {
  try {
    if (mongoose.connection.readyState === 1) {
      const record = new this(data);
      return await record.save();
    }
  } catch (err) {
    console.warn('[PredictionModel Warning] Failed to persist to MongoDB, storing in memory:', err.message);
  }
  
  const record = {
    _id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    ...data,
    createdAt: new Date(),
  };
  inMemoryStore.unshift(record);
  return record;
};

PredictionSchema.statics.getRecentRecords = async function (limit = 10) {
  try {
    if (mongoose.connection.readyState === 1) {
      return await this.find().sort({ createdAt: -1 }).limit(limit);
    }
  } catch (err) {
    console.warn('[PredictionModel Warning] Failed to query MongoDB, returning in-memory store:', err.message);
  }
  return inMemoryStore.slice(0, limit);
};

module.exports = mongoose.model('Prediction', PredictionSchema);
