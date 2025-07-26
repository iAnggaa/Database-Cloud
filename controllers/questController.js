const Player = require("../models/player");

// [GET] semua quest player
async function getAllQuests(req, res) {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    res.json(player.quests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// [POST] tambah quest baru
async function addQuest(req, res) {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    player.quests.push(req.body);
    await player.save();

    res.status(201).json({ message: "Quest added", quests: player.quests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// [PATCH] update quest progress/status
async function updateQuest(req, res) {
  try {
    const { id, questIndex } = req.params;
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const quest = player.quests[questIndex];
    if (!quest) return res.status(404).json({ message: "Quest not found" });

    Object.assign(quest, req.body);
    await player.save();

    res.json({ message: "Quest updated", quest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// [DELETE] hapus quest
async function deleteQuest(req, res) {
  try {
    const { id, questIndex } = req.params;
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    if (!player.quests[questIndex]) {
      return res.status(404).json({ message: "Quest not found" });
    }

    player.quests.splice(questIndex, 1);
    await player.save();

    res.json({ message: "Quest deleted", quests: player.quests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


module.exports = {
  getAllQuests,
  addQuest,
  updateQuest,
  deleteQuest,
};
