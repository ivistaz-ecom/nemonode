const Candidate = require("../models/candidate");
const CandidateNkd = require('../models/nkd');
const Vsl = require('../models/VSL')
const Medical= require('../models/medical') 
const Travel= require('../models/travel')
const Bank = require('../models/bank')
const Documents = require('../models/cdocument')
const Contract = require('../models/contract')
const Discussion_plus = require('../models/discussionplus')
const Discussion = require('../models/discussion')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database')
const {Op} = require('sequelize')
const validate = (inputString) => inputString !== undefined && inputString.length !== 0;
const SeaService = require('../models/seaservice')
const Calls = require('../models/todaysCalls')
const Evaluation = require('../models/evaluation')
const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const Company = require('../models/company')
const fs = require('fs').promises;
const Payslip = require('../models/payslip')
const prevExp = require('../models/prevexperience')

const add_candidate = async (req, res) => {
    try {
        console.log('works')
  const {
            active_details,
            area_code1,
            area_code2,
            avb_date,
            birth_place,
            boiler_suit_size,
            category,
            company_status,
            createdby,
            cr_date,
            cr_time,
            c_ad1,
            c_ad2,
            c_city,
            c_mobi1,
            c_mobi2,
            c_pin,
            c_rank,
            c_state,
            c_tel1,
            c_tel2,
            c_vessel,
            dob,
            editedby,
            email1,
            email2,
            experience,
            fname,
            grade,
            height,
            imp_discussion,
            indos_number,
            ipaddress,
            joined_date,
            last_company,
            last_salary,
            las_date,
            las_time,
            lname,
            l_country,
            mobile_code1,
            mobile_code2,
            m_status,
            nationality,
            other_mobile_code,
            other_numbers,
            photos,
            p_ad1,
            p_ad2,
            p_city,
            p_country,
            p_mobi1,
            p_mobi2,
            p_pin,
            p_rank,
            p_state,
            p_tel1,
            p_tel2,
            ref_check,
            resume,
            resume_upload_date,
            safety_shoe_size,
            skype,
            stcw,
            vendor_id,
            weight,
            work_nautilus,
            zone,
            group,
            vendor,
            password,
            us_visa,
            nemo_source,
        } = req.body;

        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        const userGroup = user.dataValues.userGroup
        const userClient = user.dataValues.userClient

        // Set vendor value based on userGroup
        let vendorValue =0;
        if (userGroup === 'admin') {
            vendorValue = 0;  // For admin, set vendor to 0
        } else {
            vendorValue = userClient;  // For others, set vendor to userClient
        }

        // Calculate age
        const calculateAge = (dob) => {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        const age = calculateAge(dob);
        if (age < 16) {
            return res.status(400).json({ message: "Candidate must be at least 16 years old", success: false });
        }

        // Check for existing data
        const query = `SELECT candidateId FROM Candidates WHERE (c_tel1='${c_tel1}' AND c_tel1!='') OR (c_mobi1='${c_mobi1}' AND c_mobi1!='') OR (email1='${email1}' AND email1!='')`;
        const existingCandidate = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        });

        if (existingCandidate.length>0) {
            return res.status(409).json({ message: "Duplicate Entry", success: false });
        }

        // If no duplicate, create a new entry
      const newCandidate = await Candidate.create({
                active_details,
                area_code1,
                area_code2,
                avb_date,
                birth_place,
                boiler_suit_size,
                category,
                company_status,
                createdby,
                cr_date,
                cr_time,
                c_ad1,
                c_ad2,
                c_city,
                c_mobi1,
                c_mobi2,
                c_pin,
                c_rank,
                c_state,
                c_tel1,
                c_tel2,
                c_vessel,
                dob,
                editedby,
                email1,
                email2,
                experience,
                fname,
                grade,
                height,
                imp_discussion,
                indos_number,
                ipaddress,
                joined_date,
                last_company,
                last_salary,
                las_date,
                las_time,
                lname,
                l_country,
                mobile_code1,
                mobile_code2,
                m_status,
                nationality,
                other_mobile_code,
                other_numbers,
                photos,
                p_ad1,
                p_ad2,
                p_city,
                p_country,
                p_mobi1,
                p_mobi2,
                p_pin,
                p_rank,
                p_state,
                p_tel1,
                p_tel2,
                ref_check,
                resume,
                resume_upload_date,
                safety_shoe_size,
                skype,
                stcw,
                vendor_id,
                weight,
                work_nautilus,
                zone,
                group,
                vendor : vendorValue,
                password,
                nemo_source: 'm',
                us_visa,
                userId: userId,

            });

        res.status(201).json({ message: "Successfully Created New Candidate!", success: true, candidateId: newCandidate.candidateId });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};


const getAllCandidates = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        const readOnly = user.dataValues.readOnly;
        const userGroup = user.dataValues.userGroup;
        console.log('User Group:', userGroup);

        let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
        let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10
        let offset = (page - 1) * limit; // Calculate the offset based on the page and limit

        let allCandidates;
        let totalCount;

        if (userGroup == 'admin') {
            // If the user is an admin, fetch all candidates with pagination
            allCandidates = await Candidate.findAll({
                include: [
                    { model: CandidateNkd },
                    { model: Medical },
                    { model: Travel },
                    { model: Bank },
                    { model: Documents },
                    { model: Contract },
                    { model: Discussion_plus },
                    // Add other associated models as needed
                ],
                offset,
                limit,
            });
            totalCount = await Candidate.count(); // Count all candidates without pagination
        } else if (userGroup == 'vendor' && readOnly) {
            // If the user is a vendor with read-only access, fetch candidates associated with the user with pagination
            allCandidates = await Candidate.findAll({
                where: {
                    userId: userId,
                },
                include: [
                    { model: CandidateNkd },
                    { model: Medical },
                    { model: Travel },
                    { model: Bank },
                    { model: Documents },
                    { model: Contract },
                    { model: Discussion_plus },
                    // Add other associated models as needed
                ],
                offset,
                limit,
            });
            totalCount = await Candidate.count({
                where: {
                    userId: userId,
                },
            }); // Count associated candidates without pagination
        } else {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        res.status(200).json({
            candidates: allCandidates,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const searchCandidates = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        const readOnly = user.dataValues.readOnly;
        const userGroup = user.dataValues.userGroup;
        console.log('User Group:', userGroup);

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        // Get the search input from the query
        const searchInput = req.query.search || '';

        if (!searchInput) {
            return res.status(400).json({ message: 'Search input is required', success: false });
        }

        let searchConditions = {
            where: {
                [Op.or]: [
                    { candidateId: { [Op.like]: `%${searchInput}%` } },
                    { name: { [Op.like]: `%${searchInput}%` } },
                    { email: { [Op.like]: `%${searchInput}%` } }
                ]
            },
            include: [
                { model: CandidateNkd },
                { model: Medical },
                { model: Travel },
                { model: Bank },
                { model: Documents },
                { model: Contract },
                { model: Discussion_plus },
            ],
            offset,
            limit,
        };

        let allCandidates;
        let totalCount;

        if (userGroup == 'admin') {
            // If the user is an admin, fetch all candidates based on search criteria with pagination
            allCandidates = await Candidate.findAll(searchConditions);
            totalCount = await Candidate.count({
                where: searchConditions.where
            });
        } else if (userGroup == 'vendor' && readOnly) {
            // If the user is a vendor with read-only access, fetch candidates associated with the user based on search criteria with pagination
            searchConditions.where.userId = userId;
            allCandidates = await Candidate.findAll(searchConditions);
            totalCount = await Candidate.count({
                where: {
                    ...searchConditions.where,
                    userId: userId,
                }
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        res.status(200).json({
            candidates: allCandidates,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};












const birthday = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        const readOnly = user.dataValues.readOnly;
        const userGroup = user.dataValues.userGroup;
        console.log('User Group:', userGroup);

        let whereCondition = {};
        // Check if a date is provided in the request query
        if (req.query.date) {
            // If date is provided, extract the day and month
            const selectedDate = new Date(req.query.date);
            const selectedMonth = selectedDate.getMonth();
            const selectedDay = selectedDate.getDate();

            // Set where condition to match day and month
            whereCondition = {
                [Op.and]: [
                    sequelize.where(sequelize.fn('month', sequelize.col('dob')), selectedMonth + 1), // Adding 1 because months are zero-indexed
                    sequelize.where(sequelize.fn('day', sequelize.col('dob')), selectedDay)
                ]
            };
        }

        let allCandidates;
        if (userGroup === 'admin') {
            allCandidates = await Candidate.findAll({
                attributes: ['fname', 'lname', 'c_rank', 'dob', 'candidateId', 'c_mobi1', 'email1'], // Fetch necessary attributes
                where: whereCondition, // Apply filter condition
                order: [['dob', 'ASC']] // Order by date of birth in ascending order
            });
        } else if (userGroup === 'vendor' && readOnly) {
            // For vendor, apply additional condition based on userId
            allCandidates = await Candidate.findAll({
                where: { userId: userId, ...whereCondition }, // Apply filter condition
                attributes: ['fname', 'lname', 'c_rank', 'dob', 'candidateId', 'c_mobi1', 'email1'], // Fetch necessary attributes
                order: [['dob', 'ASC']] // Order by date of birth in ascending order
            });
        }

        res.status(200).json({
            candidates: allCandidates,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const new_profile = async (req, res) => {
    try {
        const userId = req.body.id;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const selectedFields = req.body.selectedFields;

        let query = `
            SELECT * FROM Candidates 
            WHERE cr_date BETWEEN :startDate AND :endDate
        `;
        let replacements = { startDate, endDate };

        if (userId) {
            query += ' AND createdBy = :userId';
            replacements.userId = userId;
        }

        const allCandidates = await Candidate.sequelize.query(query, {
            replacements,
            type: Candidate.sequelize.QueryTypes.SELECT,
        });

        const filteredCandidates = allCandidates.map(candidate => {
            const filteredCandidate = {};
            for (const field in candidate) {
                if (selectedFields[field]) {
                    filteredCandidate[field] = candidate[field];
                }
            }
            return filteredCandidate;
        });

        res.status(200).json({
            candidates: filteredCandidates,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};










const contract = async (req, res) => {
    try {
        const userId = req.user.id;
        let userGroup;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        userGroup = user.dataValues.userGroup;
        let reports = user.dataValues.reports;
        console.log('User Group:', userGroup);
        
        // Check if the user is authorized to access contract data
        if (userGroup !== 'admin' && userGroup !== 'vendor') {
            return res.status(403).json({ message: 'Unauthorized', success: false });
        }

        let allContracts;
        if (userGroup === 'admin') {
            // If the user is an admin, fetch all contracts
            allContracts = await Contract.findAll();
        } else if (userGroup === 'vendor' && reports) {
            // If the user is a vendor, fetch contracts associated with the user
            allContracts = await Contract.findAll({
                where: {
                    created_by: userId,
                }
            });
        }

        // Map the contracts to include only selected fields
        const selectedFields = req.body.selectedFields;
        const filteredContracts = allContracts.map(contract => {
            const filteredContract = {};
            Object.keys(selectedFields).forEach(field => {
                if (selectedFields[field]) {
                    filteredContract[field] = contract.dataValues[field];
                }
            });
            return filteredContract;
        });

        res.status(200).json({
            contracts: filteredContracts,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};





const get_candidate = async (req, res) => {
    try {
        const candidateId = req.params.id;

        // Fetch candidate data from the database based on the ID
        const candidate = await Candidate.findOne({
            where: { candidateId },
            include: [
                { model: CandidateNkd },
                { model: Medical },
                { model: Travel },
                { model: Bank },
                { model: Documents },
                { model: Contract },
                { model: Discussion_plus },
                
                // Add other associated models as needed
            ],
        });

        if (!candidate) {
            // If no candidate found with the specified ID, return a 404 response
            return res.status(404).json({ message: 'Candidate not found', success: false });
        }

        // Send the candidate data to the client side
        res.status(200).json({ candidate, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: 'Internal Server Error', success: false });
    }
};







const add_kindetails = async (req, res) => {
    try {
        const candidateId = req.params.id;


        // Destructure the data from the request body
        const {
            kin_name,
            kin_relation,
            kin_contact_number,
            kin_contact_address,
            kin_priority
        } = req.body;

        // Validate required fields
        if (!validate(kin_name) || !validate(kin_relation) || !validate(kin_contact_number)) {
            return res.status(400).json({ message: "Bad Parameters", success: false });
        }

        // Create a new NKD entry
        await CandidateNkd.create({
            kin_name,
            kin_relation,
            kin_contact_number,
            kin_contact_address,
            kin_priority,
            candidateId: candidateId // Assuming you have a foreign key 'user_id' in your CandidateNkd model
        });

        res.status(201).json({ message: "Successfully Created New NKD Entry!", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const createSeaService = async (req, res) => {
    try {
      const candidateId = req.params.id;
  
      // Destructure the data from the request body
      const {
        company,
        rank,
        vessel,
        type,
        DWT,
        from1, // Assuming this is a date string
        to1, // Assuming this is a date string
        total_MMDD,
        reason_for_sign_off,
        createdBy,
      } = req.body;
  
      // Validate required fields (adjust as needed)
      if (!company || !rank || !vessel || !type || !DWT || !from1 || !to1 || !total_MMDD || !reason_for_sign_off || !createdBy) {
        return res.status(400).json({ message: "Bad Parameters", success: false });
      }
  
      // Parse dates if needed (assuming from1 and to1 are strings)
      const parsedFrom1 = new Date(from1);
      const parsedTo1 = new Date(to1);
  
      // Create a new sea service entry
      await SeaService.create({
        candidateId,
        company,
        rank,
        vessel,
        type,
        DWT,
        from1: parsedFrom1, // Use parsed date if necessary
        to1: parsedTo1, // Use parsed date if necessary
        total_MMDD,
        reason_for_sign_off,
        createdBy,
      });
  
      res.status(201).json({ message: "Successfully Created New Sea Service Entry!", success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
  };
  
  const editSeaService = async (req, res) => {
    const seaServiceId = req.params.id;
    const seaServiceDetails = req.body;

    try {
        const [updatedRows] = await SeaService.update(seaServiceDetails, {
            where: { id: seaServiceId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Sea Service not found' });
        }

        const updatedSeaService = await SeaService.findOne({ where: { id: seaServiceId } });

        res.json(updatedSeaService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getAllSeaService = async (req, res) => {
    try {
        const id = req.params.id;
        const seaServices = await SeaService.findAll(
            {
                where:{candidateId:id}
            }
        );
        res.json(seaServices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getSea = async (req, res) => {
    try {
        const id = req.params.id;
        const sea = await SeaService.findAll({
            where: {
                id: id
            }
        });
        res.status(200).json({
            editSea: sea,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const deleteSeaService = async (req, res) => {
    const seaServiceId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the sea service
        const deletedRows = await SeaService.destroy({
            where: { id: seaServiceId }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Sea Service not found' });
        }

        res.json({ message: 'Sea Service deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};





  // Assuming you have a SeaService model defined elsewhere in your project 
  

const add_hospitaldetails = async (req, res) => {
    try {
        const candidateId = req.params.id;

        // Destructure the data from the request body
        const {
            hospitalName,
            place,
            date,
            expiry_date,
            done_by,
            status,
            amount,
            upload,
            created_by
        } = req.body;
        console.log(hospitalName)
        // Validate required fields
        if (!validate(hospitalName) || !validate(date) || !validate(done_by)) {
            return res.status(400).json({ message: "Bad Parameters", success: false });
        }

        // Create a new hospital entry
        await Medical.create({
            hospitalName,
            place,
            date,
            expiry_date,
            done_by,
            status,
            amount,
            upload,
            candidateId:candidateId,
            created_by
            // Assuming you have a foreign key 'user_id' in your HospitalDetails model
        });

        res.status(201).json({ message: "Successfully Created New Hospital Details Entry!", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const add_traveldetails = async (req, res) => {
    try {
        const candidateId = req.params.id;


        // Destructure the data from the request body
        const {
            travel_date,
            travel_from,
            travel_to,
            travel_mode,
            travel_status,
            ticket_number,
            agent_name,
            portAgent,
            travel_amount,
            reason,
            created_by
        } = req.body;

        // Validate required fields
        if (!validate(travel_date) || !validate(travel_from) || !validate(travel_to) || !validate(travel_mode)) {
            return res.status(400).json({ message: "Bad Parameters", success: false });
        }

        // Create a new travel entry
        await Travel.create({
      travel_date,
    travel_from,
          travel_to,
          travel_mode,
            travel_status,
    ticket_number,
      agent_name,
          portAgent,
    travel_amount,
    reason,
    created_by,
            candidateId:candidateId // Assuming you have a foreign key 'user_id' in your Travel model
        });

        res.status(201).json({ message: "Successfully Created New Travel Details Entry!", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const add_bankdetails = async (req, res) => {
    try {
        const candidateId = req.params.id;

        // Destructure data from the request body
        const {
            bankName,
            accountNumber,
            bankAddress,
            ifscCode,
            swiftCode,
            beneficiary,
            address,
            panNumber,
            panCardFile,
            passbookFile,
            branch,
            types,
            created_by
        } = req.body;

        // Validate required fields
        if (!bankName || !accountNumber || !bankAddress || !ifscCode || !swiftCode || !beneficiary || !address || !panNumber) {
            return res.status(400).json({ message: "Bad Parameters", success: false });
        }

        // Check the number of existing bank records for the candidate
        const bankRecordsCount = await Bank.count({
            where: { candidateId: candidateId }
        });

        if (bankRecordsCount >= 2) {
            return res.status(400).json({ message: "Each candidate can only have a maximum of 2 bank records.", success: false });
        }

        // Create a new BankDetails entry
        const bankDetails = await Bank.create({
            bank_name: bankName,
            account_num: accountNumber,
            bank_addr: bankAddress,
            ifsc_code: ifscCode,
            swift_code: swiftCode,
            beneficiary,
            beneficiary_addr: address,
            pan_num: panNumber,
            pan_card: panCardFile,
            passbook: passbookFile,
            // NRI Bank Details
            branch: branch,
            types: types,
            created_by: created_by,
            candidateId: candidateId // Assuming you have a foreign key 'candidateId' in your BankDetails model
        });

        // Save the updated BankDetails entry
        await bankDetails.save();

        res.status(201).json({ message: "Successfully Created New Bank Details Entry!", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};



const add_documentdetails = async (req, res) => {
    try {
        const candidateId = req.params.id;
        console.log(candidateId)

        // Destructure the data from the request body
        const {
            document,
            document_number,
            issue_date,
            expiry_date,
            issue_place,
            document_files,
            stcw
        } = req.body;

        // Validate required fields
        if (!validate(document) || !validate(document_number) || !validate(issue_date)) {
            return res.status(400).json({ message: "Bad Parameters", success: false });
        }

        // Create a new DocumentDetails entry
        await Documents.create({
            document: document,
            document_number: document_number,
            issue_date: issue_date,
            expiry_date:expiry_date,
            issue_place: issue_place,
            document_files: document_files,
            stcw: stcw,
            candidateId: candidateId // Assuming you have a foreign key 'user_id' in your DocumentDetails model
        });

        res.status(201).json({ message: "Successfully Created New Document Details Entry!", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};


const add_contractdetails = async (req, res) => {
    try {
        // Extract user ID from the authenticated user
        const candidateId = req.params.id;

        // Extract data from the request body
        const {
            rank,
            company,
            vslName,
            vesselType,
            signOnPort,
            signOn,
            wageStart,
            eoc,
            wages,
            currency,
            wagesType,
            signOff,
            signOffPort,
            reasonForSignOff,
            documentFile,
            aoaNumber,
            emigrateNumber,
            aoaFile,
            created_by,
            openingBalance,
            basicWages,
            leaveWages,
            overtimeWages,
            leaveSubsistence,
            consolidateAllowance,
            fixedOvertime,
            subsistenceAllowance,
            uniformAllowance,
            miscAllowance,
            otherAllowance,
            onboardOtWages,
            joiningBasic,
            tankCleaningBonus,
            additionalWorks,
            prevMonthBalance,
            reimbursement,
            radio,
            onboardFinalSettlement,
            otherDeductions,
            training,
            bondStore,
            cdc_passport,
        } = req.body;

        // Create a new ContractDetails entry
        const contractDetails = await Contract.create({
            rank,
            company,
            vslName,
            vesselType,
            sign_on_port:signOnPort,
            sign_on:signOn,
            wage_start:wageStart,
            eoc,
            wages,
            currency,
            wages_types:wagesType,
            sign_off:signOff,
            sign_off_port:signOffPort,
            reason_for_sign_off:reasonForSignOff,
            documents:documentFile,
            aoa:aoaFile,
            aoa_number:aoaNumber,
            emigrate_number:emigrateNumber,
            created_by:created_by,
            candidateId: candidateId, // Assuming you have a foreign key 'user_id' in your ContractDetails model,
            openingBalance,
            basicWages,
            leaveWages,
            overtimeWages,
            leaveSubsistence,
            consolidateAllowance,
            fixedOvertime,
            subsistenceAllowance,
            uniformAllowance,
            miscAllowance,
            otherAllowance,
            onboardOtWages,
            joiningBasic,
            tankCleaningBonus,
            additionalWorks,
            prevMonthBalance,
            reimbursement,
            radio,
            onboardFinalSettlement,
            otherDeductions,
            training,
            bondStore,
            cdc_passport:cdc_passport
        });

    
        // Save the updated ContractDetails entry
        await contractDetails.save();

        res.status(201).json({ message: "Successfully Created New Contract Details Entry!", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const add_discussiondetails= async (req, res) => {
    try {
        const candidateId = req.params.id;
        // Extract data from the request body
        const {
            userId,
            userName,
            discussion_date,
            ntbr
        } = req.body;

        // Validate required fields
        // if (!rank || !vessel_type || !status) {
        //     return res.status(400).json({ message: 'Bad Parameters', success: false });
        // }

        // Create a new Discussion entry
        const discussionEntry = await Discussion.create({
            userId,
            userName,
            discussion_date,
            ntbr,
            candidateId:candidateId
        });

        // Send a success response
        res.status(201).json({ message: 'Successfully Created New Discussion Entry!', success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: 'Internal Server Error', success: false });
    }
};



const add_discussionplusdetails = async (req, res) => {
    try {
        // Extract data from the request body
        const { companyname, join_date, discussion, reason, post_by, reminder, r_date, created_date } = req.body;
        console.log("Reason",reason)
        const candidateId = req.params.id;

        // Ensure default values for optional fields
        const discussionStatus = discussion || null;
        const validCompanyName = companyname || null; // Handle null or empty string

        // Create a new discussion entry in the database
        const newDiscussion = await Discussion.create({
            companyname: validCompanyName, // Assign the validated companyname
            join_date: join_date || null, // Handle other fields similarly
            discussion: discussionStatus,
            reason: reason || null,
            post_by: post_by || null,
            reminder: reminder || false,
            r_date: r_date || null,
            created_date: created_date || new Date(),
            candidateId: candidateId // Assuming candidateId is a field in your discussion table
        });

        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



const updateOrCreateCandidateFromVerloop = async (req, res) => {
    try {
        // Fetch candidate data from the request body
        const verloopData = req.body;
        
        // Check for existing candidates with the same emailid
        const existingCandidates = await Candidate.findAll({
            where: { email1: verloopData.emailid }
        });

        if (existingCandidates.length > 0) {
            // There are duplicates, find the candidate with the highest ID
            const candidateWithHighestId = existingCandidates.reduce((prev, current) => {
                return (prev.candidateId > current.candidateId) ? prev : current;
            });

            // Update the candidate with the highest ID
            await candidateWithHighestId.update({
                fname: verloopData.name,
                c_mobi1: verloopData.phonenumber,
                // helpwith: verloopData.helpwith,
                c_rank: verloopData.position,
                email1: verloopData.emailid,
                c_vessel: verloopData.shipsailed,
                joined_date: verloopData.expectedjoiningdate,
                nemo_source: 'c',
                us_visa: 0,

            });
            res.status(200).json({ message: 'Candidate updated successfully' });
        } else {
            // No duplicates, create a new candidate
            await Candidate.create({
                fname: verloopData.name,
                c_mobi1: verloopData.phonenumber,
                // helpwith: verloopData.helpwith,
                c_rank: verloopData.position,
                email1: verloopData.emailid,
                c_vessel: verloopData.shipsailed,
                joined_date: verloopData.expectedjoiningdate,
                nemo_source: 'c'

            });
            res.status(201).json({ message: 'Candidate created successfully' });
        }
    } catch (error) {
        console.error('Error updating/creating candidate:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


;

  
  






const edit_candidate=  async (req, res) => {
    const candidateId = req.params.id;
    const candidateDetails = req.body;
    console.log
    try {
        const [updatedRows] = await Candidate.update(candidateDetails, {
            where: { candidateId: candidateId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const updatedCandidate = await Candidate.findOne({ where: { candidateId: candidateId } });

        res.json(updatedCandidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateCandidateFields = async (req, res) => {
    const candidateId = req.params.id;
    const { basicCommentsValue, referenceCheckText } = req.body;

    try {
        const candidateDetails = {};

        // If special comment is provided, update imp_discussion field
        if (basicCommentsValue !== undefined) {
            candidateDetails.imp_discussion = basicCommentsValue;
        }

        // If reference check is provided, update ref_check field
        if (referenceCheckText !== undefined) {
            candidateDetails.ref_check = referenceCheckText;
        }

        if (Object.keys(candidateDetails).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const [updatedRows] = await Candidate.update(candidateDetails, {
            where: { candidateId: candidateId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const updatedCandidate = await Candidate.findOne({ where: { candidateId: candidateId } });

        res.json(updatedCandidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

  
const delete_candidate = async (req, res) => {
    const candidateId = req.params.id;

    console.log('>>>>', candidateId);
    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let userGroup = user.dataValues.userGroup;
        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the candidate
        const deletedCandidate = await Candidate.destroy({
            where: { candidateId: candidateId }, // Assuming candidateId is the primary key
        });

        if (deletedCandidate === 0) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const get_contractdetails= async (req, res) => {
    try {
        const candidateId = req.params.id;
        console.log(':::::>>>>>',candidateId)
        const contractDetails = await Contract.findAll({
            where: { candidateId: candidateId }
        });

        res.status(200).json(contractDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const update_contractdetails = async (req, res) => {
    const contractId = req.params.id;
    const updatedContractData = req.body;

    try {
        const contract = await Contract.findByPk(contractId);

        if (contract) {
            // Update fields
            contract.rank = updatedContractData.rank;
            contract.company = updatedContractData.company;
            contract.vslName = updatedContractData.vslName;
            contract.vesselType = updatedContractData.vesselType;
            contract.sign_on_port = updatedContractData.signOnPort;
            contract.sign_on = updatedContractData.signOnDate;
            contract.wage_start = updatedContractData.wagesStart;
            contract.eoc = updatedContractData.eoc;
            contract.wages = updatedContractData.wages;
            contract.currency = updatedContractData.currency;
            contract.wages_types = updatedContractData.wagesType;
            contract.sign_off_port = updatedContractData.signOffPort;
            contract.sign_off = updatedContractData.signOffDate;
            contract.reason_for_sign_off = updatedContractData.reasonForSignOff;
            contract.aoa_number = updatedContractData.aoaNum;
            contract.emigrate_number = updatedContractData.emigrateNumber;
            contract.created_by = updatedContractData.created_by;
            contract.openingBalance= updatedContractData.openingBalance
            contract.basicWages =updatedContractData.basicWages
            contract.leaveWages=updatedContractData.leaveWages
            contract.overtimeWages=updatedContractData.overtimeWages
            contract.leaveSubsistence=updatedContractData.leaveSubsistence
            contract.consolidateAllowance=updatedContractData.consolidateAllowance
            contract.fixedOvertime=updatedContractData.fixedOvertime
            contract.subsistenceAllowance=updatedContractData.subsistenceAllowance
            contract.uniformAllowance=updatedContractData.uniformAllowance
            contract.miscAllowance=updatedContractData.miscAllowance
            contract.otherAllowance=updatedContractData.otherAllowance
            contract.onboardOtWages=updatedContractData.onboardOtWages
            contract.joiningBasic=updatedContractData.joiningBasic
            contract.tankCleaningBonus=updatedContractData.tankCleaningBonus
            contract.additionalWorks=updatedContractData.additionalWorks
            contract.prevMonthBalance=updatedContractData.prevMonthBalance
            contract.reimbursement=updatedContractData.reimbursement
            contract.radio=updatedContractData.radio
            contract.onboardFinalSettlement=updatedContractData.onboardFinalSettlement
            contract.otherDeductions=updatedContractData.otherDeductions
            contract.training=updatedContractData.training
            contract.bondStore=updatedContractData.bondStore
            contract.cdc_passport=updatedContractData.cdc_passport

            // Conditionally update the documents and aoa fields
            if (updatedContractData.documentFile) {
                contract.documents = updatedContractData.documentFile; // Assuming 'documents' is a file path or something similar
            }
            if (updatedContractData.aoaFile) {
                contract.aoa = updatedContractData.aoaFile; // Assuming 'aoa' is a file path or something similar
            }

            // Save the changes
            await contract.save();

            res.json({ success: true, message: 'Contract updated successfully', updatedContract: contract });
        } else {
            res.status(404).json({ success: false, message: 'Contract not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating contract' });
    }
};


const get_discussiondetails=async (req, res) => {
    try {
        const candidateId = req.params.id;
        const discussions = await Discussion.findAll({ where: { candidateId: candidateId } });
        res.status(200).json({ discussions: discussions });
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
}



const get_documentdetails = async (req, res) => {
    try {
        const candidateId = req.params.id;
        console.log(':::::>>>>>', candidateId);
        
        // Assuming you have a Document model
        const documentDetails = await Documents.findAll({
            where: { candidateId: candidateId }
        });

        res.status(200).json(documentDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const get_BankDetails = async (req, res) => {
    try {
        const candidateId = req.params.id;
        const bankDetails = await Bank.findAll({
            where: { candidateId: candidateId }
        });

        res.status(200).json(bankDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const update_BankDetails = async (req, res) => {
    try {
        const candidateId = req.params.id;
        const updatedFields = req.body;

        // Find the bank record by candidateId
        const bank = await Bank.findOne({
            where: { id: candidateId },
        });

        // If the bank record exists, update the fields
        if (bank) {
            await bank.update(updatedFields);
            res.status(200).json({ message: 'Bank details updated successfully' });
        } else {
            res.status(404).json({ message: 'Bank record not found' });
        }
    } catch (err) {
        console.error('Error updating bank details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const get_TravelDetails = async (req, res) => {
    try {
        const candidateId = req.params.id;
        const travelDetails = await Travel.findAll({
            where: { candidateId: candidateId }
        });

        res.status(200).json(travelDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};
const update_TravelDetails = async (req, res) => {
    try {
        const travelId = req.params.id;
        const updatedFields = req.body;

        // Find the travel record by travelId
        const travel = await Travel.findOne({
            where: { id: travelId },
        });

        // If the travel record exists, update the fields
        if (travel) {
            await travel.update(updatedFields);
            res.status(200).json({ message: 'Travel details updated successfully' });
        } else {
            res.status(404).json({ message: 'Travel record not found' });
        }
    } catch (err) {
        console.error('Error updating travel details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const get_HospitalDetails = async (req, res) => {
    try {
        const candidateId = req.params.id;
        const hospitalDetails = await Medical.findAll({
            where: { candidateId: candidateId }
        });

        res.status(200).json(hospitalDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const get_NKDDetails = async (req, res) => {
    try {
        const candidateId = req.params.id;
        const nkdDetails = await CandidateNkd.findAll({
            where: { candidateId: candidateId }
        });

        res.status(200).json(nkdDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const update_HospitalDetails = async (req, res) => {
    try {
        const memId = req.params.id;
        const updatedFields = req.body;

        // Find the hospital record by memId
        const hospital = await Medical.findOne({
            where: { id: memId },
        });

        if (hospital) {
            // Conditionally update the 'upload' field if it exists in the request body
            if (updatedFields.upload) {
                hospital.upload = updatedFields.upload;
            }

            // Update other fields directly
            hospital.hospitalName = updatedFields.hospitalName;
            hospital.place = updatedFields.place;
            hospital.date = updatedFields.date;
            hospital.expiry_date = updatedFields.expiry_date;
            hospital.done_by = updatedFields.done_by;
            hospital.status = updatedFields.status;
            hospital.amount = updatedFields.amount;
            hospital.created_by = updatedFields.created_by;

            // Save the updated instance to the database
            await hospital.save();

            res.status(200).json({ message: 'Hospital details updated successfully' });
        } else {
            res.status(404).json({ message: 'Hospital record not found' });
        }
    } catch (err) {
        console.error('Error updating hospital details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const update_NKDDetails = async (req, res) => {
    try {
        const memId = req.params.id;
        const updatedFields = req.body;

        console.log('Received data:', updatedFields); // Log the received data

        // Find the NKD record by memId
        const nkdRecord = await CandidateNkd.findOne({
            where: { id: memId },
        });

        // If the NKD record exists, update the fields
        if (nkdRecord) {
            await nkdRecord.update(updatedFields);
            res.status(200).json({ message: 'NKD details updated successfully' });
        } else {
            res.status(404).json({ message: 'NKD record not found' });
        }
    } catch (err) {
        console.error('Error updating NKD details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const update_documentdetails = async (req, res) => {
    try {
        const documentId = req.params.id; // Assuming the documentId is used to identify the document record
        const updatedFields = req.body;

        console.log('Received data:', updatedFields); // Log the received data

        // Find the document record by documentId
        const documentRecord = await Documents.findOne({
            where: { id: documentId },
        });

        // If the document record exists, update the fields
        if (documentRecord) {
            await documentRecord.update(updatedFields);
            res.status(200).json({ message: 'Document details updated successfully' });
        } else {
            res.status(404).json({ message: 'Document record not found' });
        }
    } catch (err) {
        console.error('Error updating document details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const generateAccessToken = (id, indosNumber,fname) => {
    return jwt.sign({ candidateId: id, indosNumber: indosNumber,fname:fname }, 'secretkey');
  };
  
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find the candidate with the provided email
        const candidate = await Candidate.findOne({ where: { email1: email } });

        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }

        // Compare the provided password with the stored hashed password in the database
        const passwordMatch = await bcrypt.compare(password, candidate.password);
        
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid credentials' });
        }

        // Password is correct, generate JWT token
        const token = generateAccessToken(candidate.candidateId, candidate.indos_number, candidate.fname);
        console.log(token);

        return res.status(200).json({
            success: true,
            message: 'Candidate Logged in Successfully',
            token: token,
            candidateId: candidate.candidateId,
            fname: candidate.fname,
            // Include other candidate-related data as needed
        });
    } catch (err) {
        console.error('Error during candidate login:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


  

  // candidateControllers.js

// ... (previous code)
const delete_NKD = async (req, res) => {
    const nkdId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the NKD entry
        const deletedNKD = await NKD.destroy({
            where: { id: nkdId },
        });

        if (deletedNKD === 0) {
            return res.status(404).json({ message: 'NKD entry not found' });
        }

        res.json({ success: true, message: 'NKD entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting NKD entry' });
    }
};


const delete_Hospital = async (req, res) => {
    const hospitalId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the hospital entry
        const deletedHospital = await Medical.destroy({
            where: { id: hospitalId },
        });

        if (deletedHospital === 0) {
            return res.status(404).json({ message: 'Hospital entry not found' });
        }

        res.json({ success: true, message: 'Hospital entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting hospital entry' });
    }
};

const delete_Travel = async (req, res) => {
    const travelId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the travel entry
        const deletedTravel = await Travel.destroy({
            where: { id: travelId },
        });

        if (deletedTravel === 0) {
            return res.status(404).json({ message: 'Travel entry not found' });
        }

        res.json({ success: true, message: 'Travel entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting travel entry' });
    }
};

const delete_Medical = async (req, res) => {
    const medicalId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the medical entry
        const deletedMedical = await Medical.destroy({
            where: { id: medicalId },
        });

        if (deletedMedical === 0) {
            return res.status(404).json({ message: 'Medical entry not found' });
        }

        res.json({ success: true, message: 'Medical entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting medical entry' });
    }
};


// Implement other delete operations in a similar manner


const delete_Bank = async (req, res) => {
    const bankId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the bank details
        const deletedBank = await Bank.destroy({
            where: { id: bankId },
        });

        if (deletedBank === 0) {
            return res.status(404).json({ message: 'Bank details not found' });
        }

        res.json({ success: true, message: 'Bank details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting bank details' });
    }
};


const delete_Document = async (req, res) => {
    const documentId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the document
        const deletedDocument = await Documents.destroy({
            where: { id: documentId },
        });

        if (deletedDocument === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json({ success: true, message: 'Document details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting document details' });
    }
};


const delete_contract = async (req, res) => {
    const contractId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the contract details
        const deletedContract = await Contract.destroy({
            where: { id: contractId },
        });

        if (deletedContract === 0) {
            return res.status(404).json({ message: 'Contract details not found' });
        }

        res.json({ success: true, message: 'Contract details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting contract details' });
    }
};



const delete_discussionplus = async (req, res) => {
    const discussionplusId = req.params.id;

    try {
        const user = await User.findByPk(req.user.id); // Assuming you have the user ID in req.user.id
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let deletePer = user.dataValues.deletes;

        // Check if the user has delete permissions
        if (deletePer !== true) {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        // Delete the discussion plus details
        const deletedDiscussionPlus = await Discussion_plus.destroy({
            where: { id: discussionplusId },
        });

        if (deletedDiscussionPlus === 0) {
            return res.status(404).json({ message: 'Discussion plus details not found' });
        }

        res.json({ success: true, message: 'Discussion plus details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting discussion plus details' });
    }
};


const reportAll = async(req,res)=>{
    const id = req.params.id;
    try{
        const user = await User.findByPk(id)
        console.log("hello",user)
        let reportAccess = user.dataValues.reports_all
        let userGroup = user.dataValues.userGroup
        let allCandidates;
        if (userGroup === 'admin') {
            // If the user is an admin, fetch all candidates with pagination
            allCandidates = await Candidate.findAll()
        } else if(userGroup==='vendor' && reportAccess){
            // If the user is not an admin, fetch candidates associated with the user with pagination
            allCandidates = await Candidate.findAll({
                where: {
                    userId: id,
                },
            });
        }
       

        res.status(200).json({
            candidates: allCandidates,
            success: true
        });
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({success:false,message:'Not Authorized, Contact Administrator'})
    }
}
const checkExpiry = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userGroup = user.userGroup;
        const readOnly = user.readOnly;

        const { date } = req.query;

        const options = {
            order: [['expiry_date', 'ASC']],
            where: {} // Initialize where condition object
        };

        // Filter out documents with null expiry_date
        options.where.expiry_date = {
            [Op.ne]: null
        };

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);

            // Merge date condition with existing conditions
            options.where.expiry_date[Op.gte] = startDate;
            options.where.expiry_date[Op.lt] = endDate;
        }

        if (userGroup === 'admin') {
            const expiringSoonDocuments = await Documents.findAll(options);
            return res.status(200).json(expiringSoonDocuments);
        } else if (userGroup === 'vendor' && readOnly) {
            const candidates = await Candidate.findAll({
                where: { userId: userId }
            });
            const candidateIds = candidates.map(candidate => candidate.dataValues.candidateId);

            const documents = [];

            for (const candidateId of candidateIds) {
                const candidateDocuments = await Documents.findAll({
                    where: {
                        candidateId: candidateId,
                        ...options.where // Include other conditions
                    }
                });
                documents.push(...candidateDocuments);
            }

            return res.status(200).json(documents);
        } else {
            return res.status(403).json({ error: 'Forbidden' });
        }
    } catch (error) {
        console.error('Error checking expiry dates:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};











//   const Reminder = async (req, res) => {
//     try {
//         const currentDate = new Date();
//         let whereCondition = {};

//         // Check if a date is provided in the query parameters
//         if (req.query.date) {
//             // If date is provided, filter reminders based on that date
//             const selectedDate = new Date(req.query.date);
//             whereCondition.reminder_date = { [Op.eq]: selectedDate};
//         } else {
//             // If no date is provided, filter reminders based on today's date
//             const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
//             const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 30);
//             whereCondition.reminder_date = { [Op.gte]: startDate, [Op.lt]: endDate };
//         }

//         const discussionRanks = await Discussion_plus.findAll({
//             where: whereCondition,
//             order: [['reminder_date', 'ASC']] // Order by reminder_date in descending order
//         });

//         res.status(200).json({
//             discussionRanks: discussionRanks,
//             success: true
//         });
//     } catch (error) {
//         console.error('Error fetching discussion ranks:', error);
//         res.status(500).json({ error: 'Internal server error', success: false });
//     }
// };


const Reminder = async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;

        // Check if both startDate and endDate are provided
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Both startDate and endDate are required.',
            });
        }

        // Base SQL query
        let query = `
            SELECT a.discussion, a.candidateId, a.r_date, b.userName, c.c_rank, c.c_vessel
            FROM discussion AS a
            JOIN Users AS b ON a.post_by = b.id
            JOIN Candidates AS c ON a.candidateId = c.candidateId
            
            WHERE a.reminder = '1'
              AND a.r_date BETWEEN :startDate AND :endDate
        `;

        // Define replacements object
        const replacements = { startDate, endDate };

        // Add category condition if present
        if (category) {
            query += ` AND c.category = :category`;
            replacements.category = category;
        }

        // Complete the query with order by clauses
       

        // Run the raw SQL query using sequelize.query
        const discussions = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        // If there are discussions with reminders, send them to the client
        if (discussions.length > 0) {
            res.json({ success: true, discussions });
        } else {
            res.json({ success: false, message: 'No discussions with reminders found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


  







const getStatusData = async (req, res) => {
    try {
        const currentTime = new Date();
        const startOfDay = new Date(currentTime);
        startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of the current day

        // Fetch discussions created today based on their status
        const Proposed = await Discussion.findAll({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, currentTime] // Filter discussions created today
                },
                discussion: { [Op.like]: '%Proposed%' } // Filter discussions with status "Proposed"
            },
            raw: true
        });

        const Approved = await Discussion.findAll({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, currentTime] // Filter discussions created today
                },
                discussion: { [Op.like]: '%Approved%' } // Filter discussions with status "Approved"
            },
            raw: true
        });

        const Joined = await Discussion.findAll({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, currentTime] // Filter discussions created today
                },
                discussion: { [Op.like]: '%Joined%' } // Filter discussions with status "Joined"
            },
            raw: true
        });

        const Rejected = await Discussion.findAll({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, currentTime] // Filter discussions created today
                },
                discussion: { [Op.like]: '%Rejected%' } // Filter discussions with status "Rejected"
            },
            raw: true
        });

        // Send the discussions data for each status separately as a JSON response
        res.json({ 
            Proposed, 
            Approved, 
            Joined, 
            Rejected 
        });
    } catch (error) {
        console.error('Error fetching today\'s discussions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; 
const getStatusDate = async (req, res) => {
    try {
        const { companyName, startDate, endDate } = req.query;
        console.log(companyName,startDate,endDate)
        // Convert start and end dates to Date objects
        const startOfDay = new Date(startDate);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999); // Set end time to end of day

        // Fetch discussions created within the specified date range for the given company name
        const Proposed = await Discussion.findAll({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                discussion: { [Op.like]: '%Proposed%' },
                companyname: companyName
            },
            include: [{
                model: Candidate,
                attributes: ['candidateId', 'c_rank']
            }],
            raw: true
        });

        const Approved = await Discussion.findAll({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                discussion: { [Op.like]: '%Approved%' },
                companyname: companyName
            },
            include: [{
                model: Candidate,
                attributes: ['candidateId', 'c_rank']
            }],
            raw: true
        });

        const Joined = await Discussion.findAll({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                discussion: { [Op.like]: '%Joined%' },
                companyname: companyName
            },
            include: [{
                model: Candidate,
                attributes: ['candidateId', 'c_rank']
            }],
            raw: true
        });

        const Rejected = await Discussion.findAll({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                discussion: { [Op.like]: '%Rejected%' },
                companyname: companyName
            },
            include: [{
                model: Candidate,
                attributes: ['candidateId', 'c_rank']
            }],
            raw: true
        });

        // Send the discussions data for each status separately as a JSON response
        res.json({ 
            Proposed, 
            Approved, 
            Joined, 
            Rejected 
        });
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCallCount = async (req, res) => {
    try {
        const currentTime = new Date();
        const startOfDay = new Date(currentTime);
        startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of the current day

        // Fetch the count of discussions created within the current day
        const callCount = await Discussion.count({
            where: {
                created_date: {
                    [Op.between]: [startOfDay, currentTime] // Filter discussions within the current day
                }
            }
        });
        
        // Update the call_count field in the Calls model
        
        // Send the call_count value as a JSON response
        res.json({ call_count: callCount });
    } catch (error) {
        console.error('Error fetching call count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getStatusCount = async (req, res) => {
    try {
        const currentTime = new Date();
        const startOfDay = new Date(currentTime);
        startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of the current day

        // Fetch the counts of discussions created today
        const counts = await Discussion.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Proposed%" THEN 1 ELSE NULL END')), 'proposed_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Approved%" THEN 1 ELSE NULL END')), 'approved_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Joined%" THEN 1 ELSE NULL END')), 'joined_count'],
                [sequelize.fn('COUNT', sequelize.literal('CASE WHEN `discussion` LIKE "%Rejected%" THEN 1 ELSE NULL END')), 'rejected_count']
            ],
            where: {
                created_date: {
                    [Op.between]: [startOfDay, currentTime] // Filter discussions created today
                }
            },
            raw: true
        });

        // Send the counts as a JSON response
        res.json({ counts });
    } catch (error) {
        console.error('Error fetching today\'s discussion counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const percentage = async (req, res) => {
    try {
        // Fetch the counts from the Calls model
        const counts = await Calls.findAll({
            attributes: ['call_count', 'proposed_count', 'approved_count', 'joined_count', 'rejected_count'],
            limit: 1 // Limit the result to one record
        });

        // If counts is not empty, extract the first element (which should be the only one)
        const countRecord = counts.length ? counts[0] : null;

        // If a record was found, send the counts as a JSON response
        if (countRecord) {
            res.json({
                call_count: countRecord.call_count,
                proposed_count: countRecord.proposed_count,
                approved_count: countRecord.approved_count,
                joined_count: countRecord.joined_count,
                rejected_count: countRecord.rejected_count
            });
        } else {
            res.status(404).json({ error: 'Counts not found' });
        }
    } catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCandidateActiveDetailsCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        const readOnly = user.dataValues.readOnly;
        const userGroup = user.dataValues.userGroup;
        console.log('User Group:', userGroup);

        let activeCount;
        let inactiveCount;

        if (userGroup == 'admin') {
            // If the user is an admin, fetch counts of all candidates' active and inactive details
            activeCount = await Candidate.count({ where: { active_details: 1 } });
            inactiveCount = await Candidate.count({ where: { active_details: 0 } });
        } else if (userGroup == 'vendor' && readOnly) {
            // If the user is a vendor with read-only access, fetch counts of associated candidates' active and inactive details
            activeCount = await Candidate.count({
                where: { userId: userId, active_details: 1 }
            });
            inactiveCount = await Candidate.count({
                where: { userId: userId, active_details: 0 }
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        res.status(200).json({
            activeCount: activeCount,
            inactiveCount: inactiveCount,
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const getCandidateRankCounts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        const userGroup = user.userGroup;

        let rankCounts;

        if (userGroup === 'admin') {
            // If the user is an admin, fetch counts of all ranks
            rankCounts = await Candidate.findAll({
                where: {
                    avb_date: { [Op.lt]: new Date() } // Filter candidates with avb_date less than the present date
                },
                attributes: ['c_rank', [sequelize.fn('COUNT', 'c_rank'), 'count']],
                group: ['c_rank']
            });
        } else if (userGroup === 'vendor' && user.readOnly) {
            // If the user is a vendor with read-only access, fetch counts of ranks associated with the user
            rankCounts = await Candidate.findAll({
                where: {
                    userId: userId,
                    avb_date: { [Op.lt]: new Date() } // Filter candidates with avb_date less than the present date
                },
                attributes: ['c_rank', [sequelize.fn('COUNT', 'c_rank'), 'count']],
                group: ['c_rank']
            });
        } else {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        res.status(200).json({
            rankCounts: rankCounts,
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};
const countOperations = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear(); // Get the current year
        const countsByQuarter = [];
        for (let quarter = 1; quarter <= 4; quarter++) {
            const { startDate, endDate } = getQuarterDates(currentYear, quarter);
            const proposedCount = await Discussion.count({
                where: {
                    created_date: { [Op.between]: [startDate, endDate] },
                    discussion: { [Op.like]: '%Proposed%' }
                }
            });
            const approvedCount = await Discussion.count({
                where: {
                    created_date: { [Op.between]: [startDate, endDate] },
                    discussion: { [Op.like]: '%Approved%' }
                }
            });
            const joinedCount = await Discussion.count({
                where: {
                    created_date: { [Op.between]: [startDate, endDate] },
                    discussion: { [Op.like]: '%Joined%' }
                }
            });
            countsByQuarter.push({ quarter, proposedCount, approvedCount, joinedCount });
        }
        res.status(200).json(countsByQuarter);
    } catch (error) {
        console.error('Error getting discussion counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getQuarterDates = (year, quarter) => {
    const startDate = new Date(year, (quarter - 1) * 3, 1);
    const endDate = new Date(year, quarter * 3, 0);
    return { startDate, endDate };
};



const calls_made = async (req, res) => {
    try {
        const startDate = req.body.startDate ; // Default start date if not provided
        const endDate = req.body.endDate ; // Default end date if not provided
        const userId = req.body.userId;
        const category = req.body.category;
        console.log("~~~~~~~~~~~~~~",startDate,endDate,userId,category)
        // Build the SQL query
        let query = `
            SELECT a.candidateId, b.nationality, a.companyname, a.join_date, a.discussion, a.reason, a.r_date, a.post_by, b.c_rank, b.c_vessel, b.fname, b.lname, b.avb_date, b.category, c.userName
            FROM discussion AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            JOIN Users AS c ON a.post_by = c.id
            WHERE a.created_date >= :startDate AND a.created_date <= :endDate
        `;
        
        const replacements = { startDate, endDate };

        // Conditionally add userId and category to the query
        if (userId) {
            query += ' AND a.post_by = :userId';
            replacements.userId = userId;
        }

        if (category) {
            query += ' AND b.category = :category';
            replacements.category = category;
        }

        // Execute the query
        const results = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ callsMade: results, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};



const proposals = async (req, res) => {
    console.log('inside proposals');

    try {
        // Extract query parameters
        const { status, startDate, endDate, companyName, category } = req.query;

        // Base query
        let query = `
            SELECT a.candidateId, a.join_date, b.fname, b.lname, b.c_rank, b.c_vessel, b.category, b.nationality, c.userName
            FROM discussion AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            JOIN Users AS c ON a.post_by = c.id
        `;

        const conditions = [];

        // Conditionally add filters
        if (companyName) {
            query += `
                JOIN companies AS d ON a.companyname = d.company_id
            `;
            conditions.push(`d.company_id = :companyName`);
        }

        if (status) {
            conditions.push(`a.discussion LIKE :status`);
        } else {
            // Include all statuses if status is not provided
            conditions.push(`a.discussion IN ('Proposed', 'Rejected', 'Approved', 'Joined')`);
        }

        if (startDate && endDate) {
            conditions.push(`a.join_date BETWEEN :startDate AND :endDate`);
        }

        if (category) {
            conditions.push(`b.category = :category`);
        }

        // Append conditions to the query if any exist
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Build the replacements object
        const replacements = {
            status: status ? `%${status}%` : null,
            companyName: companyName || null,
            startDate: startDate || null,
            endDate: endDate || null,
            category: category || null,
        };

        // Run the raw SQL query using sequelize.query
        const results = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ candidates: results, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};








// const getContractsBySignOnDate = async (req, res) => {
//     try {
//         const { startDate, endDate, vessel_type, companyname, category } = req.query;

//         // Construct the base SQL query
//         let query = `
//             SELECT a.candidateId, a.rank, a.vslName, a.vesselType, a.wages, a.currency, a.wages_types, a.sign_on, a.sign_off, a.eoc, a.emigrate_number, a.aoa_number, a.reason_for_sign_off,
//                    b.fname, b.lname, b.nationality, c.vesselName AS vesselName, c.imoNumber AS imoNumber, c.vesselFlag AS vesselFlag, b.category, e.company_name
//             FROM contract AS a
//             JOIN Candidates AS b ON a.candidateId = b.candidateId
//             JOIN vsls AS c ON a.vslName = c.id
//             JOIN rank AS d ON a.rank = d.rank
//             JOIN companies AS e ON a.company = e.company_id
//             WHERE a.sign_on BETWEEN :startDate AND :endDate
//         `;

//         // Add vessel type condition if present
//         if (vessel_type) {
//             query += ` AND c.vsl_name = :vessel_type`;
//         }

//         // Add company name condition if present
//         if (companyname) {
//             query += ` AND e.company_name = :companyname`;
//         }

//         // Add category condition if present
//         if (category) {
//             query += ` AND b.category = :category`;
//         }

//         // Complete the query with group by and order by clauses
//         query += `
//             GROUP BY a.candidateId
//             ORDER BY d.rankOrder ASC
//         `;

//         // Run the raw SQL query using sequelize.query
//         const results = await sequelize.query(query, {
//             replacements: {
//                 startDate,
//                 endDate,
//                 vessel_type,
//                 companyname,
//                 category
//             },
//             type: sequelize.QueryTypes.SELECT
//         });

//         res.status(200).json({ contracts: results, success: true });
//     } catch (error) {
//         console.error('Error fetching contracts by sign_on date:', error);
//         res.status(500).json({ error: error.message || 'Internal server error', success: false });
//     }
// };


const getContractsBySignOnDate = async (req, res) => {
    try {
        const { startDate, endDate, vessel_type, companyname, category } = req.query;

        // Construct the base SQL query
        let query = `
        WITH RankedBanks AS (
            SELECT 
                bd.*,
                ROW_NUMBER() OVER (PARTITION BY bd.candidateId ORDER BY 
                    CASE 
                        WHEN bd.types = 'general' THEN 1 
                        ELSE 2 
                    END
                ) AS rn
            FROM bank AS bd
        )
        SELECT 
            a.candidateId, a.rank, a.vslName, a.vesselType, a.wages, a.currency, a.wages_types, a.sign_on, a.sign_off, a.eoc, a.sign_on_port, a.emigrate_number, a.aoa_number, a.reason_for_sign_off,
            b.fname, b.lname, b.nationality, b.indos_number,
            c.vesselName AS vesselName, c.imoNumber AS imoNumber, c.vesselFlag AS vesselFlag, 
            e.company_name,
            rb.bank_name, rb.account_num, rb.bank_addr, rb.ifsc_code, rb.swift_code, rb.beneficiary, rb.beneficiary_addr, rb.pan_num, rb.passbook, rb.pan_card, rb.branch, rb.types, rb.created_by,
            CASE WHEN cd_indian_cdc.document = 'Indian CDC' THEN cd_indian_cdc.document_number ELSE '' END AS indian_cdc_document_number,
            EXISTS (SELECT 1 FROM cdocuments cd_other_cdc WHERE cd_other_cdc.document LIKE '%CDC%') AS has_other_cdc_document,
            CASE WHEN cd_passport.document = 'Passport' THEN cd_passport.document_number ELSE '' END AS passport_document_number,
            u.userName,
            r.rankOrder
        FROM contract AS a
        JOIN Candidates AS b ON a.candidateId = b.candidateId
        JOIN vsls AS c ON a.vslName = c.id
        JOIN companies AS e ON a.company = e.company_id
        LEFT JOIN RankedBanks AS rb ON b.candidateId = rb.candidateId AND rb.rn = 1
        LEFT JOIN cdocuments cd_indian_cdc ON b.candidateId = cd_indian_cdc.candidateId AND cd_indian_cdc.document = 'Indian CDC'
        LEFT JOIN cdocuments cd_passport ON b.candidateId = cd_passport.candidateId AND cd_passport.document = 'Passport'
        LEFT JOIN Users AS u ON a.created_by = u.id
        JOIN ranks AS r ON a.rank = r.rank
        WHERE a.sign_on BETWEEN :startDate AND :endDate
        `;

        // Add vessel type condition if present
        if (vessel_type) {
            query += ` AND c.id = :vessel_type`;
        }

        // Add company name condition if present
        if (companyname) {
            query += ` AND e.company_id = :companyname`;
        }

        // Add category condition if present
        if (category) {
            query += ` AND b.category = :category`;
        }

        // Complete the query with order by clause
        query += `
        ORDER BY r.rankOrder ASC
        `;

        // Run the raw SQL query using sequelize.query
        const results = await sequelize.query(query, {
            replacements: {
                startDate,
                endDate,
                vessel_type,
                companyname,
                category
            },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ contracts: results, success: true });
    } catch (error) {
        console.error('Error fetching contracts by sign_on date:', error);
        res.status(500).json({ error: error.message || 'Internal server error', success: false });
    }
};



const getContractsBySignOffDate = async (req, res) => {
    try {
        const { startDate, endDate, vessel_type, companyname, category } = req.query;

        // Construct the base SQL query with CTE for RankedBanks
        let query = `
        WITH RankedBanks AS (
            SELECT 
                bd.*,
                ROW_NUMBER() OVER (PARTITION BY bd.candidateId ORDER BY 
                    CASE 
                        WHEN bd.types = 'general' THEN 1 
                        ELSE 2 
                    END
                ) AS rn
            FROM bank AS bd
        )
        SELECT 
            a.candidateId, a.rank, a.vslName, a.vesselType, a.wages, a.currency, a.wages_types, a.sign_on, a.sign_off, a.eoc, a.emigrate_number, a.aoa_number, a.reason_for_sign_off, a.sign_on_port, a.sign_off_port,
            b.fname, b.lname, b.nationality, b.indos_number,
            c.vesselName AS vesselName, c.imoNumber AS imoNumber, c.vesselFlag AS vesselFlag, 
            d.company_name,
            rb.bank_name, rb.account_num, rb.bank_addr, rb.ifsc_code, rb.swift_code, rb.beneficiary, rb.beneficiary_addr, rb.pan_num, rb.passbook, rb.pan_card, rb.branch, rb.types,
            CASE WHEN cd_indian_cdc.document = 'Indian CDC' THEN cd_indian_cdc.document_number ELSE '' END AS indian_cdc_document_number,
            EXISTS (SELECT 1 FROM cdocuments cd_other_cdc WHERE cd_other_cdc.document LIKE '%CDC%') AS has_other_cdc_document,
            CASE WHEN cd_passport.document = 'Passport' THEN cd_passport.document_number ELSE '' END AS passport_document_number,
            u.userName,
            r.rankOrder
        FROM contract AS a
        JOIN Candidates AS b ON a.candidateId = b.candidateId
        JOIN vsls AS c ON a.vslName = c.id
        JOIN companies AS d ON a.company = d.company_id
        LEFT JOIN RankedBanks AS rb ON b.candidateId = rb.candidateId AND rb.rn = 1
        LEFT JOIN cdocuments cd_indian_cdc ON b.candidateId = cd_indian_cdc.candidateId AND cd_indian_cdc.document = 'Indian CDC'
        LEFT JOIN cdocuments cd_passport ON b.candidateId = cd_passport.candidateId AND cd_passport.document = 'Passport'
        LEFT JOIN Users AS u ON a.created_by = u.id
        LEFT JOIN ranks AS r ON a.rank = r.rank
        WHERE a.sign_off BETWEEN :startDate AND :endDate
          AND a.sign_on != '1970-01-01'
        `;

        // Add vessel type condition if present
        if (vessel_type) {
            query += ` AND c.id = :vessel_type`;
        }

        // Add company name condition if present
        if (companyname) {
            query += ` AND d.company_id = :companyname`;
        }

        // Add category condition if present
        if (category) {
            query += ` AND b.category = :category`;
        }

        // Complete the query with order by clause
        query += `
        ORDER BY r.rankOrder ASC
        `;

        // Run the raw SQL query using sequelize.query
        const results = await sequelize.query(query, {
            replacements: {
                startDate,
                endDate,
                vessel_type,
                companyname,
                category
            },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ contracts: results, success: true });
    } catch (error) {
        console.error('Error fetching contracts by sign_off date:', error);
        res.status(500).json({ error: error.message || 'Internal server error', success: false });
    }
};




const getContractsDueForSignOff = async (req, res) => {
    try {
        const { startDate, endDate, vessel_type, companyname, category } = req.query;
        console.log('>', startDate, endDate, vessel_type, companyname, category);

        // Construct the base SQL query
        let query = `
            SELECT a.candidateId, a.eoc, a.rank, a.vslName, b.fname, b.lname, b.category, b.nationality, c.vesselName, e.company_name
            FROM contract AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            JOIN vsls AS c ON a.vslName = c.id
            
            JOIN companies AS e ON a.company = e.company_id
            WHERE a.sign_off = '1970-01-01'
              AND a.eoc BETWEEN :startDate AND :endDate
        `;
        // Define replacements object
        const replacements = { startDate, endDate };

        // Add optional conditions dynamically
        if (vessel_type) {
            query += ` AND c.id = :vessel_type`;
            replacements.vessel_type = vessel_type;
        }

        if (companyname) {
            query += ` AND e.company_id = :companyname`;
            replacements.companyname = companyname;
        }

        if (category) {
            query += ` AND b.category = :category`;
            replacements.category = category;
        }

        // Complete the query with order by clause
       

        // Run the raw SQL query using sequelize.query
        const results = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ contracts: results, success: true });
    } catch (error) {
        console.error('Error fetching contracts due for sign off:', error);
        res.status(500).json({ error: error.message || 'Internal server error', success: false });
    }
};




const avbCandidate = async (req, res) => {
    try {
        const { startDate, endDate, avbrank, category } = req.query;
        console.log('lets see how it works', startDate, endDate);

        // Base SQL query
        let query = `
            SELECT candidateid, fname, lname, nationality, avb_date, c_rank, category, c_vessel 
            FROM Candidates 
            WHERE avb_date BETWEEN :startDate AND :endDate
              AND active_details = 1
        `;

        // Define replacements object
        const replacements = { startDate, endDate };

        // Add avbrank condition if present
        if (avbrank) {
            query += ` AND c_rank = :avbrank`;
            replacements.avbrank = avbrank;
        }

        // Add category condition if present
        if (category) {
            query += ` AND category = :category`;
            replacements.category = category;
        }

        // Order the results
        query += ` ORDER BY c_rank ASC, category ASC`;

        // Execute the raw SQL query using sequelize.query
        const candidates = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ candidates, success: true });
    } catch (error) {
        console.error('Error fetching available candidates:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};


const dueForRenewal = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log(startDate, endDate);

        // Fetch candidates with contracts where sign_off is '1970-01-01'
        const candidatesWithContracts = await Candidate.findAll({
            include: [
                {
                    model: Contract,
                    where: {
                        sign_off: '1970-01-01'
                    }
                }
            ]
        });

        // Extract candidate IDs from filtered candidates
        const candidateIds = candidatesWithContracts.map(candidate => candidate.candidateId);

        // Fetch documents due for renewal for filtered candidates
        const documents = await Documents.findAll({
            where: {
                expiry_date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                },
                candidateId: {
                    [Op.in]: candidateIds
                }
            }
        });

        // Fetch medical records due for renewal for filtered candidates
        const medicals = await Medical.findAll({
            where: {
                expiry_date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                },
                candidateId: {
                    [Op.in]: candidateIds
                }
            }
        });

        // Send data to the client side including all fields of documents and medicals
        res.status(200).json({
            documentCandidates: documents.map(doc => doc.toJSON()),
            medicalCandidates: medicals.map(medical => medical.toJSON()),
            success: true
        });
    } catch (error) {
        console.error('Error fetching candidates due for renewal:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};



const getDueForRenewalCountForOneDay = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Set the start date to the current date (midnight)
        const startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);

        // Set the end date to the current date (end of the day)
        const endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);

        // Fetch count of documents due for renewal
        const documentCount = await Documents.count({
            where: {
                expiry_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        // Fetch count of medical records due for renewal
        const medicalCount = await Medical.count({
            where: {
                expiry_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        // Combine the counts of document and medical records
        const totalCandidatesCount = documentCount + medicalCount;

        // Send the count to the client side
        res.status(200).json({
            count: totalCandidatesCount,
            success: true
        });
    } catch (error) {
        console.error('Error fetching count of candidates due for renewal for one day:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};


const avbreport = async (req, res) => {
    try {
        // Query candidates whose avb_date is in the future
        const currentDate = new Date();
        const availableCandidates = await Candidate.findAll({
            where: {
                avb_date: { [Op.gte]: currentDate }
            }
        });

        res.json({ candidates: availableCandidates });
    } catch (error) {
        console.error('Error fetching available candidates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const onBoard = async (req, res) => {
    try {
        console.log('onboard entered');
        const { startDate, vslName, companyname, category } = req.query;

        // Base SQL query
        let query = `
            SELECT a.candidateId, a.rank, a.vslName, a.sign_on_port, a.vesselType, a.wages, a.currency, a.wages_types, a.sign_on, a.sign_off, a.eoc,
                   b.fname, b.lname, b.dob, b.birth_place, c.vesselName, b.category, b.nationality, e.company_name
            FROM contract AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            JOIN vsls AS c ON a.vslName = c.id
            JOIN companies AS e ON a.company = e.company_id
            WHERE a.sign_on <= :startDate
              AND (a.sign_off > :startDate OR a.sign_off = '1970-01-01')
        `;

        // Define replacements object
        const replacements = { startDate };

        // Add vessel name condition if present
        if (vslName) {
            query += ` AND c.id = :vslName`;
            replacements.vslName = vslName;
        }

        // Add company name condition if present
        if (companyname) {
            query += ` AND e.company_id = :companyname`;
            replacements.companyname = companyname;
        }

        // Add category condition if present
        if (category) {
            query += ` AND b.category = :category`;
            replacements.category = category;
        }

        // Complete the query with group by and order by clauses
        query += `
        GROUP BY 
            a.candidateId, 
            b.fname, 
            b.lname, 
            b.dob, 
            a.rank, 
            a.vslName, 
            a.sign_on_port, 
            a.vesselType, 
            a.wages, 
            a.currency, 
            a.wages_types, 
            a.sign_on, 
            a.sign_off, 
            a.eoc,
            b.birth_place, 
            c.vesselName, 
            b.category, 
            b.nationality, 
            e.company_name
        ORDER BY 
            a.rank ASC, 
            b.lname ASC, 
            b.fname ASC
        `;

        // Log query and replacements for debugging
        console.log('Query:', query);
        console.log('Replacements:', replacements);

        // Run the raw SQL query using sequelize.query
        const contracts = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ contracts: contracts, success: true });
    } catch (error) {
        console.error("Error fetching onboard contracts:", error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};



const onBoard2 = async (req, res) => {
    try {
        const { startDate, vslName, companyname, category,userId } = req.query;
        console.log('onboard entered',userId , "company name",companyname);


        // Base SQL query
        let query = `
            SELECT a.candidateId, a.rank, a.vslName, a.sign_on_port, a.vesselType, a.wages, a.currency, a.wages_types, a.sign_on, a.sign_off, a.eoc,
                   b.fname, b.lname, b.dob, b.birth_place, c.vesselName, b.category, b.nationality, b.vendor, b.userId, e.company_name
            FROM contract AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            JOIN vsls AS c ON a.vslName = c.id
            JOIN companies AS e ON a.company = e.company_id
            WHERE a.sign_on <= :startDate
              AND (a.sign_off > :startDate OR a.sign_off = '1970-01-01')
              AND b.userId = :userId  
        `;

        // Define replacements object with userId included
        const replacements = { startDate, userId };

        // Add vessel name condition if present
        if (vslName) {
            query += ` AND c.id = :vslName`;
            replacements.vslName = vslName;
        }

        // Company name and vendor check (mandatory)
        if (companyname) {
            query += ` AND (e.company_id = :companyname OR b.vendor = :companyname)`;
            replacements.companyname = companyname;
        }

        // Add category condition if present
        if (category) {
            query += ` AND b.category = :category`;
            replacements.category = category;
        }

        // Complete the query with group by and order by clauses
        query += `
        GROUP BY 
            a.candidateId, 
            a.rank, 
            a.vslName, 
            a.sign_on_port, 
            a.vesselType, 
            a.wages, 
            a.currency, 
            a.wages_types, 
            a.sign_on, 
            a.sign_off, 
            a.eoc,
            b.fname, 
            b.lname, 
            b.dob, 
            b.birth_place, 
            c.vesselName, 
            b.category, 
            b.nationality, 
            b.vendor, 
            e.company_name
    `;

        // Log query and replacements for debugging
        console.log('Query:', query);
        console.log('Replacements:', replacements);

        // Run the raw SQL query using sequelize.query
        const contracts = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ contracts: contracts, success: true });
    } catch (error) {
        console.error("Error fetching onboard contracts:", error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};
const onBoard3 = async (req, res) => {
    try {
        console.log('onboard entered')
        const { startDate, vslName, companyname, category, nationality } = req.query;

        // Ensure nationality is provided
        if (!nationality) {
            return res.status(400).json({ error: 'Nationality is required', success: false });
        }

        // Base SQL query
        let query = `
            SELECT a.candidateId, a.rank, a.vslName, a.sign_on_port, a.vesselType, a.wages, a.currency, a.wages_types, a.sign_on, a.sign_off, a.eoc,
                   b.fname, b.lname, b.dob, b.birth_place, c.vesselName, b.category, b.nationality, e.company_name
            FROM contract AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            JOIN vsls AS c ON a.vslName = c.id
            JOIN companies AS e ON a.company = e.company_id
            WHERE a.sign_on <= :startDate
              AND (a.sign_off > :startDate OR a.sign_off = '1970-01-01')
              AND b.nationality = :nationality
        `;

        // Define replacements object
        const replacements = { startDate, nationality };

        // Add vessel name condition if present
        if (vslName) {
            query += ` AND c.id = :vslName`;
            replacements.vslName = vslName;
        }

        // Add company name condition if present
        if (companyname) {
            query += ` AND e.company_id = :companyname`;
            replacements.companyname = companyname;
        }

        // Add category condition if present
        if (category) {
            query += ` AND b.category = :category`;
            replacements.category = category;
        }

        // Complete the query with group by and order by clauses
        query += `
        GROUP BY 
            a.candidateId, 
            a.rank, 
            a.vslName, 
            a.sign_on_port, 
            a.vesselType, 
            a.wages, 
            a.currency, 
            a.wages_types, 
            a.sign_on, 
            a.sign_off, 
            a.eoc,
            b.fname, 
            b.lname, 
            b.dob, 
            b.birth_place, 
            c.vesselName, 
            b.category, 
            b.nationality, 
            e.company_name
    `;

        // Log query and replacements for debugging
        console.log('Query:', query);
        console.log('Replacements:', replacements);

        // Run the raw SQL query using sequelize.query
        const contracts = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ contracts: contracts, success: true });
    } catch (error) {
        console.error("Error fetching onboard contracts:", error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};





// const crewList = async (req, res) => {
//     const { startDate, endDate, vslName, company } = req.query;

//     // Log the parameters to debug
//     console.log({ startDate, endDate, vslName, company });

//     if (!startDate || !endDate) {
//         return res.status(400).send('Missing required query parameters: startDate and endDate');
//     }

//     let query = `
//         SELECT 
//             a.candidateId, a.rank, a.vslName, a.vesselType, a.wages, a.currency, 
//             a.wages_types, a.sign_on, a.sign_off, a.eoc, 
//             b.fname, b.lname, b.nationality, b.c_rank, 
//             c.id AS vesselId, b.category, e.company_name,
//             bd.bank_name, bd.account_num, bd.bank_addr, bd.ifsc_code, bd.swift_code,
//             bd.beneficiary, bd.beneficiary_addr, bd.pan_num, bd.passbook, bd.pan_card,
//             bd.branch, bd.types, bd.created_by,
//             (SELECT cd_indian_cdc.document_number 
//                 FROM cdocuments cd_indian_cdc 
//                 WHERE cd_indian_cdc.candidateId = b.candidateId 
//                 AND cd_indian_cdc.document = 'Indian CDC' 
//                 LIMIT 1) AS indian_cdc_document_number,
//             (SELECT cd_passport.document_number 
//                 FROM cdocuments cd_passport 
//                 WHERE cd_passport.candidateId = b.candidateId 
//                 AND cd_passport.document = 'Passport' 
//                 LIMIT 1) AS passport_document_number
//         FROM 
//             contract AS a
//             JOIN Candidates AS b ON a.candidateId = b.candidateId
//             JOIN vsls AS c ON a.vslName = c.id
//             JOIN companies AS e ON a.company = e.company_id
//             LEFT JOIN bank AS bd ON b.candidateId = bd.candidateId
//             LEFT JOIN ranks AS r ON b.c_rank = r.rank
//         WHERE 
//             ((a.sign_on <= :endDate AND a.sign_off='1970-01-01') OR 
//             (a.sign_off <= :endDate AND a.sign_off >= :startDate) OR 
//             (a.sign_on <= :endDate AND a.sign_off >= :endDate)) AND 
//             (a.sign_on <= :endDate)
//     `;

//     const replacements = { startDate, endDate };

//     if (vslName) {
//         query += ' AND c.id = :vslName';
//         replacements.vslName = vslName;
//     }

//     if (company) {
//         query += ' AND a.company = :company';
//         replacements.company = company;
//     }

//     query += ' ORDER BY r.rankOrder ASC';

//     try {
//         const results = await sequelize.query(query, {
//             type: sequelize.QueryTypes.SELECT,
//             replacements
//         });
//         res.json(results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while retrieving the crew list.');
//     }
// };
const crewList = async (req, res) => {
    const { startDate, endDate, vslName, company } = req.query;

    // Log the parameters to debug
    console.log({ startDate, endDate, vslName, company });

    if (!startDate || !endDate) {
        return res.status(400).send('Missing required query parameters: startDate and endDate');
    }

    let query = `
        WITH RankedBanks AS (
            SELECT 
                bd.*,
                ROW_NUMBER() OVER (PARTITION BY bd.candidateId ORDER BY 
                    CASE 
                        WHEN bd.types = 'general' THEN 1 
                        ELSE 2 
                    END
                ) AS rn
            FROM bank AS bd
        )
        SELECT 
            a.candidateId, a.rank, a.vslName, a.vesselType, a.wages, a.currency, 
            a.wages_types, a.sign_on, a.sign_off, a.eoc,a.sign_on_port, a.sign_off_port, 
            b.fname, b.lname, b.indos_number, b.nationality, b.c_rank, 
            c.id AS vesselId, b.category, e.company_name,
            rb.bank_name, rb.account_num, rb.bank_addr, rb.ifsc_code, rb.swift_code,
            rb.beneficiary, rb.beneficiary_addr, rb.pan_num, rb.passbook, rb.pan_card,
            rb.branch, rb.types, rb.created_by,
            (SELECT cd_indian_cdc.document_number 
                FROM cdocuments cd_indian_cdc 
                WHERE cd_indian_cdc.candidateId = b.candidateId 
                AND cd_indian_cdc.document = 'Indian CDC' 
                LIMIT 1) AS indian_cdc_document_number,
            (SELECT cd_passport.document_number 
                FROM cdocuments cd_passport 
                WHERE cd_passport.candidateId = b.candidateId 
                AND cd_passport.document = 'Passport' 
                LIMIT 1) AS passport_document_number
        FROM 
            contract AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            JOIN vsls AS c ON a.vslName = c.id
            JOIN companies AS e ON a.company = e.company_id
            LEFT JOIN RankedBanks AS rb ON b.candidateId = rb.candidateId AND rb.rn = 1
            LEFT JOIN ranks AS r ON b.c_rank = r.rank
        WHERE 
            ((a.sign_on <= :endDate AND a.sign_off='1970-01-01') OR 
            (a.sign_off <= :endDate AND a.sign_off >= :startDate) OR 
            (a.sign_on <= :endDate AND a.sign_off >= :endDate)) AND 
            (a.sign_on <= :endDate)
    `;

    const replacements = { startDate, endDate };

    if (vslName) {
        query += ' AND c.id = :vslName';
        replacements.vslName = vslName;
    }

    if (company) {
        query += ' AND a.company = :company';
        replacements.company = company;
    }

    query += ' ORDER BY r.rankOrder ASC';

    try {
        const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements
        });
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving the crew list.');
    }
};

const generatePayslip = async (req, res) => {
    try {
        const { candidateId, contractId } = req.body;

        const contract = await Contract.findOne({ where: { id: contractId, candidateId } });
        if (!contract) return res.status(404).json({ error: 'Contract not found' });

        const signOnDate = new Date(contract.sign_on);
        const signOffDate = contract.sign_off === '1970-01-01' ? new Date() : new Date(contract.sign_off);

        let currentDate = new Date(signOnDate);
        while (currentDate <= signOffDate) {
            let startDate, endDate;

            // For the first entry, start date is signOnDate, end date is the end of that month
            if (currentDate.getTime() === signOnDate.getTime()) {
                startDate = new Date(currentDate);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
            } else {
                // Start date is the next day after the last end date
                startDate = new Date(currentDate);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
            }

            // Adjust endDate to be the signOffDate if it's before the end of the month
            if (endDate > signOffDate) {
                endDate = new Date(signOffDate);
                endDate.setHours(23, 59, 59);
            }

            // Check if payslip already exists
            const existingPayslip = await Payslip.findOne({
                where: {
                    candidateId: candidateId,
                    contractId: contractId,
                    startDate: startDate,
                    endDate: endDate
                }
            });

            if (!existingPayslip) {
                const daysWorked = calculateDaysWorked(startDate, endDate);
                const payslip = {
                    candidateId: candidateId,
                    contractId: contractId,
                    startDate: startDate,
                    endDate: endDate,
                    month: startDate.toLocaleString('default', { month: 'long' }),
                    year: startDate.getFullYear(),
                    amount: calculatePayslipAmount(contract.wages, startDate, endDate),
                    daysWorked: daysWorked,
                    // Include new fields from contract
                    openingBalance: contract.openingBalance,
                    basicWages: contract.basicWages,
                    leaveWages: contract.leaveWages,
                    overtimeWages: contract.overtimeWages,
                    leaveSubsistence: contract.leaveSubsistence,
                    consolidateAllowance: contract.consolidateAllowance,
                    fixedOvertime: contract.fixedOvertime,
                    subsistenceAllowance: contract.subsistenceAllowance,
                    uniformAllowance: contract.uniformAllowance,
                    miscAllowance: contract.miscAllowance,
                    otherAllowance: contract.otherAllowance,
                    onboardOtWages: contract.onboardOtWages,
                    joiningBasic: contract.joiningBasic,
                    tankCleaningBonus: contract.tankCleaningBonus,
                    additionalWorks: contract.additionalWorks,
                    prevMonthBalance: contract.prevMonthBalance,
                    reimbursement: contract.reimbursement,
                    radio: contract.radio,
                    onboardFinalSettlement: contract.onboardFinalSettlement,
                    otherDeductions: contract.otherDeductions,
                    training: contract.training,
                    bondStore: contract.bondStore,
                    sign_on:contract.sign_on,
                    rank:contract.rank,
                    currency:contract.currency,
                    cdc_passport:contract.cdc_passport,
                    vesselName:contract.vslName
                };

                await Payslip.create(payslip);
            }

            // Move to the next month, starting one day after the current end date
            currentDate = new Date(endDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        res.status(200).json({ message: 'Payslips generated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function calculateDaysWorked(start, end) {
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function calculatePayslipAmount(wages, start, end) {
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    const workedDays = calculateDaysWorked(start, end);
    return (wages / daysInMonth) * workedDays;
}


const getPayslips = async (req, res) => {
    try {
        const contractId = req.params.contractId;
        console.log(contractId)

        if (!contractId) {
            return res.status(400).json({ error: 'contractId is required' });
        }

        const payslips = await Payslip.findAll({
            where: { contractId: contractId }
            
        });

        if (payslips.length === 0) {
            return res.status(404).json({ error: 'No payslips found for this contract' });
        }

        res.status(200).json({payslips:payslips});
    } catch (error) {
        console.error('Error fetching payslips:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
  


  const reliefPlan = async (req, res) => {
    try {
        const { startDate, vesselName, companyName, category } = req.query;
        console.log(startDate, vesselName, companyName, category);

        // Define the base SQL query
        let query = `
            SELECT a.candidateId, a.eoc, a.rank, a.vslName, b.fname, b.lname, b.category, b.nationality, c.vesselName, e.company_name
            FROM contract AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            JOIN vsls AS c ON a.vslName = c.id
           
            JOIN companies AS e ON a.company = e.company_id
            WHERE a.sign_off = '1970-01-01'
              AND a.eoc <= :startDate
        `;

        // Define replacements object
        const replacements = { startDate };

        // Add vessel name condition if present
        if (vesselName) {
            query += ` AND c.vesselName = :vesselName`;
            replacements.vesselName = vesselName;
        }

        // Add company name condition if present
        if (companyName) {
            query += ` AND e.company_name = :companyName`;
            replacements.companyName = companyName;
        }

        // Add category condition if present
        if (category) {
            query += ` AND b.category = :category`;
            replacements.category = category;
        }

        // Complete the query with order by clause
        query += `
            ORDER BY a.eoc ASC
        `;

        // Run the raw SQL query using sequelize.query
        const contracts = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        // Send the relief plan contracts data to the client
        res.json({ contracts: contracts, success: true });
    } catch (error) {
        console.error("Error fetching relief plan contracts:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



const mis = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log(startDate, endDate);

        const misCandidates = await Candidate.findAll({
            include: {
                model: Discussion,
                attributes: ['discussion', 'join_date', 'companyname'], // Select the fields you want to include
                where: {
                    discussion: {
                        [Op.in]: ['proposed', 'approved', 'joined', 'rejected']
                    },
                    join_date: {
                        [Op.between]: [startDate,endDate] // Greater than or equal to startDate
                          // Less than or equal to endDate
                    },
                                  
                }
            }
        });

        res.json(misCandidates);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


const workedWith = async (req, res) => {
    try {
        // Extract pagination parameters from request query
       const {pages , pageSize} = req.query
        // Fetch candidates where the 'ntbr' field is not null
        const candidatesWithNTBR = await Candidate.findAll({
            where: {
                ntbr: { [Op.not]: null }
            }
        });

        // Fetch contracts with sign-on date present and sign-off date not present
        const onboardContracts = await Contract.findAll({
            where: {
                sign_on: { [Op.not]: null },
            }
        });

        // Calculate total pages for candidates with 'ntbr'
        const totalCandidatesPages = Math.ceil(candidatesWithNTBR.length / pageSize);

        // Calculate total pages for onboard contracts
        const totalContractsPages = Math.ceil(onboardContracts.length / pageSize);

        // Slice the data based on pagination parameters
        const slicedCandidates = candidatesWithNTBR.slice((pages - 1) * pageSize, pages * pageSize);
        const slicedContracts = onboardContracts.slice((pages - 1) * pageSize, pages * pageSize);

        res.json({
            candidatesWithNTBR: slicedCandidates,
            onboardContracts: slicedContracts,
            totalCandidatesPages: totalCandidatesPages,
            totalContractsPages: totalContractsPages
        });
    } catch (error) {
        console.error("Error fetching onboard data:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const evaluation = async (req, res) => {
    try {
        console.log(req.body)
        // Extract data from the request body
        const {
            eval_type,
            applied_rank,
            applied_date,
            time,
            remote,
            applied_by,
            interviewer_name,
            values,
        } = req.body;
        const candidateId = req.params.id; // Extract id from URL parameters

        // Create a new evaluation dataset
        const evaluation = await Evaluation.create({
            eval_type:eval_type,
            applied_rank:applied_rank,
            applied_date:applied_date,
            time:time,
            remote:remote,
            applied_by:applied_by,
            interviewer_name:interviewer_name,
            values:values, // Include values in the dataset
            candidateId: candidateId
        });

        // Send email to the interviewer

        res.status(201).json(evaluation);
    } catch (error) {
        console.error('Error creating evaluation dataset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const sendEmail = async (req, res) => {
    try {

        const {
            interviewer_name,
            candidateId,
            applied_rank,
            applied_date,
            time,
            remote,
            applied_by,
        } = req.body;
        console.log(interviewer_name,candidateId,applied_rank,applied_date,time,remote,applied_by)
        // Get interviewer email from some source, e.g., a database or static list
        const interviewerEmail = interviewer_name

        // Send email to the interviewer
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'mccivistasolutions@gmail.com',
            name: 'I-Vistaz'
        };
        const receivers = [
            {
                email: interviewerEmail
            }
        ];

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Evaluation for Nemo Candidate',
            htmlContent: `
                <h2>Hello!</h2>
                <p>You have been assigned a meeting with a Nemo candidate. Please plan accordingly. Details for the meeting are provided below:</p>
                <h1>Interview Details</h1>
                <p>Candidate Id: ${candidateId}</p>
                <p>Applied Rank: ${applied_rank}</p>
                <p>Applied Date: ${applied_date}</p>
                <p>Time: ${time}</p>
                <p>Remote Link: ${remote}</p>
                <p>Applied By: ${applied_by}</p>
                <p>Have a wonderful day!</p>
                <br>
                <p>Thanks and Regards,</p>
                <p>Nemo</p>
                <p>Nautilus Shipping</p>
            `,
        });
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};




  const getEvaluationDetails = async (req, res) => {
    try {
        const candidateId = req.params.id;
        
        // Assuming you have a Sequelize model named Evaluation representing evaluation details
        const evaluationDetails = await Evaluation.findAll({
            where: { candidateId: candidateId }
        });

        res.status(200).json(evaluationDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const getSignupsCountByDate = async (req, res) => {
    try {
      const date = new Date();
      const startDate = new Date(date.setHours(0, 0, 0, 0));
      const endDate = new Date(date.setHours(23, 59, 59, 999));
  
      const count = await Candidate.count({
        where: {
          cr_date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
  
      res.status(200).json({ signupCount: count });
    } catch (error) {
      console.error('Error fetching candidate count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getContractsBySignOnDatedaily = async (req, res) => {
    try {
        // Set start and end date to today's date
        const date = new Date();
        const startDate = new Date(date.setHours(0, 0, 0, 0));
        const endDate = new Date(date.setHours(23, 59, 59, 999));

        // Fetch the count of candidates with associated contracts signed on within the current day
        const count = await Candidate.count({
            include: [{
                model: Contract,
                where: {
                    sign_on: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }]
        });

        res.status(200).json({ count: count, success: true });
    } catch (error) {
        console.error('Error fetching contracts by sign_on date:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};


const getContractsBySignOffDatedaily = async (req, res) => {
    try {
        const { days } = req.query;
        const numDays = parseInt(days, 10);

        if (isNaN(numDays) || numDays <= 0) {
            return res.status(400).json({ error: 'Invalid number of days. Please provide a positive integer.', success: false });
        }

        // Calculate the date range
        const startDate = new Date(); // Start date is today
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + numDays - 1); // End date is today + (numDays - 1)

        // Ensure endDate includes the whole day
        endDate.setHours(23, 59, 59, 999);

        console.log(`Fetching count of contracts signed off between ${startDate.toISOString()} and ${endDate.toISOString()}`);

        // Fetch count of candidates with associated contracts within the specified date range
        const count = await Candidate.count({
            include: [{
                model: Contract,
                where: {
                    sign_off: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }]
        });

        res.status(200).json({ count: count, success: true });
    } catch (error) {
        console.error('Error fetching count of contracts by sign_off date:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};


const getContractsAndDiscussions = async (req, res) => {
    try {
        // Fetch all candidates with their associated contracts
        const candidates = await Candidate.findAll({
            include: [{
                model: Contract,
                attributes: ['sign_on', 'sign_off']
            }],
            attributes: ['candidateId', 'fname', 'nationality', 'c_rank', 'c_vessel'],
        });

        // Filter out candidates with zero contracts
        const candidatesWithContracts = candidates.filter(candidate => candidate.Contracts.length > 0);

        // Process each candidate to count their completed contracts and determine if they are ex-employees
        const processedCandidates = candidatesWithContracts.map(candidate => {
            const contracts = candidate.Contracts;

            // Filter out active contracts (those with sign_on but no sign_off)
            const completedContracts = contracts.filter(contract => contract.sign_on && contract.sign_off).length;

            // Determine if the candidate is an ex-employee
            const isExEmployee = contracts.every(contract => contract.sign_off);

            return {
                candidateId: candidate.candidateId,
                fname: candidate.fname,
                nationality: candidate.nationality,
                c_rank: candidate.c_rank,
                c_vessel: candidate.c_vessel,
                completedContracts,
                isExEmployee
            };
        });

        // Sort ex-employees by completed contracts in descending order
        processedCandidates.sort((a, b) => b.completedContracts - a.completedContracts);

        res.status(200).json({ candidates: processedCandidates, success: true });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const getCandidatesCountOnBoardForOneDay = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Set the start date to the current date (midnight)
        const startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);

        // Set the end date to the current date (end of the day)
        const endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);

        // Construct the filtering criteria for contracts
        const contractFilterCriteria = {
            sign_on: { [Op.between]: [startDate, endDate] }, // Sign-on date falls within the current day
            sign_off: null // Sign-off date is not present
        };

        // Fetch onboard candidates with the specified criteria
        const onboardCandidatesCount = await Candidate.count({
            include: [{
                model: Contract,
                where: contractFilterCriteria, // Apply filtering criteria specifically for contracts
                attributes: [] // Include only the count, so no need to retrieve attributes
            }]
        });

        res.json({ count: onboardCandidatesCount });
    } catch (error) {
        console.error("Error fetching count of onboard candidates for one day:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getContractsCountBySignOffDateForOneDay = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Set the start date to the current date (midnight)
        const startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);

        // Set the end date to the current date (end of the day)
        const endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);

        // Fetch count of candidates with associated contracts signed off within the current day
        const candidatesCount = await Candidate.count({
            include: [{
                model: Contract,
                where: {
                    sign_off: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                attributes: [] // Exclude attributes from contracts
            }]
        });

        res.status(200).json({ count: candidatesCount, success: true });
    } catch (error) {
        console.error('Error fetching count of contracts by sign_off date for one day:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const hoverDiscussions =async (req, res) => {
    try {
        const candidateId = req.params.id;

        // Fetch last 5 discussions for the candidate
        const discussions = await Discussion.findAll({
            where: {
                candidateId: candidateId // Adjust this according to your actual schema
            },
            order: [['created_date', 'DESC']], // Order by created_date descending to get the latest discussions first
            limit: 5 // Limit to fetch only the last 5 discussions
        });

        res.json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getCallsCountForOneDay = async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Set the start date to the current date (midnight)
        const startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);

        // Set the end date to the current date (end of the day)
        const endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);

        // Fetch count of calls made within the current day
        const callsCount = await Discussion.count({
            where: {
                created_date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            }
        });
        console.log(callsCount)
        res.status(200).json({ count: callsCount, success: true });
    } catch (error) {
        console.error('Error fetching count of calls made for one day:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const getContractsOverTenMonths = async (req, res) => {
    try {
        const { startDate } = req.query;
        console.log('>', startDate);

        // Construct the base SQL query
        const query = `
            SELECT a.candidateId, a.rank, a.vslName, b.fname, b.lname, b.category, b.nationality,a.eoc,
                   a.sign_on, a.sign_off
            FROM contract AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            WHERE 
             a.eoc <= :startDate
            AND a.sign_off ='1970-01-01'
        `;

        // Run the raw SQL query using sequelize.query
        const results = await sequelize.query(query, {
            replacements: { startDate },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ contracts: results, success: true });
    } catch (error) {
        console.error('Error fetching contracts without sign off:', error);
        res.status(500).json({ error: error.message || 'Internal server error', success: false });
    }
};




const getContractsEndingSoon = async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        // Format dates to string (YYYY-MM-DD format)
        const todayString = today.toISOString().split('T')[0];
        const thirtyDaysFromNowString = thirtyDaysFromNow.toISOString().split('T')[0];

        console.log('Today:', todayString);
        console.log('30 Days From Now:', thirtyDaysFromNowString);

        // Construct the base SQL query
        const query = `
            SELECT a.candidateId, a.rank, a.vslName, b.fname, b.lname, b.category, b.nationality, a.eoc,
                   a.sign_on, a.sign_off
            FROM contract AS a
            JOIN Candidates AS b ON a.candidateId = b.candidateId
            WHERE a.eoc BETWEEN :today AND :thirtyDaysFromNow
            AND a.sign_off = '1970-01-01'
        `;

        // Run the raw SQL query using sequelize.query
        const results = await sequelize.query(query, {
            replacements: { today: todayString, thirtyDaysFromNow: thirtyDaysFromNowString },
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).json({ contracts: results, success: true });
    } catch (error) {
        console.error('Error fetching contracts ending soon:', error);
        res.status(500).json({ error: error.message || 'Internal server error', success: false });
    }
};



const updateEval =  async (req, res) => {
    const { id } = req.params;
    const newValues = req.body; // This should be the new evalObject

    try {
        const [updated] = await Evaluation.update(
            { values: newValues },
            {
                where: { id },
                returning: true,
            }
        );

        if (updated) {
            res.status(200).json({ message: 'Evaluation updated successfully' });
        } else {
            res.status(404).json({ message: 'Evaluation not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const viewEvaluation = async (req, res) => {

    const evalId = req.params.evalid;
    const candidateId = req.params.id; // Fetch candidateId from query params

    try {
        const evaluation = await Evaluation.findOne({
            where: { id: evalId, candidateId: candidateId }
        });

        if (evaluation) {
            res.json(evaluation);
        } else {
            res.status(404).json({ message: 'Evaluation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching evaluation data', error });
    }
}


const submitApplicationForm = async (req, res) => {
    try {
        const candidateId = req.params.candidateId;
        const { applicationDatas } = req.body;
        const checkingCandidate = await Candidate.findByPk(candidateId);
        if(checkingCandidate!==null) {
            const candidateDetails = {
                applicationDatas:applicationDatas
            }
            const datass = await Candidate.update(candidateDetails, {
                where: { candidateId: candidateId },
            });
            console.log(datass, 'datassdatassdatass')
           /* var postData = JSON.parse(applicationDatas);
             const avb_date = convertToDate(postData.avb_date);
            const dob = convertToDate(postData.dob);
            const candidateDetails = {
                fname:postData.fname,
                lname:postData.lname,
                c_rank:postData.c_rank,
                avb_date:avb_date,
                dob:dob,
                birth_place:postData.birth_place,
                m_status:postData.m_status,
                nationality:postData.nationality,
                religion:postData.religion,
                totalChild:postData.totalChild,
                c_ad1:postData.c_ad1,                
                nearestAirport:postData.nearest_airport,
                mobile_code1:postData.mobile_code1.replace('+',''),
                c_mobi1:postData.c_mobi1,
                weight:postData.weight,
                height:postData.height
            }
            await Candidate.update(candidateDetails, {
                where: { candidateId: candidateId },
            });
            if(postData.kin_name!=="") {
                 await CandidateNkd.create({
                    kin_name:postData.kin_name,
                    kin_relation:postData.kin_relation,
                    kin_contact_number:postData.kin_contact_number,
                    kin_email:postData.kin_email,
                    kin_contact_address:postData.kin_contact_address,
                    kin_priority:2,
                    candidateId: candidateId
                });
            }

            const documentType = [{"key":'passport','name':"PASSPORT"},{"key":'seamanbook','name':"SEAMANS BOOK"},{"key":'seamanid','name':"SEAFARER ID"},{"key":'coc','name':"COC"},{"key":'dceoil','name':"DCE OIL"},{"key":'dcegas','name':"DCE GAS"},{"key":'dcechem','name':"DCE CHEM"}];
            documentType.map(async (doc) => {
                let dnumbers = postData[`document_${doc.key}_numbers`]||'';
                if(dnumbers!=="") {
                    let evaluation = await Documents.findAll({
                        where: { document: doc.name, candidateId: candidateId }
                    });
                   
                    let issuedate = postData[`document_${doc.key}_issuedate`]||'';
                    let issue_date = (issuedate!=="")?convertToDate(issuedate):'';
                    let expirydate = postData[`document_${doc.key}_validuntill`]||'';
                    let expiry_date = (expirydate!=="")?convertToDate(expirydate):'';
                    let issue_place = postData[`document_${doc.key}_issueplace`]||''; 
                    if(evaluation.length>0) {                       
                        let updatedFields = {
                            document_number: dnumbers,
                            issue_date: issue_date,
                            expiry_date:expiry_date,
                            issue_place: issue_place,
                        };
                        Documents.update(updatedFields, {
                            where: { candidateId: candidateId, document: doc.name },
                        })
                    } else {
                        Documents.create({
                            document: doc.name,
                            document_number: dnumbers,
                            issue_date: issue_date,
                            expiry_date:expiry_date,
                            issue_place: issue_place,
                            stcw: 'No',
                            candidateId: candidateId // Assuming you have a foreign key 'user_id' in your DocumentDetails model
                        });
                    }
                }
                return '';
            });

            const expVessel = postData.exp_vesselname||[];
            if(expVessel.length>0) {
                expVessel.map((Vessel, index) => {
                    if(Vessel!=="") {
                        let exp_from = postData.exp_from[index]||'';
                        let expFrom = (exp_from!=="")?convertToDate(exp_from):'';
                        let exp_to = postData.exp_to[index]||'';
                        let expTo = (exp_to!=="")?convertToDate(exp_to):'';
                        prevExp.create({
                            expFrom: expFrom,
                            expTo: expTo,
                            vesselName:Vessel,
                            Flag: postData.exp_flag[index]||'',
                            dwt: postData.exp_DWT[index]||'',
                            kwt: postData.exp_KWT[index]||'',
                            engine: postData.exp_Engine[index]||'',
                            typeofvessel: postData.exp_typeofvessel[index]||'',
                            position: postData.exp_Position[index]||'',
                            remarks: postData.exp_remarks[index]||'',
                            candidateId: candidateId // Assuming you have a foreign key 'user_id' in your DocumentDetails model
                        });
                    }
                });
            } */
            res.status(201).json({ message: "Successfully Created New Candidate!", success: true});
           
        } else {
        res.status(404).json({ success: false, message: 'Contract not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const getPreviousExperience = async (req, res) => {
    try {
        const candidateId = req.params.candidateId;      
        // Assuming you have a Document model
        const prevExps = await prevExp.findAll({
            where: { candidateId: candidateId }
        });

        res.status(200).json(prevExps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
};

const sendApplicationEmail = async (req, res) => {
    try {

        const {
            candidateName,
            candidateId,
            applicationURL,
            candidateEmail
        } = req.body;
       
        const interviewerEmail = candidateEmail

        // Send email to the interviewer
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'crewing@nautilusshipping.com',
            name: 'Nautilus Shipping - Crewing'
        };
        const receivers = [
            {
                email: interviewerEmail
            }
        ];

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Nautilus Shipping Application Form',
            htmlContent: `
                <h2>Dear ${candidateName}!</h2>
                <p>Please click below URL and fill your information</p>
                <p>Application Form Link: ${applicationURL}</p>
                <p>Have a wonderful day!</p>
                <br>
                <p>Thanks and Regards,</p>
                <p>Nemo</p>
                <p>Nautilus Shipping</p>
            `,
        });
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


function convertToDate (postDate) {
    const convertdate = (postDate!=="" && postDate!==null)?new Date(postDate):'';
    const splitdate = (convertdate!=="")?convertdate.toISOString().split('T'):[];
    if(splitdate.length>0) {
        return splitdate[0]
    }else {
        return "";
    }
}


module.exports = {
    add_candidate,
    getAllCandidates,
    add_kindetails,
    add_hospitaldetails,
    add_traveldetails,
    add_bankdetails,
    add_documentdetails,
    add_contractdetails,
    add_discussiondetails,
    add_discussionplusdetails,
    get_candidate,
    edit_candidate,
    delete_candidate,
    get_discussiondetails,
    get_contractdetails,
    get_documentdetails,
    get_BankDetails,
    get_TravelDetails,
    get_HospitalDetails,
    get_NKDDetails,
    update_contractdetails,
    update_BankDetails,
    update_TravelDetails,
    update_HospitalDetails,
    update_NKDDetails,
    update_documentdetails,
    login,
    delete_Travel,
    delete_Hospital,
    delete_NKD,
    delete_discussionplus,
    delete_contract,
    delete_Document,
    delete_Bank,
    new_profile,
    birthday,
    createSeaService,
    editSeaService,
    getAllSeaService,
    deleteSeaService,
    reportAll,
    checkExpiry,
    Reminder,
    getCallCount,
    countOperations,
    calls_made,
    getSea,
    contract,
    getCandidateActiveDetailsCount,
    getCandidateRankCounts,
    updateCandidateFields,
    getContractsBySignOnDate,
    proposals,
    getContractsBySignOffDate,
    avbCandidate,
    dueForRenewal,
    avbreport,
    onBoard,
    crewList,
    reliefPlan,
    mis,
    percentage,
    getStatusCount,
    getStatusData,
    getStatusDate,
   workedWith,
   evaluation,
   getSignupsCountByDate,
   getEvaluationDetails,
   getContractsBySignOnDatedaily,
   getContractsBySignOffDatedaily,
   getContractsAndDiscussions,
   getCandidatesCountOnBoardForOneDay,
   getDueForRenewalCountForOneDay,
   getContractsCountBySignOffDateForOneDay,
   searchCandidates,
   getContractsDueForSignOff,
   updateOrCreateCandidateFromVerloop,
   hoverDiscussions,
   getCallsCountForOneDay,
   getContractsEndingSoon,
   getContractsOverTenMonths,
   generatePayslip,
   getPayslips,
   updateEval,
   sendEmail,
   viewEvaluation,
   onBoard2,
   onBoard3,
   delete_Medical,
   submitApplicationForm,
   getPreviousExperience,
   sendApplicationEmail
};
