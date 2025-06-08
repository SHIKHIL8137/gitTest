import Client from "../model/user/clientMode.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.status(400).json({ status: false, message: "user Not found" });

    const userExist = await Client.findById(userId).select("-password");

    if (!userExist)
      return res.status(400).json({ status: false, message: "user Not exist" });

    res
      .status(200)
      .json({ status: true, message: "user data get successfylly", userExist });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
