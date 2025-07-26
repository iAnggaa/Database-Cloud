const express = require("express");
const router = express.Router();

//Player routes
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getLeaderboard,
} = require("../controllers/playerControllers");

router.get("/", getAllPlayers);
router.get("/:id", getPlayerById);
router.post("/", createPlayer);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);
router.get("/leaderboard/top", getLeaderboard);

// Inventory routes
const {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getPopularInventory,
  performGacha,
} = require("../controllers/inventoryControllers");

router.get("/:id/inventory", getInventory);
router.post("/:id/inventory", addInventoryItem);
router.put("/:id/inventory/:itemIndex", updateInventoryItem);
router.delete("/:id/inventory/:itemIndex", deleteInventoryItem);
router.get("/inventory/popular", getPopularInventory);
router.post("/:id/gacha", performGacha);

// Quest routes
const {
  getAllQuests,
  addQuest,
  updateQuest,
  deleteQuest,
  updateQuestProgress,
} = require("../controllers/questController");

router.get("/:id/quests", getAllQuests);
router.post("/:id/quests", addQuest);
router.patch("/:id/quests/:questIndex", updateQuest);
router.delete("/:id/quests/:questIndex", deleteQuest);
router.patch("/:id/quests/:questIndex/progress", updateQuestProgress);

// Achievement routes
const {
  getAllAchievements,
  addAchievement,
  deleteAchievement,
  getRareAchievements,
} = require("../controllers/achievementControllers");

router.get("/:id/achievements", getAllAchievements);
router.post("/:id/achievements", addAchievement);
router.delete("/:id/achievements/:achievementIndex", deleteAchievement);
router.get("/achievements/rare", getRareAchievements);

module.exports = router;
