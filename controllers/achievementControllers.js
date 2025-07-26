const Player = require("../models/player");

// [GET] semua achievement player
async function getAllAchievements(req, res) {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    res.json(player.achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// [POST] tambah achievement baru
async function addAchievement(req, res) {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    const newAchievement = {
      ...req.body,
      unlockedAt: new Date(),
    };

    player.achievements.push(newAchievement);
    await player.save();

    res.status(201).json({
      message: "Achievement unlocked",
      achievements: player.achievements,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// [DELETE] hapus achievement
async function deleteAchievement(req, res) {
  try {
    const { id, achievementIndex } = req.params;
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ message: "Player not found" });

    if (!player.achievements[achievementIndex]) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    player.achievements.splice(achievementIndex, 1);
    await player.save();

    res.json({
      message: "Achievement deleted",
      achievements: player.achievements,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// [GET] ambil persentase achievement terlangka
async function getRareAchievements(req, res) {
  try {
    // hitung total player
    const totalPlayers = await Player.countDocuments();
    if (totalPlayers === 0) {
      return res.status(200).json({ message: "Belum ada pemain", data: [] });
    }

    // pipeline untuk menghitung jumlah pemain per achievement
    const aggResult = await Player.aggregate([
      { $unwind: "$achievements" },
      {
        $group: {
          _id: "$achievements.title",
          playerCount: { $sum: 1 },
        },
      },
      { $sort: { playerCount: 1 } }, // sort dari yg paling langka
    ]);

    // hitung persentase
    const withPercentage = aggResult.map((a) => ({
      achievementTitle: a._id,
      playerCount: a.playerCount,
      percentage: ((a.playerCount / totalPlayers) * 100).toFixed(2) + "%",
    }));

    res.status(200).json({
      message: "Persentase achievement terlangka berhasil diambil",
      totalPlayers,
      data: withPercentage,
    });
  } catch (err) {
    console.error("Error getRareAchievements:", err);
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: err.message });
  }
}

module.exports = {
  getAllAchievements,
  addAchievement,
  deleteAchievement,
  getRareAchievements,
};
