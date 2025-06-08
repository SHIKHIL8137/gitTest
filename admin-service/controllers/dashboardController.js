import { fetchUsersDashbordDetails } from "../api/userServiceApi.js";

export const getDashboardData = async (req, res) => {
  try {
    const response = await fetchUsersDashbordDetails();
    if (!response.data.status)
      return res
        .status(404)
        .json({ status: false, message: "error fetching data" });
    console.log(response.data.data);
    res.status(200).json({ status: true, data: response.data.data });
  } catch (error) {
    console.log(error);
  }
};
