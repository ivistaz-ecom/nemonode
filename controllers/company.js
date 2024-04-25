const Company = require("../models/company");
const User = require('../models/user')


function validate(inputString) {
    return inputString !== undefined && inputString.length !== 0;
}

const add_company = async (req, res) => {
    try {
        const {
            c_name,
            b_type,
            c_contact,
            c_email,
            c_addr,
            c_mgmt,
            c_ph,
            c_last_update
        } = req.body;

        if (!validate(c_name) || !validate(b_type) || !validate(c_contact) || !validate(c_email) || !validate(c_addr) || !validate(c_mgmt) || !validate(c_ph) || !validate(c_last_update)) {
            return res.status(400).json({ message: "Bad Parameters", success: false });
        }

        // Check if the user is authorized to add a company
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const userGroup = user.userGroup;
        const canWrite = user.Write === true;

        if (userGroup === 'admin' || (userGroup === 'vendor' && canWrite)) {
            const existingCompany = await Company.findOne({
                where: {
                    company_name: c_name,
                }
            });

            if (existingCompany) {
                return res.status(409).json({ message: "Duplicate Entry", success: false });
            }

            const newCompany = await Company.create({
                address: c_addr,
                b_type: b_type,
                company_name: c_name,
                contact_person: c_contact,
                email: c_email,
                last_update: c_last_update,
                management: c_mgmt,
                phone: c_ph,
            });

            return res.status(201).json({ message: "Successfully Created New Company!", success: true });
        } else {
            return res.status(403).json({ message: "Unauthorized", success: false });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message, message: "Internal Server Error", success: false });
    }
};

const getAllCompany = async (req, res) => {
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
            // For admin users or vendors with readOnly permission, provide access to all companies
            const result = await Company.findAndCountAll({
                offset,
                limit,
            });

            res.status(200).json({
                company: result.rows,
                totalCount: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: page,
                success: true,
            });
        } else {
            // For other users or vendors without readOnly permission, return an empty array
            return res.status(200).json({
                company: [],
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

const getAllCompanyNames = async (req, res) => {
    try {
        const companies = await Company.findAll();

        res.status(200).json({
            companies: companies, // Send all company data
            success: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", success: false });
    }
};


const delete_company = async (req, res) => {
    const companyId = req.params.id;

    try {
        // Check if the user is authorized to delete a company
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const userGroup = user.userGroup;
        const canDelete = user.deletes === true;

        if (userGroup === 'admin' || (userGroup === 'vendor' && canDelete)) {
            const deletedCompany = await Company.destroy({ where: { company_id: companyId } });
           if (deletedCompany > 0) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(404).json({ error: 'Company not found', success: false });
            }
        } else {
            return res.status(403).json({ message: "Unauthorized", success: false });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};



// Update a company by ID
const update_company = async (req, res) => {
    const companyId = req.params.id;

    try {
        // Check if the user is authorized to update company data
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userGroup = user.userGroup;
        const canWrite = user.Write === true;

        // Find the company by ID
        const company = await Company.findByPk(companyId);

        // If the company does not exist, return a 404 response
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Check if the user is authorized based on userGroup and Write permission
        if (userGroup === 'admin' || (userGroup === 'vendor' && canWrite)) {
            // Update the company fields with the new data
            company.company_name = req.body.c_name;
            company.b_type = req.body.b_type;
            company.contact_person = req.body.c_contact;
            company.email = req.body.c_email;
            company.address = req.body.c_addr;
            company.management = req.body.c_mgmt;
            company.phone = req.body.c_ph;
            company.last_update = req.body.c_last_update;

            // Save the updated company
            await company.save();

            // Fetch the updated company after saving changes
            const updatedCompany = await Company.findByPk(companyId);

            return res.status(200).json({
                message: 'Company updated successfully',
                company: updatedCompany
            });
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.error('Error during company update:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



const get_company = async (req, res) => {
    const companyId = req.params.id; // Extract the company ID from the request parameters

    try {
        // Fetch the company data using the company ID
        const company = await Company.findByPk(companyId);

        // If the company does not exist, return a 404 response
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }

        // If the company exists, return it in the response
        return res.status(200).json({ company: company, success: true });
    } catch (error) {
        console.error('Error fetching company:', error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};
  
const dropdown_company =async(req,res)=>{
    try{
        const company = await Company.findAll()
        res.status(200).json({company:company})
    }
    catch(err)
    {
        console.error('Error fetching company:', err);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}


module.exports = {
    add_company,
    getAllCompany,
    delete_company,
    update_company,
    get_company,
    dropdown_company,
    getAllCompanyNames
   
};
