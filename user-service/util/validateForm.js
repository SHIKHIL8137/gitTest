import validator from "validator";

export const validateProfileUpdate = (data, role) => {
  const errors = {};
  const validData = {};

  if (!data.userName || validator.isEmpty(data.userName.trim())) {
    errors.userName = "Username is required";
  } else {
    validData.userName = data.userName.trim();
  }

  if (!data.email || !validator.isEmail(data.email.trim())) {
    errors.email = "Valid email is required";
  } else {
    validData.email = data.email.trim();
  }

  if (data.phoneNumber) {
    if (!validator.isMobilePhone(data.phoneNumber.toString(), "any")) {
      errors.phoneNumber = "Invalid phone number";
    } else {
      validData.phoneNumber = data.phoneNumber;
    }
  }

  if (data.address !== "") {
    if (!data.address || validator.isEmpty(data.address.trim())) {
      errors.address = "Address cannot be empty";
    } else {
      validData.address = data.address.trim();
    }
  }

  ["linkedIn", "twitter", "web"].forEach((field) => {
    const value = data[field];
    if (value) {
      if (!validator.isURL(value, { require_protocol: true })) {
        errors[field] = `${field} must be a valid URL with http(s)`;
      } else {
        validData[field] = value;
      }
    }
  });

  if (role === "client") {
    if (!data.companyName || validator.isEmpty(data.companyName.trim())) {
      errors.companyName = "Company name is required";
    } else {
      validData.companyName = data.companyName.trim();
    }
  }

  if (role !== "client") {
    if (!data.position || validator.isEmpty(data.position.trim())) {
      errors.position = "position is required";
    } else {
      validData.position = data.position.trim();
    }

    if (!data.experienceLevel || !data.experienceLevel.trim()) {
      errors.experienceLevel = "Experience is required";
    } else {
      validData.experienceLevel = data.experienceLevel;
    }

    if (!Array.isArray(data.skills) || data.skills.length === 0) {
      errors.skills = "At least one skill is required";
    } else {
      validData.skills = data.skills;
    }

    if (!data.about || validator.isEmpty(data.about.trim())) {
      errors.about = "About is required";
    } else {
      validData.about = data.about.trim();
    }

    if (data.pricePerHour !== undefined && data.pricePerHour !== null) {
      if (!validator.isFloat(data.pricePerHour.toString())) {
        errors.pricePerHour = "Price per hour must be a number";
      } else {
        validData.pricePerHour = parseFloat(data.pricePerHour);
      }
    }

    if (data.gitHub) {
      if (!validator.isURL(data.gitHub, { require_protocol: true })) {
        errors.gitHub = "GitHub must be a valid URL with http(s)";
      } else {
        validData.gitHub = data.gitHub;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    validData,
  };
};
