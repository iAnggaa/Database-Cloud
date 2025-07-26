const Player = require("../models/player");

// [GET] Semua player
async function getAllPlayers(req, res) {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// [GET] player by ID
async function getPlayerById(req, res) {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// [POST] Tambah player baru
async function createPlayer(req, res) {
  try {
    const data = req.body;

    // jika input berupa array
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(400).json({ message: "Array tidak boleh kosong" });
      }
      const newPlayers = await Player.insertMany(data);
      return res.status(201).json({
        message: "Banyak player berhasil dibuat",
        data: newPlayers,
      });
    }

    // jika input berupa satu object
    const { _id, username, email } = data;
    const newPlayer = new Player({ _id, username, email });
    await newPlayer.save();
    return res.status(201).json({
      message: "Player berhasil dibuat",
      data: newPlayer,
    });
  } catch (err) {
    console.error("createPlayer error:", err);
    res.status(400).json({ message: err.message });
  }
}

// [PUT] Update player
async function updatePlayer(req, res) {
  try {
    const updated = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Player not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// [DELETE] Hapus player
async function deletePlayer(req, res) {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Player not found" });
    res.json({ message: "Player deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// [GET] Leaderboard (Top 10 level & experience)
async function getLeaderboard(req, res) {
  try {
    const leaderboard = await Player.aggregate([
      { $sort: { level: -1, experience: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          username: 1,
          level: 1,
          experience: 1,
          gold: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Leaderboard berhasil diambil",
      data: leaderboard,
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res
      .status(500)
      .json({ message: "Gagal mengambil leaderboard", error: err.message });
  }
}

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getLeaderboard,
};
