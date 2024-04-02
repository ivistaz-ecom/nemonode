const Candidate = require("../models/candidate");
const CandidateNkd = require('../models/nkd');
const Medical= require('../models/medical') 
const Travel= require('../models/travel')
const Bank = require('../models/bank')
const Documents = require('../models/cdocument')
const Contract = require('../models/contract')
const Discussion_plus = require('../models/discussionplus')
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
        let includeModels = [
            { model: CandidateNkd },
            { model: Medical },
            { model: Travel },
            { model: Bank },
            { model: Documents },
            { model: Contract },
            { model: Discussion_plus },
            // Add other associated models as needed
        ];

        const userId = req.user.id;
        let userGroup;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        userGroup = user.dataValues.userGroup;
        let Write = user.dataValues.Write;
        let readOnly = user.dataValues.readOnly;
        console.log('User Group:', userGroup);

        let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
        let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10

        // Calculate the offset based on the page and limit
        let offset = (page - 1) * limit;

        let allCandidates;
        if (userGroup === 'admin') {
            // If the user is an admin, fetch all candidates with pagination
            allCandidates = await Candidate.findAndCountAll({
                include: includeModels,
                limit,
                offset,
            });
        } else if(userGroup==='vendor' && readOnly){
            // If the user is not an admin, fetch candidates associated with the user with pagination
            allCandidates = await Candidate.findAndCountAll({
                where: {
                    userId: userId,
                },
                include: includeModels,
                limit,
                offset,
            });
        }

        const totalCount = allCandidates.count;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            candidates: allCandidates.rows,
            totalCount,
            totalPages,
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
        const readOnly = user.dataValues.readOnly
        const userGroup = user.dataValues.userGroup;
        console.log('User Group:', userGroup);

        let whereCondition = {};
        // Check if a date is provided in the request body
        if (req.query.date) {
            // If date is provided, filter s based on that date
            const selectedDate = new Date(req.query.date);
            console.log(selectedDate)
            whereCondition.dob = { [Op.eq]: selectedDate };
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








// const new_profile = async (req, res) => {
//     try {
//         let includeModels = [
//             { model: CandidateNkd },
//             { model: Medical },
//             { model: Travel },
//             { model: Bank },
//             { model: Documents },
//             { model: Contract },
//             { model: Discussion_plus },
//             // Add other associated models as needed
//         ];

//         const userId = req.user.id;
//         let userGroup;
//         const user = await User.findByPk(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found', success: false });
//         }

//         userGroup = user.dataValues.userGroup;
//         console.log('User Group:', userGroup);

//         const selectedFields = req.body.selectedFields || []; // Default to an empty array if selectedFields is not provided

//         let allCandidates;
//         if (userGroup === 'admin') {
//             // If the user is an admin, fetch all candidates
//             allCandidates = await Candidate.findAll({
//                 attributes: selectedFields,
//                 include: includeModels,
//             });
//         } else {
//             // If the user is not an admin, fetch candidates associated with the user and filter by group
//             allCandidates = await Candidate.findAll({
//                 where: {
//                     userId: userId,
//                     group: userGroup // Assuming the group column name in the Candidate table is 'group'
//                 },
//                 attributes: selectedFields,
//                 include: includeModels,
//             });
//         }

//         res.status(200).json({
//             candidates: allCandidates,
//             success: true,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error', success: false });
//     }
// };

const new_profile = async (req, res) => {
    try {
        let includeModels = [
            { model: CandidateNkd },
            { model: Medical },
            { model: Travel },
            { model: Bank },
            { model: Documents },
            { model: Contract },
            { model: Discussion_plus },
            // Add other associated models as needed
        ];

        const userId = req.user.id;
        let userGroup;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        userGroup = user.dataValues.userGroup;
        let reports = user.dataValues.reports;
        console.log('User Group:', userGroup);

        const selectedFields = req.body.selectedFields || []; // Default to an empty array if selectedFields is not provided
        const group = req.body.group || 'all'; // Get the group parameter from the request body, default to 'all'

        let allCandidates;
        if (group === 'all') {
        if (userGroup === 'admin' ) {
            // If the user is an admin, fetch all candidates
            allCandidates = await Candidate.findAll({
                attributes: selectedFields,
                include: includeModels,
            });
        }
        else
        {   
            if(userGroup==='vendor' && reports ==='true')
              // If the user is an admin, fetch all candidates
              allCandidates = await Candidate.findAll({
                where: {
                    group: group,
                },
                attributes: selectedFields,
                include: includeModels,
            });
        }
        

        
        } else {
            // If the user is not an admin, fetch candidates associated with the user
            if (group === 'all') {
                // If group is 'all', bypass filtering
                allCandidates = await Candidate.findAll({
                    where: {
                        userId: userId,
                    },
                    attributes: selectedFields,
                    include: includeModels,
                });
            } else {
                // If group is specific, filter candidates based on the group value
                allCandidates = await Candidate.findAll({
                    where: {
                        userId: userId,
                        group: group,
                    },
                    attributes: selectedFields,
                    include: includeModels,
                });
            }
        }

        res.status(200).json({
            candidates: allCandidates,
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

        // Define includeModels and selectedFields based on your requirements

        let allContracts;
        if (userGroup === 'admin') {
            // If the user is an admin, fetch all contracts
            allContracts = await Contract.findAll({
                include: includeModels,
                attributes: selectedFields,
            });
        } else if (userGroup === 'vendor' && reports) {
            // If the user is a vendor, fetch contracts associated with the user
            allContracts = await Contract.findAll({
                where: {
                    created_by: userId,
                },
                include: includeModels,
                attributes: selectedFields,
            });
        }

        res.status(200).json({
            contracts: allContracts,
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
        const { proposed, approved, joined, rejected, company_name, status_date, reason, set_reminder, reminder_date,reminder_text, reference_check, reference_check_text, special_comments, basic_comments, ref_check, added_by } = req.body;
        const candidateId = req.params.id;

        // Get today's date
        await Calls.increment('call_count', { where: {} });

      
            // If no entry exists for today, create a new entry with today_count set to 1
            await Discussion_plus.create({
                proposed,
                approved,
                joined,
                rejected,
                company_name,
                status_date,
                reason,
                set_reminder: set_reminder ? new Date(set_reminder) : null,
                reminder_date: reminder_date ? new Date(reminder_date) : null,
                reminder_text,
                reference_check,
                reference_check_text,
                special_comments,
                basic_comments,
                ref_check,
                added_by,
                candidateId 
            });
       

        // Send a success response
        res.status(201).json({ message: 'Successfully Created New Discussion_plus Entry!', success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err, message: 'Internal Server Error', success: false });
    }
};







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
    const candidateId = req.params.id;

    try {
        // Find all discussion plus entries for the given candidate ID
        const discussionPlusDetails = await Discussion_plus.findAll({ where: { candidateId } });

        // If discussion plus entries are found, send them as a JSON response
        if (discussionPlusDetails) {
            res.json({ discussion: discussionPlusDetails });
        } else {
            // If no discussion plus entries are found, send a 404 response
            res.status(404).json({ message: 'Discussion plus details not found for the candidate' });
        }
    } catch (error) {
        // If an error occurs, log it and send a 500 response with an error message
        console.error('Error fetching discussion plus details:', error);
        res.status(500).json({ message: 'Server Error' });
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
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        const readOnly = user.dataValues.readOnly;
        const userGroup = user.dataValues.userGroup;

        let discussionRanks;
        const { date } = req.query;

        let whereCondition = {};

        if (date) {
            const formattedDate = new Date(date); // Convert date string to Date object
            const startDate = new Date(formattedDate.getFullYear(), formattedDate.getMonth(), formattedDate.getDate()); // Start of the day
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1); // End of the day
            
            // Set the condition for reminder date
            whereCondition.reminder_date = {
                [Op.gte]: startDate,
                [Op.lt]: endDate
            };
        }

        if (userGroup === 'admin') {
            // If admin, fetch all reminders without applying any additional conditions
            discussionRanks = await Discussion_plus.findAll({
                where: whereCondition,
                order: [['reminder_date', 'ASC']]
            });
        } else if (userGroup === 'vendor' && readOnly) {
            // If vendor with readOnly access, fetch reminders only for the specific user
            discussionRanks = await Discussion_plus.findAll({
                where: { userId: userId, ...whereCondition },
                order: [['reminder_date', 'ASC']]
            });
        } else {
            // For unauthorized access, return Forbidden error
            return res.status(403).json({ error: 'Forbidden', success: false });
        }

        res.status(200).json({
            discussionRanks: discussionRanks,
            success: true
        });
    } catch (error) {
        console.error('Error fetching discussion ranks:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};





  const getCallCount= async (req, res) => {
    try {
        // Fetch the call_count value from the database
        const calls = await Calls.findOne(); // Assuming you only have one row in the Calls table
        console.log('>>>>>>>>>>>>>>>>>>>.',calls)
        // Extract the call_count value
        const callCount = calls ? calls.call_count : 0;

        // Send the call_count value as a JSON response
        res.json({ call_count: callCount });
    } catch (error) {
        console.error('Error fetching call count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getDiscussionPlusCounts = async () => {
    try {
        const proposedCount = await Discussion_plus.count({ where: { proposed: 1 } });
        const approvedCount = await Discussion_plus.count({ where: { approved: 1 } });
        const joinedCount = await Discussion_plus.count({ where: { joined: 1 } });

        return {
            proposedCount,
            approvedCount,
            joinedCount
        };
    } catch (error) {
        console.error('Error getting discussion plus counts:', error);
        throw error;
    }
};

const countOperations = async (req, res) => {
    try {
        const discussionCounts = await getDiscussionPlusCounts(); // Add await here
        res.status(200).json(discussionCounts);
    } catch (error) {
        console.error('Error getting discussion counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const calls_made=async(req,res)=>{
    try{

    }
    catch(err)
    {

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
    contract
};
