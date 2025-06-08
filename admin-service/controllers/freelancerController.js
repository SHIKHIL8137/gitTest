import { fetchFreelancerDatas } from "../api/userServiceApi.js";

export const getFreelancersData = async (req, res) => {
  try {
    const page = req.query.page;
    const prefix = req.query.search || "";
    const response = await fetchFreelancerDatas(page, prefix);
    if (!response.status) {
      return res.status(400).json({
        status: false,
        message: "error fetching data please reload page",
      });
    }
    res.status(200).json({ status: true, freelancerData: response.data.data });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
