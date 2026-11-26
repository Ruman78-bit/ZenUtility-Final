const { UserDAO } = require("../dao");

const withoutPassword = (user) => {
  const plain = user?.toObject ? user.toObject() : { ...user };
  delete plain.password;
  return plain;
};

const saveUser = async (req, res, next) => {
  try {
    const { body } = req;
    let savedUserData = await UserDAO.saveUser(body);
    res.json({
      success: true,
      message: "User saved successfully",
      data: savedUserData.map(withoutPassword),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error?.message, data: [] });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserDAO.loginUser(email, password);
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
        data: [],
      });
    }
    res.json({ success: true, message: "Login successful", data: [user] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login failed", data: [] });
  }
};

const getUser = async (req, res, next) => {
  try {
    const { query } = req;
    let userData = await UserDAO.getUser(query);
    res.json({
      success: true,
      message: "User fetched successfully",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error?.message, data: [] });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params, body } = req;
    let userData = await UserDAO.updateUser(params, body);
    res.json({
      success: true,
      message: "User updated successfully",
      data: userData ? withoutPassword(userData) : userData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error?.message, data: [] });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { params } = req;
    let userData = await UserDAO.deleteUser(params);
    res.json({
      success: true,
      message: "User deleted successfully",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error?.message, data: [] });
  }
};

module.exports = { saveUser, loginUser, getUser, updateUser, deleteUser };
