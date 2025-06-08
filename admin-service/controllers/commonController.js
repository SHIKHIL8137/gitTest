import { updataBlockStatus } from "../api/userServiceApi.js";

export const blockUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId)
      return res.status(404).json({ status: false, message: "userId missing" });
    const response = await updataBlockStatus(userId);
    if (!response.data.status) {
      return res
        .status(400)
        .json({ status: false, message: "ann error occures" });
    }
    res.status(200).json({ status: true, message: response.data.message });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
