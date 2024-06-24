const Vessel = require("../models/vessel")
const VSL = require("../models/VSL")
const Experience = require("../models/experience")
const Rank = require("../models/rank")
const Grade = require("../models/grade")
const Port = require("../models/port")
const PortAgent = require("../models/port_agent")
const Hospital = require("../models/hospital")
const Document = require("../models/document")
const Vendor = require("../models/vendor")
const User = require('../models/user')
const Country = require('../models/country')
const CrewPlanner=require('../models/crew-planner')
const Queries = require('../models/queries')
const Candidate = require("../models/candidate")
const Contract = require("../models/contract")
const { Op } = require("sequelize")


//Vessel and VSL Type
const create_vessel = async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const userGroup = user.userGroup;

      if (userGroup === 'admin') {
          const { vesselName } = req.body;
          const newVessel = await Vessel.create({ vesselName });
          return res.json({ message: 'Vessel created successfully' });
      } else if (userGroup === 'vendor' && user.Write) {
          const { vesselName } = req.body;
          const newVessel = await Vessel.create({ vesselName });
          return res.json({ message: 'Vessel created successfully' });
      } else {
          return res.status(403).json({ message: "Not authorized to create a vessel" });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const create_VSL = async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const userGroup = user.userGroup;

      if (userGroup === 'admin') {
          const { vesselName, vesselType, vsl_company, imoNumber, vesselFlag } = req.body;
          const newVSL = await VSL.create({
              vesselName,
              vesselType,
              vsl_company,
              imoNumber,
              vesselFlag,
          });

          return res.json({ message: 'VSL created successfully', vsl: newVSL });
      } else if (userGroup === 'vendor' && user.Write) {
          const { vesselName, vesselType, vsl_company, imoNumber, vesselFlag } = req.body;
          const newVSL = await VSL.create({
              vesselName,
              vesselType,
              vsl_company,
              imoNumber,
              vesselFlag,
          });

          return res.json({ message: 'VSL created successfully', vsl: newVSL });
      } else {
          return res.status(403).json({ message: "Not authorized to create a VSL" });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const view_vessel = async (req, res) => {
  try {
      const userId = req.user.id;
      console.log(userId);
      let userGroup;
      let readOnly;

      const user = await User.findByPk(userId);
      if (user) {
          userGroup = user.dataValues.userGroup;
          readOnly = user.dataValues.readOnly;
          console.log('User Group:', userGroup);
          console.log('Read Only:', readOnly);
      } else {
          console.log('User not found');
          return res.status(404).json({ message: "User not found", success: false });
      }

      let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
      let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

      // Calculate the offset based on the page and limit
      let offset = (page - 1) * limit;

      if (userGroup === 'admin' || (userGroup === 'vendor' && readOnly)) {
          // For admin users or vendors with readOnly permission, provide access to all vessels
          const result = await Vessel.findAndCountAll({
              offset,
              limit,
          });

          res.status(200).json({
              vessels: result.rows,
              totalCount: result.count,
              totalPages: Math.ceil(result.count / limit),
              currentPage: page,
              success: true,
          });
      } else {
          // For other users or vendors without readOnly permission, return an empty array
          return res.status(200).json({
              vessels: [],
              totalCount: 0,
              totalPages: 0,
              currentPage: page,
              success: true,
          });
      }
  } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err, message: "Internal Server Error", success: false });
  }
};
const view_VSL = async (req, res) => {
  try {
      const userId = req.user.id;
      console.log(userId);
      let userGroup;
      let readOnly;

      const user = await User.findByPk(userId);
      if (user) {
          userGroup = user.dataValues.userGroup;
          readOnly = user.dataValues.readOnly;
          console.log('User Group:', userGroup);
          console.log('Read Only:', readOnly);
      } else {
          console.log('User not found');
          return res.status(404).json({ message: "User not found", success: false });
      }

      let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
      let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

      // Calculate the offset based on the page and limit
      let offset = (page - 1) * limit;

      if (userGroup === 'admin' || (userGroup === 'vendor' && readOnly)) {
          // For admin users or vendors with readOnly permission, provide access to all VSLs
          const result = await VSL.findAndCountAll({
              offset,
              limit,
          });

          res.status(200).json({
              vsls: result.rows,
              totalCount: result.count,
              totalPages: Math.ceil(result.count / limit),
              currentPage: page,
              success: true,
          });
      } else {
          // For other users or vendors without readOnly permission, return an empty array
          return res.status(200).json({
              vsls: [],
              totalCount: 0,
              totalPages: 0,
              currentPage: page,
              success: true,
          });
      }
  } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err, message: "Internal Server Error", success: false });
  }
};
const delete_vessel = async (req, res) => {
  const vesselId = req.params.id;

  try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const userGroup = user.userGroup;

      if (userGroup === 'admin') {
          const deletedVessel = await Vessel.destroy({ where: { id: vesselId } });
          if (deletedVessel > 0) {
              return res.status(200).json({ success: true });
          } else {
              return res.status(404).json({ error: 'Vessel not found', success: false });
          }
      } else if (userGroup === 'vendor' && user.deletes) {
          const deletedVessel = await Vessel.destroy({ where: { id: vesselId } });
          if (deletedVessel > 0) {
              return res.status(200).json({ success: true });
          } else {
              return res.status(404).json({ error: 'Vessel not found', success: false });
          }
      } else {
          return res.status(403).json({ message: "Not authorized to delete a vessel" });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const delete_VSL = async (req, res) => {
  const vslId = req.params.id;

  try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const userGroup = user.userGroup;

      if (userGroup === 'admin') {
          const deletedVSL = await VSL.destroy({ where: { id: vslId } });
          if (deletedVSL > 0) {
              return res.status(200).json({ success: true });
          } else {
              return res.status(404).json({ error: 'VSL not found', success: false });
          }
      } else if (userGroup === 'vendor' && user.deletes) {
          const deletedVSL = await VSL.destroy({ where: { id: vslId } });
          if (deletedVSL > 0) {
              return res.status(200).json({ success: true });
          } else {
              return res.status(404).json({ error: 'VSL not found', success: false });
          }
      } else {
          return res.status(403).json({ message: "Not authorized to delete a VSL" });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const getVessel = async (req, res) => {
  const vesselId = req.params.id;

  try {
    const vessel = await Vessel.findByPk(vesselId);

    if (!vessel) {
      return res.status(404).json({ message: 'Vessel not found' });
    }

    return res.status(200).json({ vessel });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getVSL = async (req, res) => {
  const vesselId = req.params.id;

  try {
    const vsl = await VSL.findByPk(vesselId);

    if (!vsl) {
      return res.status(404).json({ message: 'VSL not found' });
    }

    return res.status(200).json({ vsl });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const update_vessel = async (req, res) => {
  const id = req.params.id;

  try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const userGroup = user.userGroup;
      const isWritePermission = user.Write;

      if (userGroup === 'admin' || (userGroup === 'vendor' && isWritePermission)) {
          const vessel = await Vessel.findByPk(id);

          if (!vessel) {
              return res.status(404).json({ message: 'Vessel not found' });
          }

          // Update the vessel fields with the new data
          vessel.vesselName = req.body.vesselName;

          // Save the updated vessel
          await vessel.save();

          // Fetch the updated vessel after saving changes
          const updatedVessel = await Vessel.findByPk(id);

          return res.status(200).json({
              message: 'Vessel updated successfully',
              vessel: updatedVessel
          });
      } else {
          return res.status(403).json({ message: 'Not authorized to update a vessel' });
      }
  } catch (error) {
      console.error('Error during Vessel update:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const update_VSL = async (req, res) => {
  const id = req.params.id;

  try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const userGroup = user.userGroup;
      const isWritePermission = user.Write;

      if (userGroup === 'admin' || (userGroup === 'vendor' && isWritePermission)) {
          const vsl = await VSL.findByPk(id);

          if (!vsl) {
              return res.status(404).json({ message: 'VSL not found' });
          }

          // Update the vsl fields with the new data
          vsl.vesselName = req.body.vesselName;
          vsl.vesselType = req.body.vesselType;
          vsl.vsl_company = req.body.vsl_company;
          vsl.imoNumber = req.body.imoNumber;
          vsl.vesselFlag = req.body.vesselFlag;

          // Save the updated vsl
          await vsl.save();

          // Fetch the updated vsl after saving changes
          const updatedVSL = await VSL.findByPk(id);

          return res.status(200).json({
              message: 'VSL updated successfully',
              vsl: updatedVSL
          });
      } else {
          return res.status(403).json({ message: 'Not authorized to update a VSL' });
      }
  } catch (error) {
      console.error('Error during VSL update:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};
//experience
const view_experience = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    console.log('User Group:', userGroup);

    let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
    let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

    // Calculate the offset based on the page and limit
    let offset = (page - 1) * limit;

    if (userGroup === 'admin') {
      // For admin, fetch all experiences with pagination
      const result = await Experience.findAndCountAll({
        offset,
        limit,
      });

      res.status(200).json({
        experiences: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        success: true,
      });
    } else if (userGroup === 'vendor' && user.readOnly) {
      // For vendors with readOnly permission, fetch experiences with pagination
      const result = await Experience.findAndCountAll({
        offset,
        limit,
      });

      res.status(200).json({
        experiences: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        success: true,
      });
    } else {
      // For other users or vendors without readOnly permission, return an empty array
      res.status(200).json({
        experiences: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err, message: 'Internal Server Error', success: false });
  }
};
const get_experience = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters

    // Find the experience by its primary key (id)
    const experience = await Experience.findByPk(id);

    if (!experience) {
      // If experience with the given id is not found, return a 404 response
      return res.status(404).json({ error: 'Experience not found' });
    }

    // If experience is found, return it in the response
    return res.json({ experience });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const get_experiences = async (req, res) => {
  try {
   const experiences = await Experience.findAll();
    // If experience is found, return it in the response
    return res.json({ experiences:experiences });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const update_experience = async (req, res) => {
  const id = req.params.id;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userGroup = user.userGroup;

    if (userGroup === 'admin' || (userGroup === 'vendor' && user.Write)) {
      const experience = await Experience.findByPk(id);

      if (!experience) {
        return res.status(404).json({ message: 'Experience not found' });
      }

      experience.experience = req.body.experience;

      await experience.save();

      const updatedExperience = await Experience.findByPk(id);

      return res.status(200).json({
        message: 'Experience updated successfully',
        experience: updatedExperience,
      });
    } else {
      return res.status(403).json({ message: "Not authorized to update an experience" });
    }
  } catch (error) {
    console.error('Error during Experience update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const delete_experience = async (req, res) => {
  const experienceId = req.params.id;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userGroup = user.userGroup;

    if (userGroup === 'admin') {
      const deletedExperience = await Experience.destroy({ where: { id: experienceId } });

      if (deletedExperience > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Experience not found', success: false });
      }
    } else if (userGroup === 'vendor' && user.deletes) {
      const deletedExperience = await Experience.destroy({ where: { id: experienceId } });

      if (deletedExperience > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Experience not found', success: false });
      }
    } else {
      return res.status(403).json({ message: "Not authorized to delete an experience" });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const create_exp = async (req, res) => {
  const { experience } = req.body;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userGroup = user.userGroup;

    if (userGroup === 'admin') {
      const newExperience = await Experience.create({ experience });
      return res.json({ message: 'Experience created successfully', experience: newExperience });
    } else if (userGroup === 'vendor' && user.Write) {
      const newExperience = await Experience.create({ experience });
      return res.json({ message: 'Experience created successfully', experience: newExperience });
    } else {
      return res.status(403).json({ message: "Not authorized to create an experience" });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
//rank 
const create_rank = async (req, res) => {
  const { rank, rankOrder, category } = req.body;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const isWritePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && isWritePermission)) {
      const newRank = await Rank.create({
        rank,
        rankOrder,
        category,
      });

      return res.json({ message: 'Rank created successfully', rank: newRank });
    } else {
      return res.status(403).json({ message: 'Not authorized to create a rank' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const view_rank = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const isReadOnly = user.readOnly;

    let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
    let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10
    let offset = (page - 1) * limit; // Calculate the offset based on the page and limit

    if (userGroup === 'admin' || (userGroup === 'vendor' && isReadOnly)) {
      // For admin or vendor with readOnly permission, fetch all ranks with pagination
      const result = await Rank.findAndCountAll({
        offset,
        limit,
      });

      return res.status(200).json({
        ranks: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        success: true,
      });
    } else {
      // For other users or vendors without readOnly permission, return an empty array
      return res.status(200).json({
        ranks: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        success: true,
      });
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};

const  view_ranks = async (req, res) => {
  try {
    const ranks = await Rank.findAll();

    return res.status(200).json({
      ranks,
      success: true,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};

const delete_rank = async (req, res) => {
  const rankId = req.params.id;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const userGroup = user.userGroup;
    const hasWritePermission = user.deletes;

    if (userGroup === 'admin' || (userGroup === 'vendor' && hasWritePermission)) {
      const deletedRank = await Rank.destroy({ where: { id: rankId } });

      if (deletedRank > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Rank not found', success: false });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized to delete a rank', success: false });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const update_rank = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const hasWritePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && hasWritePermission)) {
      const rank = await Rank.findByPk(id);

      if (!rank) {
        return res.status(404).json({ message: 'Rank not found' });
      }

      rank.rank = req.body.rank;
      rank.rankOrder = req.body.rankOrder;
      rank.category = req.body.category;

      await rank.save();

      const updatedRank = await Rank.findByPk(id);

      return res.status(200).json({
        message: 'Rank updated successfully',
        rank: updatedRank,
      });
    } else {
      return res.status(403).json({ message: 'Not authorized to update a rank' });
    }
  } catch (error) {
    console.error('Error during Rank update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const get_rank = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters

    // Find the rank by its primary key (id)
    const rank = await Rank.findByPk(id);

    if (!rank) {
      // If rank with the given id is not found, return a 404 response
      return res.status(404).json({ error: 'Rank not found' });
    }

    // If rank is found, return it in the response
    return res.json({ rank });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//grade
const create_grade = async (req, res) => {
  const { gradeExp } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const hasWritePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && hasWritePermission)) {
      const newGrade = await Grade.create({ gradeExp });

      return res.json({ message: 'Grade created successfully', grade: newGrade });
    } else {
      return res.status(403).json({ message: 'Not authorized to create a grade' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};  
const view_grade = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const readOnly = user.readOnly;

    let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
    let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

    // Calculate the offset based on the page and limit
    let offset = (page - 1) * limit;

    if (userGroup === 'admin' || (userGroup === 'vendor' && readOnly)) {
      // For admin or vendors with readOnly permission, fetch grades with pagination
      const result = await Grade.findAndCountAll({
        offset,
        limit,
      });

      return res.status(200).json({
        grades: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        success: true,
      });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const delete_grade = async (req, res) => {
  const gradeId = req.params.id;

  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.deletes;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with Write permission, proceed with deleting the grade
      const deletedGrade = await Grade.destroy({ where: { id: gradeId } });

      if (deletedGrade > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Grade not found', success: false });
      }
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to delete this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const update_grade = async (req, res) => {
  const id = req.params.id;

  try {
    const userId = req.user.id;
    const grade = await Grade.findByPk(id);

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with Write permission, proceed with updating the grade
      grade.gradeExp = req.body.gradeExp;
      await grade.save();

      const updatedGrade = await Grade.findByPk(id);

      return res.status(200).json({
        message: 'Grade updated successfully',
        grade: updatedGrade,
      });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to update this resource' });
    }
  } catch (error) {
    console.error('Error during Grade update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const get_grade = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters

    // Find the grade by its primary key (id)
    const grade = await Grade.findByPk(id);

    if (!grade) {
      // If grade with the given id is not found, return a 404 response
      return res.status(404).json({ error: 'Grade not found' });
    }

    // If grade is found, return it in the response
    return res.json({ grade });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const get_gradeDrop=async(req,res)=>{
 
    try {
      // Fetch all grades
      const allGrades = await Grade.findAll();
      
      // Return the grades
      return res.status(200).json({
       allGrades
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }


}
//port and port agent
const create_port = async (req, res) => {
  const { portName } = req.body;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with Write permission, proceed with creating the port
      const newPort = await Port.create({ portName });
      return res.json({ message: 'Port created successfully', port: newPort });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to create this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const create_port_agent = async (req, res) => {
  const { portAgentName, contactPerson, address, phone, email, city, state, country } = req.body;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with Write permission, proceed with creating the port agent
      const newPortAgent = await PortAgent.create({
        portAgentName,
        contactPerson,
        address,
        phone,
        email,
        city,
        state,
        country,
      });
      return res.json({ message: 'Port Agent created successfully', portAgent: newPortAgent });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to create this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const view_port = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const readOnlyPermission = user.readOnly;

    let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
    let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

    // Calculate the offset based on the page and limit
    let offset = (page - 1) * limit;

    if (userGroup === 'admin' || (userGroup === 'vendor' && readOnlyPermission)) {
      // For admin or vendors with ReadOnly permission, fetch all ports with pagination
      const result = await Port.findAndCountAll({
        offset,
        limit,
      });

      return res.status(200).json({
        ports: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        success: true,
      });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const view_ports =  async (req, res) => {
  try {
      const ports = await Port.findAll();
      res.json({ ports });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
const view_medicals =  async (req, res) => {
  try {
      const hospital = await Hospital.findAll();
      res.json({ hospital });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


const view_port_agent = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const readOnlyPermission = user.readOnly;

    let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
    let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

    // Calculate the offset based on the page and limit
    let offset = (page - 1) * limit;

    if (userGroup === 'admin' || (userGroup === 'vendor' && readOnlyPermission)) {
      // For admin or vendors with ReadOnly permission, fetch all port agents with pagination
      const result = await PortAgent.findAndCountAll({
        offset,
        limit,
      });

      return res.status(200).json({
        portAgents: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        success: true,
      });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const delete_port = async (req, res) => {
  const portId = req.params.id;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.deletes;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with Write permission, delete the port
      const deletedPort = await Port.destroy({ where: { id: portId } });

      if (deletedPort > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Port not found', success: false });
      }
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to delete this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const delete_port_agent = async (req, res) => {
  const portAgentId = req.params.id;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.deletes;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with Write permission, delete the port agent
      const deletedPortAgent = await PortAgent.destroy({ where: { id: portAgentId } });

      if (deletedPortAgent > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Port Agent not found', success: false });
      }
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to delete this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const update_port = async (req, res) => {
  const id = req.params.id;

  try {
    const port = await Port.findByPk(id);

    if (!port) {
      return res.status(404).json({ message: 'Port not found' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with Write permission, update the port
      port.portName = req.body.portName;

      await port.save();

      const updatedPort = await Port.findByPk(id);

      return res.status(200).json({
        message: 'Port updated successfully',
        port: updatedPort,
      });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to update this resource' });
    }
  } catch (error) {
    console.error('Error during Port update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const get_port = async (req, res) => {
  try {
    const id = req.params.id; // Extract the portId from the request parameters

    // Find the port by its primary key (portId)
    const port = await Port.findByPk(id);

    if (!port) {
      // If port with the given portId is not found, return a 404 response
      return res.status(404).json({ error: 'Port not found' });
    }

    // If port is found, return it in the response
    return res.json({ port });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const get_portagent = async (req, res) => {
  try {
    const id = req.params.id; // Extract the portAgentId from the request parameters

    // Find the port agent by its primary key (portAgentId)
    const portAgent = await PortAgent.findByPk(id);

    if (!portAgent) {
      // If port agent with the given portAgentId is not found, return a 404 response
      return res.status(404).json({ error: 'Port Agent not found' });
    }

    // If port agent is found, return it in the response
    return res.json({ portAgent });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const update_port_agent = async (req, res) => {
  const id = req.params.id;

  try {
    const portAgent = await PortAgent.findByPk(id);

    if (!portAgent) {
      return res.status(404).json({ message: 'Port Agent not found' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with Write permission, update the port agent
      portAgent.portAgentName = req.body.portAgentName;
      portAgent.contactPerson = req.body.contactPerson;
      portAgent.address = req.body.address;
      portAgent.phone = req.body.phone;
      portAgent.email = req.body.email;
      portAgent.city = req.body.city;
      portAgent.state = req.body.state;
      portAgent.country = req.body.country;

      await portAgent.save();

      const updatedPortAgent = await PortAgent.findByPk(id);

      return res.status(200).json({
        message: 'Port Agent updated successfully',
        portAgent: updatedPortAgent,
      });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to update this resource' });
    }
  } catch (error) {
    console.error('Error during Port Agent update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
//Hospital
const view_hospital = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const readOnly = user.readOnly;

    if (userGroup === 'admin' || (userGroup === 'vendor' && readOnly)) {
      // For admin or vendors with read-only permission, fetch all hospitals with pagination
      let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
      let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

      // Calculate the offset based on the page and limit
      let offset = (page - 1) * limit;

      const result = await Hospital.findAndCountAll({
        offset,
        limit,
      });

      return res.status(200).json({
        hospitals: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        success: true,
      });
    } else {
      // For other users or vendors without read-only permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const create_hospital = async (req, res) => {
  const { hospitalName, doctorName, doctorAddress, doctorCity, doctorState, doctorPhone, doctorEmail, doctorUpload } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with write permission, create a new hospital
      const newHospital = await Hospital.create({
        hospitalName,
        doctorName,
        doctorAddress,
        doctorCity,
        doctorState,
        doctorPhone,
        doctorEmail,
        doctorUpload,
      });

      return res.json({ message: 'Hospital created successfully', hospital: newHospital });
    } else {
      // For other users or vendors without write permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const delete_hospital = async (req, res) => {
  const hospitalId = req.params.id;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.deletes;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with write permission, delete the hospital
      const deletedHospital = await Hospital.destroy({ where: { id: hospitalId } });

      if (deletedHospital > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Hospital not found', success: false });
      }
    } else {
      // For other users or vendors without write permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const update_hospital = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with write permission, update the hospital
      const hospital = await Hospital.findByPk(id);

      if (!hospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }

      hospital.hospitalName = req.body.hospitalName;
      hospital.doctorName = req.body.doctorName;
      hospital.doctorAddress = req.body.doctorAddress;
      hospital.doctorCity = req.body.doctorCity;
      hospital.doctorState = req.body.doctorState;
      hospital.doctorPhone = req.body.doctorPhone;
      hospital.doctorEmail = req.body.doctorEmail;
      hospital.doctorUpload = req.body.doctorUpload;

      await hospital.save();

      const updatedHospital = await Hospital.findByPk(id);

      return res.status(200).json({
        message: 'Hospital updated successfully',
        hospital: updatedHospital,
      });
    } else {
      // For other users or vendors without write permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error during Hospital update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const get_hospital = async (req, res) => {
  try {
    const id = req.params.id; // Extract the hospitalId from the request parameters
    
    // Find the hospital by its primary key (hospitalId)
    const hospital = await Hospital.findByPk(id);

    if (!hospital) {
      // If hospital with the given hospitalId is not found, return a 404 response
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // If hospital is found, return it in the response
    return res.json({ hospital });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};//document
const view_document = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const readOnly = user.readOnly;

    if (userGroup === 'admin' || (userGroup === 'vendor' && readOnly)) {
      // For admin or vendors with read-only permission, fetch all documents with pagination
      let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
      let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

      // Calculate the offset based on the page and limit
      let offset = (page - 1) * limit;

      const result = await Document.findAndCountAll({
        offset,
        limit,
      });

      return res.status(200).json({
        documents: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        success: true,
      });
    } else {
      // For other users or vendors without read-only permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const create_document = async (req, res) => {
  const { documentType, hideExpiryDate } = req.body;

  try {
    const userId = req.user.id;
    console.log(userId);

    const user = await User.findByPk(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    console.log('User Group:', userGroup);

    if (userGroup === 'admin' || (userGroup === 'vendor' && user.writePermission)) {
      const newDocument = await Document.create({
        documentType,
        hideExpiryDate,
      });

      return res.json({ message: 'Document created successfully', document: newDocument });
    } else {
      return res.status(403).json({ message: 'You do not have permission to create a document' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const delete_document = async (req, res) => {
  const documentId = req.params.id;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.deletes;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with write permission, delete the document
      const deletedDocument = await Document.destroy({ where: { id: documentId } });

      if (deletedDocument > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Document not found', success: false });
      }
    } else {
      // For other users or vendors without write permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const update_document = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with write permission, update the document
      const document = await Document.findByPk(id);

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      document.documentType = req.body.documentType;
      document.hideExpiryDate = req.body.hideExpiryDate;

      await document.save();

      const updatedDocument = await Document.findByPk(id);

      return res.status(200).json({
        message: 'Document updated successfully',
        document: updatedDocument,
      });
    } else {
      // For other users or vendors without write permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error during Document update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const get_document = async (req, res) => {
  try {
    const id = req.params.id; // Extract the document ID from the request parameters
    console.log(id)
    // Find the document by its ID
    const document = await Document.findByPk(id);

    if (!document) {
      // If the document with the given ID is not found, return a 404 response
      return res.status(404).json({ error: 'Document not found' });
    }

    // If the document is found, return it in the response
    return res.json({ document });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
//Vendor
const view_vendor = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;

    if (userGroup === 'admin' || (userGroup === 'vendor' && user.readOnly)) {
      // For admin or vendors with readOnly permission, retrieve vendors
      const allVendors = await Vendor.findAll();
      return res.json({ vendors: allVendors });
    } else {
      // For other users, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to view vendors' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const create_vendor = async (req, res) => {
  const { vendorName, vendorAddress } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with write permission, create the vendor
      const newVendor = await Vendor.create({
        vendorName,
        vendorAddress,
      });

      return res.json({ message: 'Vendor created successfully', vendor: newVendor });
    } else {
      // For other users or vendors without write permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const delete_vendor = async (req, res) => {
  const vendorId = req.params.id;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.deletes;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with write permission, delete the vendor
      const deletedVendor = await Vendor.destroy({ where: { id: vendorId } });

      if (deletedVendor > 0) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Vendor not found', success: false });
      }
    } else {
      // For other users or vendors without write permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', success: false });
  }
};
const update_vendor = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;
    const writePermission = user.Write;

    if (userGroup === 'admin' || (userGroup === 'vendor' && writePermission)) {
      // For admin or vendors with write permission, update the vendor
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      vendor.vendorName = req.body.vendorName;
      vendor.vendorAddress = req.body.vendorAddress;

      await vendor.save();

      const updatedVendor = await Vendor.findByPk(id);

      return res.status(200).json({
        message: 'Vendor updated successfully',
        vendor: updatedVendor,
      });
    } else {
      // For other users or vendors without write permission, return a 403 Forbidden error
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error during Vendor update:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
//Crew Planner
const create_crewPlanner = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userGroup === 'admin' || (user.userGroup === 'vendor' && user.Write)) {
      const {
        rank,
        client,
        vesselType,
        vesselName,
        cocAccepted,
        trading,
        wages,
        doj,
        otherInfo,
        status,
        created_by,
      } = req.body;

      const newCrewPlanner = await CrewPlanner.create({
        rank,
        client,
        vesselType,
        vesselName,
        cocAccepted,
        trading,
        wages,
        doj,
        otherInfo,
        status,
        created_by
      });

      res.status(201).json(newCrewPlanner);
    } else {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error creating CrewPlanner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const updateCrewPlanner = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userGroup === 'admin' || (user.userGroup === 'vendor' && user.Write)) {
      const crewPlannerId = req.params.id;
      const {
        rank,
        client,
        vesselType,
        vesselName,
        cocAccepted,
        trading,
        wages,
        doj,
        otherInfo,
        status,
        updated_by
      } = req.body;

      const crewPlanner = await CrewPlanner.findByPk(crewPlannerId);

      if (!crewPlanner) {
        return res.status(404).json({ error: 'CrewPlanner not found' });
      }

      await crewPlanner.update({
        rank,
        client,
        vesselType,
        vesselName,
        cocAccepted,
        trading,
        wages,
        doj,
        otherInfo,
        status,
        updated_by
      });

      res.status(200).json(crewPlanner);
    } else {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error updating CrewPlanner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const delete_crewPlanner = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userGroup === 'admin' || (user.userGroup === 'vendor' && user.deletes)) {
      const crewPlannerId = req.params.id;
      const crewPlanner = await CrewPlanner.findByPk(crewPlannerId);

      if (!crewPlanner) {
        return res.status(404).json({ error: 'CrewPlanner not found' });
      }

      await crewPlanner.destroy();

      res.status(204).json();
    } else {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
  } catch (error) {
    console.error('Error deleting CrewPlanner:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// const view_crewPlanner = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id);

//     if (!user) {
//       console.log('User not found');
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userGroup = user.userGroup;

//     if (userGroup === 'admin' || (userGroup === 'vendor' && user.readOnly)) {
//       // For admin or vendors with readOnly permission, retrieve crew planners with pagination
//       let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
//       let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10
//       let offset = (page - 1) * limit; // Calculate the offset

//       const allCrewPlanners = await CrewPlanner.findAndCountAll({
//         offset,
//         limit,
//       });

//       return res.json({
//         crewplanners: allCrewPlanners.rows,
//         totalCount: allCrewPlanners.count,
//         totalPages: Math.ceil(allCrewPlanners.count / limit),
//         currentPage: page,
//       });
//     } else {
//       // For other users, return a 404 Not Found error
//       return res.status(404).json({ message: 'You do not have permission to view crew planners' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

//country
const view_crewPlanner = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userGroup = user.userGroup;

    if (userGroup === 'admin' || (userGroup === 'vendor' && user.readOnly)) {
      // For admin or vendors with readOnly permission, retrieve all crew planners
      const allCrewPlanners = await CrewPlanner.findAll();

      return res.json({
        crewplanners: allCrewPlanners,
        totalCount: allCrewPlanners.length,
        totalPages: 1, // Since there's no pagination, set totalPages to 1
        currentPage: 1, // Since there's no pagination, set currentPage to 1
      });
    } else {
      // For other users, return a 404 Not Found error
      return res.status(404).json({ message: 'You do not have permission to view crew planners' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const view_country =  async (req, res) => {
  try {
      const countryCodes = await Country.findAll();
      res.json({ countryCodes });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


const createQueries = async (req, res) => {
  try {
      const { categories, description, status, created_by } = req.body;

      const newQuery = await Queries.create({
          categories: categories,
          description: description,
          status: status,
          created_by: created_by ,
          created_date: new Date(),
          updated_at: null,
          reply: null // Assuming reply is initially null
      });

      return res.json({ message: 'Query created successfully', query: newQuery });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const editQueries = async (req, res) => {
  try {
    console.log('------------------HI')
    const userId = req.user.id;
    const id = req.params.id
    const { categories, description, status, reply } = req.body;
    console.log(id,userId , categories,description,status,reply)
    const user = await User.findByPk(userId);
    const userGroup = user ? user.userGroup : null;

    if (userGroup === 'admin') {
      // Update the query
      const [updatedRowsCount, updatedRows] = await Queries.update({
        categories: categories,
        description: description,
        status: status,
        reply: reply
      }, {
        where: { id: id },
        returning: true // Return the updated rows
      });

      if (updatedRowsCount === 0) {
        return res.status(404).json({ error: 'Query not found' });
      }

      return res.json({ message: 'Query updated successfully', query: updatedRows[0] });
    } else {
      return res.status(403).json({ error: 'Not Authorized! Contact admin' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const fetchQueries = async (req, res) => {
  try {
    // Assuming Queries is your model for queries
    const allQueries = await Queries.findAll();

    // Send the queries to the client side
    res.json(allQueries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 
const getVsls = async (req, res) => {
  try {
      // Fetch all vessel data
      const vessels = await VSL.findAll({
      });

      // Extract vessel names from the fetched data
     

      // Send the vessel names to the client
      res.json({vessels});
  } catch (error) {
      console.error('Error fetching vessel data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const getPortAgent = async (req, res) => {
  try {
      // Fetch all vessel data
      const portAgent = await PortAgent.findAll({
      });

      // Extract vessel names from the fetched data
     

      // Send the vessel names to the client
      res.json({portAgent});
  } catch (error) {
      console.error('Error fetching port data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


const getVessels = async (req, res) => {
  try {
      // Fetch all vessel data
      const vessels = await Vessel.findAll({
      });

      // Extract vessel names from the fetched data
     

      // Send the vessel names to the client
      res.json({vessels});
  } catch (error) {
      console.error('Error fetching vessel data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const getDocumentType = async(req,res)=>{
  try{
    const documents = await Document.findAll({
    
    })

    res.json({documents:documents})
  }
  catch(err){
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getGrades = async(req,res)=>{
  try{
    const grades = await Grade.findAll({
    
    })

    res.json({grades})
  }
  catch(err){
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



  module.exports = {
    create_vessel,
    create_VSL,
    create_exp,
    create_rank,
    create_grade,
    create_port,
    create_port_agent,
    create_hospital,
    create_document,
    create_vendor,
    view_vessel,
    view_VSL,
    view_experience,
    view_rank,
    view_grade,
    view_port,
    view_port_agent,
    view_hospital,
    view_document,
    view_vendor,
    delete_vessel,
    delete_VSL,
    delete_experience,
    delete_rank,
    delete_grade,
    delete_port,
    delete_port_agent,
    delete_hospital,
    delete_document,
    delete_vendor,
    update_vessel,
    update_VSL,
    update_experience,
    update_rank,
    update_grade,
    update_port,
    update_port_agent,
    update_hospital,
    update_document,
    update_vendor,
    view_country,
    create_crewPlanner,
    updateCrewPlanner,
    delete_crewPlanner,
    view_crewPlanner,
    get_experience,
    getVSL,
    getVessel,
    get_rank,
    get_grade,
    get_port,
    get_portagent,
    get_hospital,
    get_document,
    createQueries,
    editQueries,
    fetchQueries,
    get_experiences,
    get_gradeDrop,
    getVsls,
    view_ranks,
    getVessels,
    view_ports,
    view_medicals,
    getDocumentType,
    getPortAgent,
    getGrades
    
  }

  
