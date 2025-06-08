import { validateUserId } from "../apis/userServices.js";
import VerificationRequest from "../model/verificationModal.js";

export const verificationRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res
        .status(400)
        .json({ message: "user ID missing", status: false });

    const response = await validateUserId({ userId });

    if (!response.data.status)
      return res
        .status(400)
        .json({ status: false, message: response.data.message });

    if (!response.data.userExist)
      return res
        .status(400)
        .json({ status: false, message: "user ID is missing!!!" });
    const clientId = response?.data?.userExist?._id;
    const newRequest = new VerificationRequest({
      clientId,
      status: "pending",
    });

    const newRequestCreated = await newRequest.save();

    res
      .status(200)
      .json({
        status: true,
        message: "Request submitted successFully",
        newRequestCreated,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getUserVerifyData = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId)
      return res
        .status(400)
        .json({
          status: false,
          message: "user ID and role missing please train agin",
        });

    const request = await VerificationRequest.findOne({ clientId: userId })
      .sort({ requestDate: -1 })
      .limit(1);

    res.status(200).json({ status: true, request });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
