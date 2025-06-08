import Freelancer from "../model/user/freelancerModel.js";

export const updateProjectUser = async (req, res) => {
  try {
    const { projectId } = req.body;
    const { userId } = req.user;
    console.log("hello", projectId, userId);
    const updatedUser = await Freelancer.findByIdAndUpdate(
      userId,
      {
        $addToSet: { projects: projectId },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
