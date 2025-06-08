import { fetchProjects } from "../api/projectServiceApi.js";

export const projects = async (req, res) => {
  try {
    const page = req.query.page;
    const prefix = req.query.search || "";
    const response = await fetchProjects(page, prefix);

    if (!response.status) {
      return res.status(400).json({
        status: false,
        message: "error fetching data please reload page",
      });
    }
    res.status(200).json({ status: true, projectData: response.data.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
