import VerificationRequest from "../model/verificationModal.js";

export const getVerificationData = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const requests = await VerificationRequest.find()
      .sort({ requestDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    if (!requests)
      return res.status(400).json({ status: false, message: "error occuers" });

    const totalRequests = await VerificationRequest.countDocuments();

    res.status(200).json({ totalRequests, requests });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getClientRequest = async (req, res) => {
  try {
    const { id } = req.query;
    const requests = await VerificationRequest.find({ clientId: id })
      .sort({ requestDate: -1 })
      .limit(1);
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const updateVerification = async (req, res) => {
  try {
    const { userId, message, action, requestId } = req.body;

    if (!userId || !action || !requestId) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const request = await VerificationRequest.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ status: false, message: "Verification request not found" });
    }

    if (request.clientId !== userId) {
      return res
        .status(403)
        .json({
          status: false,
          message: "Request does not belong to this user",
        });
    }

    request.status = action === "verified" ? "verified" : "rejected";
    request.message = message || "";
    request.verificationDate = new Date();
    await request.save();

    res.status(200).json({
      status: true,
      message: `Client ${action} successfully`,
      verificationRequest: request,
    });
  } catch (error) {
    console.error("Error updating verification:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};
