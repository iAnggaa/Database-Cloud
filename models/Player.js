const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Inventory Item (Nested)
 */
const InventoryItemSchema = new Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
}, { _id: false });

/**
 * Quest (Nested)
 */
const QuestSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  progress: { type: Number, default: 0 },
  target: { type: Number, required: true },
  rewardGold: { type: Number, default: 0 }
}, { _id: false });

/**
 * Achievement (Nested)
 */
const AchievementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  unlockedAt: { type: Date, default: Date.now }
}, { _id: false });

/**
 * Player Schema (Main)
 */
const PlayerSchema = new Schema({
  _id: String, // custom ID seperti '1'
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  gold: { type: Number, default: 100 },
  inventory: [InventoryItemSchema],
  quests: [QuestSchema],
  achievements: [AchievementSchema],
  createdAt: { type: Date, default: Date.now }
});

// ⬇️ Model bernama 'player', otomatis koleksi bernama 'players'
module.exports = mongoose.model('player', PlayerSchema);
