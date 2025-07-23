const sql = require("../configs/db");

// ✅ Get creations by user
const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    console.log("🧪 Clerk userId:", userId);
    const creations = await sql`
      SELECT * FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get all published creations
const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations
      WHERE publish = true
      ORDER BY created_at DESC
    `;

    return res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Toggle like on a creation
const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id}
    `;

    if (!creation) {
      return res.json({
        success: false,
        message: "Creation not found",
      });
    }

    const currentLikes = creation.likes || []; // fallback if null
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    // Format PostgreSQL array: '{user1,user2,...}'
    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`
      UPDATE creations
      SET likes = ${formattedArray}::text[]
      WHERE id = ${id}
    `;

    return res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUserCreations,
  getPublishedCreations,
  toggleLikeCreation, // ✅ fixed lowercase typo
};
