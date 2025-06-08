import { Project } from "../model/projectModel.js";

export const projects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search || "";

    const searchFilter = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const projects = await Project.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProjects = await Project.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalProjects / limit);

    const data = {
      currentPage: page,
      totalPages,
      totalProjects,
      projects,
    };

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching projects",
      error: error.message,
    });
  }
};
