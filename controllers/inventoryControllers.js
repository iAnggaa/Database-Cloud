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

// [GET] Inventory Populer
async function getPopularInventory(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5; // bisa set limit lewat query

    const popularItems = await Player.aggregate([
      { $unwind: "$inventory" },
      {
        $group: {
          _id: "$inventory.itemName",
          totalOwned: { $sum: "$inventory.quantity" },
        },
      },
      { $sort: { totalOwned: -1 } },
      { $limit: limit },
    ]);

    res.status(200).json({
      message: "Popular inventory items fetched successfully",
      data: popularItems.map((item) => ({
        itemName: item._id,
        totalOwned: item.totalOwned,
      })),
    });
  } catch (err) {
    console.error("Error in getPopularInventory:", err);
    res.status(500).json({
      message: "Gagal mengambil data inventory populer",
      error: err.message,
    });
  }
}

// biaya gacha
const GACHA_COST = 100;

// daftar pool gacha
const gachaPool = [
  { itemName: "Health Potion", rarity: "common", weight: 50 },
  { itemName: "Iron Sword", rarity: "rare", weight: 30 },
  { itemName: "Magic Scroll", rarity: "epic", weight: 15 },
  { itemName: "Dragon Slayer", rarity: "legendary", weight: 5 },
];

// fungsi untuk pilih item berdasarkan weight
function rollGacha(pool) {
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let rand = Math.random() * totalWeight;
  for (let item of pool) {
    if (rand < item.weight) {
      return item;
    }
    rand -= item.weight;
  }
  return pool[0]; // fallback
}

// [POST] Gacha
async function performGacha(req, res) {
  try {
    const playerId = req.params.id;
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: "Player not found" });

    // cek gold
    if (player.gold < GACHA_COST) {
      return res.status(400).json({ message: "Gold tidak cukup untuk gacha" });
    }

    // kurangi gold
    player.gold -= GACHA_COST;

    // lakukan roll
    const resultItem = rollGacha(gachaPool);

    // cek apakah sudah ada di inventory
    const existingItem = player.inventory.find(
      (i) => i.itemName === resultItem.itemName
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      player.inventory.push({
        itemName: resultItem.itemName,
        rarity: resultItem.rarity,
        quantity: 1,
      });
    }

    await player.save();

    res.status(200).json({
      message: "Gacha berhasil!",
      itemDidapat: resultItem.itemName,
      rarity: resultItem.rarity,
      sisaGold: player.gold,
    });
  } catch (err) {
    console.error("Gacha error:", err);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat gacha", error: err.message });
  }
}

module.exports = {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getPopularInventory,
  performGacha,
};
