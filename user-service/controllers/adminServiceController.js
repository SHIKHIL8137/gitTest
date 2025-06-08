import Freelancer from "../model/user/freelancerModel.js";
import Client from "../model/user/clientMode.js";

export const dashboardDetails = async (req, res) => {
  try {
    const freelancerCount = await Freelancer.countDocuments();
    const clientCount = await Client.countDocuments();

    const countByRole = [
      { _id: "freelancer", count: freelancerCount },
      { _id: "client", count: clientCount },
    ];

    const recentFreelancers = await Freelancer.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentClients = await Client.find().sort({ createdAt: -1 }).limit(5);

    const data = {
      countByRole,
      recentFreelancers,
      recentClients,
    };

    res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getFreelancersData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search || "";

    const searchFilter = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { skills: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const freelancersData = await Freelancer.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalFreelancers = await Freelancer.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalFreelancers / limit);
    const data = {
      currentPage: page,
      totalPages,
      totalFreelancers,
      freelancers: freelancersData,
    };
    res.status(200).json({
      data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getClientsData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search || "";

    const searchFilter = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { position: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const clientsData = await Client.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalClients = await Client.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalClients / limit);
    const data = {
      currentPage: page,
      totalPages,
      totalClients,
      clients: clientsData,
    };
    res.status(200).json({
      data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const updateBlockStatus = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is missing" });
    }

    let user = await Client.findById(userId);
    let Model = Client;

    if (!user) {
      user = await Freelancer.findById(userId);
      Model = Freelancer;
    }

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      { block: !user.block },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: `User has been ${updatedUser.block ? "blocked" : "unblocked"}`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

export const getClientDatas = async (req, res) => {
  try {
    const { users } = req.body;
    const clients = await Client.find({ _id: { $in: users } }).select(
      "-password"
    );
    if (!clients)
      return res
        .status(400)
        .json({ status: false, message: "an error occure fetching data" });
    res.status(200).json({ status: true, clients });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

export const getClient = async (req, res) => {
  try {
    const { id } = req.query;
    const client = await Client.findById(id);
    res.status(200).json({ client });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};
