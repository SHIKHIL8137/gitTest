import {
  fetchClientData,
  fetchClientDatas,
  getClientsDatas,
} from "../api/userServiceApi.js";
import {
  fetchVerificationRequest,
  updateVerification,
  verificationRequestData,
} from "../api/verificationService.js";

export const getClientsData = async (req, res) => {
  try {
    const page = req.query.page;
    const prefix = req.query.search || "";
    const response = await fetchClientDatas(page, prefix);

    if (!response.status) {
      return res.status(400).json({
        status: false,
        message: "error fetching data please reload page",
      });
    }
    res.status(200).json({ status: true, clientData: response.data.data });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getVerificationTableData = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const response = await verificationRequestData(skip, limit);
    const { totalRequests, requests } = response.data;
    if (!requests.length) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          total: totalRequests,
          page: parseInt(page),
          pages: Math.ceil(totalRequests / limit),
        },
      });
    }

    const clientIds = requests.map((request) => request.clientId);

    const responseClient = await getClientsDatas(clientIds);
    const { clients } = responseClient.data;

    const clientMap = {};
    clients.forEach((client) => {
      clientMap[client._id] = client;
    });
    const responseData = requests.map((request) => {
      const client = clientMap[request.clientId] || {};

      return {
        requestId: request._id,
        userId: request.clientId,
        userName: client.userName || "Unknown",
        companyName: client.companyName || "N/A",
        email: client.email || "N/A",
        phoneNumber: client.phoneNumber || "N/A",
        requestDate: request.requestDate,
        status: request.status,
        verificationDate: request.verificationDate,
        message: request.message,
        profileImage: client.profileImage,
        status: request.status,
      };
    });

    return res.status(200).json({
      status: true,
      data: responseData,
      pagination: {
        total: totalRequests,
        page: parseInt(page),
        pages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching verification table data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification table data",
      error: error.message,
    });
  }
};

export const getClientVerificationDetails = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id)
      return res
        .status(404)
        .json({ status: false, message: "the id is missing!!" });
    const clientResponse = await fetchClientData(id);
    const requestResponse = await fetchVerificationRequest(id);
    const client = clientResponse.data.client;
    const verificationRequest = requestResponse.data.requests[0];
    client.verificationRequest = verificationRequest;

    res.status(200).json({
      status: true,
      client,
    });
  } catch (error) {
    console.error("Error fetching verification table data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification table data",
      error: error.message,
    });
  }
};

export const verifyOrRejectUser = async (req, res) => {
  try {
    const updateVerifiyClient = await updateVerification(req.body);
    if (!updateVerifiyClient.data.status)
      return res.status(400).json({ status: false, message: "error occures" });
    res
      .status(200)
      .json({
        status: true,
        data: updateVerifiyClient.data,
        message: updateVerifiyClient.data.message,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification table data",
      error: error.message,
    });
  }
};
