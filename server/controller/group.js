const Group = require("../models/group");
const UserGroup = require("../models/userGroup");

exports.createGroup = async (req, res, next) => {
  try {
    const { groupName } = req.body;
    const data = await req.user.createGroup(
      { groupName },
      { through: { isAdmin: true } }
    );
    return res.status(201).json({ data, message: "Group created" });
  } catch (err) {
    res.status(500).json({ error: err, message: "Error occured" });
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const data = await req.user.getGroups();
    return res.status(200).json({ data, message: "Groups Found" });
  } catch (err) {
    res.status(500).json({ message: "Error Ocurred" });
  }
};

exports.addMembers = async (req, res, next) => {
  try {
    const { memberId, isAdmin, groupId } = req.body;
    if (!memberId) {
      return res.status(404).json({ message: "User not found" });
    }
    const userGroup = await UserGroup.findOne({
      where: { groupId, userId: req.user.id },
    });

    if (!userGroup || !userGroup.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not an admin of the group." });
    }

    const data = await UserGroup.create({
      groupId,
      userId: memberId,
      isAdmin: isAdmin,
    });
    if (data) {
      return res.status(201).json({ message: "Member added to the group." });
    }
  } catch (err) {
    res.status(500).json({ error: err, message: "Error occurred" });
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const { userId, groupId } = req.body;
    const userGroup = await UserGroup.findOne({
      where: {
        groupId,
        userId: req.user.id,
      },
    });

    if (!userGroup || !userGroup.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not an admin of the group." });
    }

    const data = await UserGroup.destroy({ where: { groupId, userId } });
    if (data) {
      return res
        .status(200)
        .json({ data: data, message: "Successfully deleted user" });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ error: err, message: "Error Ocurred" });
  }
};
