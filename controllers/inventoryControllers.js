const Player = require("../models/player");

// [GET] semua inventory
async function getInventory(req, res) {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player.inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// [POST] tambah item
async function addInventoryItem(req, res) {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    player.inventory.push(req.body);
    await player.save();

    res
      .status(201)
      .json({ message: "Item added", inventory: player.inventory });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// [PUT] update item
async function updateInventoryItem(req, res) {
  try {
    const { id, itemIndex } = req.params;
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    if (!player.inventory[itemIndex]) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    player.inventory[itemIndex] = req.body;
    await player.save();

    res.json({
      message: "Inventory item updated",
      inventory: player.inventory,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// [DELETE] hapus item
async function deleteInventoryItem(req, res) {
  try {
    const { id, itemIndex } = req.params;
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    if (!player.inventory[itemIndex]) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    player.inventory.splice(itemIndex, 1);
    await player.save();

    res.json({ message: "Item deleted", inventory: player.inventory });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


module.exports = {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
