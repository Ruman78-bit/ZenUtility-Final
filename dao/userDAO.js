const bcrypt = require("bcryptjs");
const { UserModel } = require("../model");

const SALT_ROUNDS = 12;

const hashPassword = (plain) => bcrypt.hash(String(plain), SALT_ROUNDS);

const saveUser = async (data) => {
  try {
    const user = { ...data };
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
    return await UserModel.create([user]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUser = async (query) => {
  try {
    // Passwords are hashed, so they can never be used as a filter.
    const { password, ...filter } = query;
    return await UserModel.find(filter).exec();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    if (typeof email !== "string" || typeof password !== "string") {
      return null;
    }
    const user = await UserModel.findOne({ email }).select("+password").exec();
    if (!user) {
      return null;
    }
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return null;
    }
    const safeUser = user.toObject();
    delete safeUser.password;
    return safeUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async (query, data) => {
  try {
    const update = { ...data };
    if (update.password) {
      update.password = await hashPassword(update.password);
    }
    return await UserModel.findOneAndUpdate(query, update, { new: true }).exec();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUser = async (query) => {
  try {
    return await UserModel.findOneAndDelete(query).exec();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { saveUser, getUser, loginUser, updateUser, deleteUser };
