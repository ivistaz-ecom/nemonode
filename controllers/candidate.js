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

const add_candidate = async (req, res) => {
    try {
        const t = await sequelize.transaction(); // Start transaction
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
            nemo_source,
        } = req.body;

        // Validate required fields
        if (!validate(fname) || !validate(lname) || !validate(email1) || !validate(c_mobi1)) {
            return res.status(400).json({ message: "Bad Parameters", success: false });
        }

        // Check for existing data
        const existingCandidate = await Candidate.findOne({
            where: {
                email1: email1,
                // Add more conditions if needed for uniqueness
            },transaction: t,
        });

        if (existingCandidate) {
            await t.rollback();
            return res.status(409).json({ message: "Duplicate Entry", success: false });
        }

        // If no duplicate, create a new entry
        try {
            const userId = req.user.id
            console.log(userId)
            
                        await Candidate.create({
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
                nemo_source,
                userId:userId
            }, { transaction: t });
            await t.commit();
            res.status(201).json({ message: "Successfully Created New Candidate!", success: true });
        } catch (err) {
            await t.rollback();

            console.log(err);
            res.status(500).json({ error: err, message: "Internal Server Error", success: false });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: "Internal Server Error", success: false });
    }
}
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
        const userId = req.user.id;
        let userGroup;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        userGroup = user.dataValues.userGroup;
        let reports = user.dataValues.reports;
        console.log('User Group:', userGroup);

        const selectedFields = req.body.selectedFields; // Get the selectedFields from the request body
        const group = req.body.group || 'all'; // Get the group parameter from the request body, default to 'all'

        let allCandidates;

        // Define the date range filter
        const startDate = req.body.startDate; // Assuming startDate and endDate are provided in the request body
        const endDate = req.body.endDate;

        // Check if the date range is provided
        if (startDate && endDate) {
            // If the user is not an admin, fetch candidates associated with the user
            if (userGroup === 'admin') {
                allCandidates = await Candidate.findAll({
                    where: {
                        cr_date: {
                            [Op.between]: [startDate, endDate], // Filter based on the date range
                        },
                    },
                    attributes: selectedFields, // Provide selectedFields as the attributes
                });
            } else if (userGroup === 'vendor' && reports === true) {
                allCandidates = await Candidate.findAll({
                    where: {
                        userId: userId,
                        cr_date: {
                            [Op.between]: [startDate, endDate], // Filter based on the date range
                        },
                    },
                    attributes: selectedFields, // Provide selectedFields as the attributes
                });
            } else {
                // If the user is neither admin nor vendor with 'reports' true, handle other cases
                return res.status(403).json({ message: 'Unauthorized', success: false });
            }
        } else {
            // Handle case when date range is not provided
            return res.status(400).json({ message: 'Start date and end date are required for filtering', success: false });
        }

        // Filter out fields based on the selectedFields data
        const filteredCandidates = allCandidates.map(candidate => {
            const filteredCandidate = {};
            for (const field in candidate.dataValues) {
                if (selectedFields[field]) {
                    filteredCandidate[field] = candidate.dataValues[field];
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
        if ( !bankName || !accountNumber || !bankAddress || !ifscCode || !swiftCode || !beneficiary || !address || !panNumber) {
            return res.status(400).json({ message: "Bad Parameters", success: false });
        }

        // Create a new BankDetails entry
        const bankDetails = await Bank.create({
            bank_name:bankName,
            account_num:accountNumber,
            bank_addr:bankAddress,
            ifsc_code:ifscCode,
            swift_code:swiftCode,
            beneficiary,
            beneficiary_addr:address,
            pan_num:panNumber,
            pan_card:panCardFile,
            passbook:passbookFile,
            // NRI Bank Details
            branch:branch,
            types:types,
            created_by:created_by,
            candidateId: candidateId // Assuming you have a foreign key 'user_id' in your BankDetails model
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
            created_by
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
            candidateId: candidateId // Assuming you have a foreign key 'user_id' in your ContractDetails model
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
        const candidateId = req.params.id;
        console.log("?????????>>>>>>>>>>>",candidateId)
        // Create a new discussion entry in the database
        const newDiscussion = await Discussion.create({
            companyname,
            join_date,
            discussion,
            reason,
            post_by,
            r_date,
            created_date,
            reminder,
            candidateId // Assuming candidateId is a field in your discussion table
        });

        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}







const edit_candidate=  async (req, res) => {
    const candidateId = req.params.id;
    const candidateDetails = req.body;

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

  
const delete_candidate=async (req, res) => {
    const candidateId = req.params.id;
    console.log('>>>>',candidateId)
    try {
        // Assuming you have a Sequelize model named Candidate
        const deletedCandidate = await Candidate.destroy({
            where: { candidateId: candidateId },
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
    console.log(updatedContractData)

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
            contract.documents = updatedContractData.documentFile; // Assuming 'documents' is a file path or something similar
            contract.aoa = updatedContractData.aoaFile; // Assuming 'aoa' is a file path or something similar
            contract.created_by= updatedContractData.created_by;
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
        console.log('its working')
        const memId = req.params.id;
        const updatedFields = req.body;

        // Find the hospital record by memId
        const hospital = await Medical.findOne({
            where: { id: memId },
        });
        console.log(hospital)
        // If the hospital record exists, update the fields
        if (hospital) {
            await hospital.update(updatedFields);
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
  
      if (candidate) {
        // Compare the provided password with the stored hashed password in the database
        bcrypt.compare(password, candidate.password, (err, passwordMatch) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
          }
  
          if (passwordMatch) {
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
          } else {
            // Password is invalid
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid credentials' });
          }
        });
      } else {
        // Candidate does not exist
        return res.status(404).json({ success: false, message: 'Candidate not found' });
      }
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
        // Implement logic to delete the NKD entry with the given ID
        await NKD.destroy({ where: { id: nkdId } });

        res.json({ success: true, message: 'NKD entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting NKD entry' });
    }
};

const delete_Hospital = async (req, res) => {
    const hospitalId = req.params.id;

    try {
        // Implement logic to delete the hospital entry with the given ID
        await Medical.destroy({ where: { id: hospitalId } });

        res.json({ success: true, message: 'Hospital entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting hospital entry' });
    }
};

const delete_Travel = async (req, res) => {
    const travelId = req.params.id;

    try {
        // Implement logic to delete the travel entry with the given ID
        await Travel.destroy({ where: { id: travelId } });

        res.json({ success: true, message: 'Travel entry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting travel entry' });
    }
};

// Implement other delete operations in a similar manner


const delete_Bank = async (req, res) => {
    const bankId = req.params.id;

    try {
        // Implement logic to delete the bank details with the given ID
        await Bank.destroy({ where: { id: bankId } });

        res.json({ success: true, message: 'Bank details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting bank details' });
    }
};

const delete_Document = async (req, res) => {
    const documentId = req.params.id;

    try {
        // Implement logic to delete the document details with the given ID
        await Documents.destroy({ where: { id: documentId } });

        res.json({ success: true, message: 'Document details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting document details' });
    }
};

const delete_contract = async (req, res) => {
    const contractId = req.params.id;

    try {
        // Implement logic to delete the contract details with the given ID
        await Contract.destroy({ where: { id: contractId } });

        res.json({ success: true, message: 'Contract details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting contract details' });
    }
};


const delete_discussionplus = async (req, res) => {
    const discussionplusId = req.params.id;

    try {
        // Implement logic to delete the discussion plus details with the given ID
        await Discussion_plus.destroy({ where: { id: discussionplusId } });

        res.json({ success: true, message: 'Discussion plus details deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting discussion plus details' });
    }
};


const reportAll = async(req,res)=>{
    const id = req.params.id;
    try{
        const user = User.findByPk(id)
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
        const { startDate, endDate } = req.query;
        const whereCondition = { reminder: true };

        // If start date input is present, add it to the where condition
        if (startDate) {
            whereCondition.r_date = { [Op.gte]: startDate }; // Filter discussions with reminder date greater than or equal to start date
        }

        // If end date input is present, add it to the where condition
        if (endDate) {
            whereCondition.r_date = {
                ...whereCondition.r_date,
                [Op.lte]: endDate, // Filter discussions with reminder date less than or equal to end date
            };
        }

        // Fetch discussions based on the condition, ordered by r_date in descending order
        const discussions = await Discussion.findAll({
            where: whereCondition,
            order: [['r_date', 'DESC']], // Ordering by r_date in descending order
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

  










const getCallCount = async (req, res) => {
    try {
        const currentTime = new Date();
        const oneDayAgo = new Date(currentTime);
        oneDayAgo.setDate(oneDayAgo.getDate() - 1); // Get the timestamp for 24 hours ago

        // Fetch the count of discussions created within the last 24 hours
        const callCount = await Discussion.count({
            where: {
                created_date: {
                    [Op.between]: [oneDayAgo, currentTime] // Filter discussions within the last 24 hours
                },
                [Op.or]: [ // Filter discussions containing proposed, approved, joined, or rejected
                    { discussion: { [Op.like]: '%Proposed%' } },
                    { discussion: { [Op.like]: '%Approved%' } },
                    { discussion: { [Op.like]: '%Joined%' } },
                    { discussion: { [Op.like]: '%Rejected%' } }
                ]
            }
        });

        // Send the call_count value as a JSON response
        res.json({ call_count: callCount });
    } catch (error) {
        console.error('Error fetching call count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}




const getQuarterDates = (year, quarter) => {
    const startDate = new Date(year, (quarter - 1) * 3, 1);
    const endDate = new Date(year, quarter * 3, 0);
    return { startDate, endDate };
};

const getDiscussionPlusCounts = async () => {
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
        return countsByQuarter;
    } catch (error) {
        console.error('Error getting discussion plus counts:', error);
        throw error;
    }
};


const countOperations = async (req, res) => {
    try {
        const discussionCounts = await getDiscussionPlusCounts(); // No need to pass year
        res.status(200).json(discussionCounts);
    } catch (error) {
        console.error('Error getting discussion counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const calls_made = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        const userGroup = user.dataValues.userGroup;
        const reports = user.dataValues.reports;

        // Check if the user is authorized to access calls made
        if (userGroup === 'admin') {
            // Fetch calls made for admins
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const selectedFields = req.body.selectedFields;

            // Check if the date range is provided
            if (startDate && endDate) {
                const callsMadeAdmin = await Candidate.findAll({
                    include: [
                        {
                            model: Discussion,
                            attributes: ['discussion', 'post_by', 'r_date'],
                            where: {
                                created_date: {
                                    [Op.between]: [startDate, endDate], // Filter based on the date range
                                },
                            },
                        },
                    ],
                    attributes: selectedFields // Only include selected fields
                });

                res.status(200).json({ callsMade: callsMadeAdmin, success: true });
            } else {
                // Date range not provided
                res.status(400).json({ message: 'Start date and end date are required for filtering', success: false });
            }
        } else if (userGroup === 'vendor' && reports === true) {
            // Fetch calls made for vendors with reports enabled
            const userId = req.user.id;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const selectedFields = req.body.selectedFields;

            // Check if the date range is provided
            if (startDate && endDate) {
                const callsMadeVendor = await Candidate.findAll({
                    include: [
                        {
                            model: Discussion,
                            attributes: ['discussion', 'post_by', 'r_date'],
                            where: {
                                post_by: userId, // Filter calls made by the vendor
                                created_date: {
                                    [Op.between]: [startDate, endDate], // Filter based on the date range
                                },
                            },
                        },
                    ],
                    attributes: selectedFields // Only include selected fields
                });

                res.status(200).json({ callsMade: callsMadeVendor, success: true });
            } else {
                // Date range not provided
                res.status(400).json({ message: 'Start date and end date are required for filtering', success: false });
            }
        } else {
            // Unauthorized user
            res.status(403).json({ message: 'Unauthorized', success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const proposals = async (req, res) => {
    console.log('its inside');
    
    try {    
        // Extract query parameters
        const { status, startDate, endDate } = req.query;

        // Fetch candidates based on the discussions' created_date and status
        const candidates = await Candidate.findAll({
            include: [
                {
                    model: Discussion,
                    attributes: ['companyname', 'created_date', 'post_by'],
                    where: {
                        discussion: {
                            [Op.like]: `%${status}%` // Partial match on discussion field
                        },
                        created_date: {
                            [Op.between]: [startDate, endDate] // Filter by start and end date
                        }
                    }
                }
            ],
            attributes: ['candidateId', 'fname', 'nationality', 'c_rank', 'c_vessel']
        });

        res.status(200).json({ candidates: candidates, success: true });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const getContractsBySignOnDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Fetch candidates with associated contracts
        const candidates = await Candidate.findAll({
            include: [{
                model: Contract,
                where: {
                    sign_on: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                attributes: ['sign_on'] // Include only sign_on date from contracts
            }],
            attributes: ['candidateId', 'fname', 'nationality', 'c_rank', 'c_vessel'] // Include candidate attributes
        });

        res.status(200).json({ candidates: candidates, success: true });
    } catch (error) {
        console.error('Error fetching contracts by sign_on date:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const getContractsBySignOffDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Fetch candidates with associated contracts
        const candidates = await Candidate.findAll({
            include: [{
                model: Contract,
                where: {
                    sign_off: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                attributes: ['sign_off'] // Include only sign_on date from contracts
            }],
            attributes: ['candidateId', 'fname', 'nationality', 'c_rank', 'c_vessel'] // Include candidate attributes
        });

        res.status(200).json({ candidates: candidates, success: true });
    } catch (error) {
        console.error('Error fetching contracts by sign_on date:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};


const avbCandidate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log('lets see how it works',startDate,endDate)
        // Fetch candidates available within the specified date range
        const candidates = await Candidate.findAll({
            where: {
                avb_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        res.status(200).json({ candidates: candidates, success: true });
    } catch (error) {
        console.error('Error fetching available candidates:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};


const dueForRenewal = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log(startDate, endDate);

        // Fetch documents due for renewal
        const documents = await Documents.findAll({
            where: {
                expiry_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        // Fetch medical records due for renewal
        const medicals = await Medical.findAll({
            where: {
                expiry_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        // Combine the candidate IDs from documents and medicals
        const documentCandidateIds = documents.map(doc => doc.candidateId);
        const medicalCandidateIds = medicals.map(medical => medical.candidateId);

        // Fetch candidates based on the combined candidate IDs
        const documentCandidates = await Candidate.findAll({
            where: {
                candidateId: [...documentCandidateIds]
            },
            attributes: ['candidateId', 'fname', 'lname', 'nationality', 'c_vessel']
        });

        const medicalCandidates = await Candidate.findAll({
            where: {
                candidateId: [...medicalCandidateIds]
            },
            attributes: ['candidateId', 'fname', 'lname', 'nationality', 'c_vessel']
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


const avbreport = async (req, res) => {
    try {
        // Query candidates whose avb_date is in the future
        const currentDate = new Date();
        const availableCandidates = await Candidate.findAll({
            where: {
                avb_date: { [Op.gt]: currentDate }
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
        const { startDate, endDate } = req.body;

        // Construct the filtering criteria for contracts
        const contractFilterCriteria = {
            sign_on: { [Op.not]: null }, // Sign-on date is present
            sign_off: null // Sign-off date is not present
        };

        // Add additional filtering based on start and end dates for contracts
        if (startDate && endDate) {
            contractFilterCriteria.sign_on = { [Op.between]: [startDate, endDate] };
        }

        // Fetch onboard candidates with the specified criteria
        const onboardCandidates = await Candidate.findAll({
            include: [{
                model: Contract,
                where: contractFilterCriteria, // Apply filtering criteria specifically for contracts
                attributes: ['sign_on', 'sign_off', 'sign_on_port', 'sign_off_port']
            }, {
                model: Documents,
                where: {
                    document: 'Passport' // Fetch only documents where the value is 'Passport'
                },
                required: false // Use left join to include documents, but not make it mandatory
            }]
        });

        // Map the results to include only the required fields
       
        res.json(onboardCandidates);
    } catch (error) {
        console.error("Error fetching onboard candidates:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const crewList = async (req, res) => {
    try {
        const { startDate, endDate, vslName } = req.query;
        console.log(">>>>>>>>>>>>>>>>>>>", startDate, endDate, vslName);

        // Construct the filtering criteria for contracts
        const contractFilterCriteria = {
            sign_on: { [Op.not]: null }, // Sign-on date is present
            sign_off: null, // Sign-off date is not present
            vslName: vslName // Filter by the vslName attribute
        };

        // Add additional filtering based on start and end dates for contracts
        if (startDate && endDate) {
            contractFilterCriteria.sign_on = { [Op.between]: [startDate, endDate] };
        }

        // Fetch crewlist candidates with the specified criteria
        const crewlistCandidates = await Candidate.findAll({
            include: [{
                model: Contract,
                where: contractFilterCriteria, // Apply filtering criteria specifically for contracts
                attributes: ['sign_on', 'sign_off', 'sign_on_port', 'sign_off_port', 'wages', 'wages_types']
            }, {
                model: Documents,
                where: {
                    [Op.or]: [
                        { document: 'Passport' },
                        { document: 'INDIAN CDC' },
                        { document: { [Op.like]: '%INDOS%' } },
                    ] // Fetch documents where the value is 'Passport' or 'INDIAN CDC'
                },
                required: false // Use left join to include documents, but not make it mandatory
            }],
        });

        // Send the crewlist candidates data to the client
        res.json(crewlistCandidates);
    } catch (error) {
        console.error("Error fetching crewlist candidates:", error);
        res.status(500).json({ error: 'Internal server error' });
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
    crewList
    
};
