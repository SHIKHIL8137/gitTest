import Freelancer from "../model/user/freelancerModel.js";

export const clientHomeData = async (req, res) => {
  try {
    const {
      search = "",
      location,
      skill,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      experienceLevel,
    } = req.query;

    const query = {};

    if (search) {
      query.userName = { $regex: search, $options: "i" };
    }

    if (location) {
      query.address = { $regex: location, $options: "i" };
    }

    if (skill) {
      const skillArray = skill.split(",");
      query.skills = { $in: skillArray };
    }

    if (experienceLevel) {
      if (experienceLevel.includes(",")) {
        const experienceLevels = experienceLevel.split(",");
        query.experienceLevel = { $in: experienceLevels };
      } else {
        query.experienceLevel = experienceLevel;
      }
    }

    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerHour.$lte = parseFloat(maxPrice);
    }

    const sortOptions = {};
    if (sortBy === "position") {
      sortOptions.position = sortOrder === "desc" ? -1 : 1;
      sortOptions.pricePerHour = 1;
    } else if (sortBy === "userName") {
      sortOptions.userName = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "pricePerHour") {
      sortOptions.pricePerHour = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "experienceLevel") {
      const experienceLevelOrder = { expert: 3, intermediate: 2, entry: 1 };
      sortOptions.experienceLevel = sortOrder === "desc" ? -1 : 1;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const freelancers = await Freelancer.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Freelancer.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: freelancers,
    });
  } catch (error) {
    console.error("Error in clientHomeData:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const freelancerProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await Freelancer.findById(id);
    res.status(200).json({ status: true, user });
  } catch (error) {
    console.error("Error in clientHomeData:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const freelancersDataHome = async (req, res) => {
  try {
    const freelancers = await Freelancer.find().select('-password').limit(10);
    res.status(200).json({ status: true, freelancers });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: false, message: 'Server Error', error: error.message });
  }
};
