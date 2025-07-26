const express = require("express");
const router = express.Router();

//Player routes
const {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/playerControllers");

router.get("/", getAllPlayers);
router.get("/:id", getPlayerById);
router.post("/", createPlayer);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);

// Inventory routes
const {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../controllers/inventoryControllers");

router.get("/:id/inventory", getInventory);
router.post("/:id/inventory", addInventoryItem);
router.put("/:id/inventory/:itemIndex", updateInventoryItem);
router.delete("/:id/inventory/:itemIndex", deleteInventoryItem);


module.exports = router;
