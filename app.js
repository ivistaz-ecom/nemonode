const express = require("express")
require('dotenv').config()
const fs = require('fs-extra')
const PORT = process.env.PORT;
const app = express()
const path = require('path'); // Add this line to import the path module
const multer = require('multer');
const cors = require("cors")
const bodyParser=require('body-parser');
app.use(bodyParser.json({extended:false}));
const sequelize=require("./util/database")
const companyRoutes=require("./routes/company")
const candidateRoutes = require("./routes/candidate")
const userRoutes = require("./routes/user")
const otherRoutes = require("./routes/other")
const { Op } = require('sequelize');

app.get('/home', (req, res) => {
    res.send('Dev Mode');
});
app.use(cors());
app.use("/company",companyRoutes);  
app.use("/candidate",candidateRoutes)
app.use("/user",userRoutes)
app.use('/others',otherRoutes)
app.get('/fetch-nationality', async (req, res) => {
    try {
        const countries = await nemo_country.findAll();
        res.json({ success: true, countries });
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



///
const User = require("./models/user")
const Vessel = require("./models/vessel");
const VSL = require("./models/VSL");
const Experience = require("./models/experience");
const Rank = require("./models/rank");
const Grade = require("./models/grade");
const Port = require("./models/port");
const PortAgent = require("./models/port_agent"); 
const Hospital = require("./models/hospital");
const Document = require("./models/document");
const Vendor = require("./models/vendor");
const Company = require("./models/company");
const nemo_country=require('./models/country')
const Seaservice = require('./models/seaservice')
const discussion = require('./models/discussion')
const evaluation = require('./models/evaluation')

//candidate relations
const Candidate = require("./models/candidate")
const discussionplus= require('./models/discussionplus')
const contract = require('./models/contract')
const cdocument = require('./models/cdocument')
const bank = require('./models/bank')
const travel = require('./models/travel')
const medical = require('./models/medical')
const NKD = require('./models/nkd');



    User.hasMany(Candidate, { foreignKey: 'userId' })
    Candidate.belongsTo(User, { foreignKey: 'userId' })
    Candidate.hasMany(evaluation,{foreignKey:'candidateId'})
    evaluation.belongsTo(Candidate,{foreignKey:'candidateId'})
    Candidate.hasMany(discussionplus, { foreignKey: 'candidateId' });
    discussionplus.belongsTo(Candidate, { foreignKey: 'candidateId' });
    Candidate.hasMany(discussion, { foreignKey: 'candidateId' });
    discussion.belongsTo(Candidate, { foreignKey: 'candidateId' });
    Candidate.hasMany(contract, { foreignKey: 'candidateId' });
    contract.belongsTo(Candidate, { foreignKey: 'candidateId' });
    Candidate.hasMany(cdocument, { foreignKey: 'candidateId' });
    cdocument.belongsTo(Candidate,{ foreignKey:'candidateId'});
    Candidate.hasMany(bank, { foreignKey: 'candidateId' });
    bank.belongsTo(Candidate,{ foreignKey:'candidateId'});
    Candidate.hasMany(travel, { foreignKey: 'candidateId' });
    travel.belongsTo(Candidate,{ foreignKey:'candidateId'});
    Candidate.hasMany(medical, { foreignKey: 'candidateId' });
    medical.belongsTo(Candidate,{ foreignKey:'candidateId'});
    Candidate.hasMany(NKD, { foreignKey: 'candidateId' });
    NKD.belongsTo(Candidate,{ foreignKey:'candidateId'});
    Candidate.hasMany(Seaservice,{ foreignKey: 'candidateId' })
    Seaservice.belongsTo(Candidate,{ foreignKey: 'candidateId' })
    Vessel.hasMany(VSL, { foreignKey: 'vessel_id' }); // One-to-many relationship
    VSL.belongsTo(Vessel, { foreignKey: 'vessel_id' }); // One-to-many relationship
    User.belongsTo(Company, { foreignKey: 'client_id' }); // User belongs to one Company
    User.belongsTo(VSL, { foreignKey: 'vesselNameId' }); // User belongs to one VesselType



    User.hasMany(discussion, { foreignKey: 'post_by' });
    discussion.belongsTo(User, { foreignKey: 'post_by' });

    Company.hasMany(discussion,{foreignKey:'companyname'})
    discussion.belongsTo(Company,{foreignKey:'companyname'})

    

app.get('/', async (req, res) => {
res.redirect("/views/public/html/loginpage.html")});

app.post('/search', async (req, res) => {
    const userIdSearch = req.body.userId;
    const searchValue = req.body.search;
    try {
    const userGroup = req.body.userGroup
    if (userGroup !== 'admin' && userGroup!=='vendor') {
    return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
    }
    if(userGroup ==='admin'){
    const [candidateResults, nkdResults,bankResults,medicalResults,travelResults,contractResults,cdocumentsResults] = await Promise.all([
    Candidate.findAll({
    where: {
    [Op.or]: [
    { candidateId: { [Op.like]: `%${searchValue}%` } },
    { active_details: { [Op.like]: `%${searchValue}%` } },
    { area_code1: { [Op.like]: `%${searchValue}%` } },
    { area_code2: { [Op.like]: `%${searchValue}%` } },
    { avb_date: { [Op.like]: `%${searchValue}%` } },
    { birth_place: { [Op.like]: `%${searchValue}%` } },
    { boiler_suit_size: { [Op.like]: `%${searchValue}%` } },
    { category: { [Op.like]: `%${searchValue}%` } },
    { company_status: { [Op.like]: `%${searchValue}%` } },
    { createdby: { [Op.like]: `%${searchValue}%` } },
    { cr_date: { [Op.like]: `%${searchValue}%` } },
    { cr_time: { [Op.like]: `%${searchValue}%` } },
    { c_ad1: { [Op.like]: `%${searchValue}%` } },
    { c_ad2: { [Op.like]: `%${searchValue}%` } },
    { c_city: { [Op.like]: `%${searchValue}%` } },
    { c_mobi1: { [Op.like]: `%${searchValue}%` } },
    { c_mobi2: { [Op.like]: `%${searchValue}%` } },
    { c_pin: { [Op.like]: `%${searchValue}%` } },
    { c_rank: { [Op.like]: `%${searchValue}%` } },
    { c_state: { [Op.like]: `%${searchValue}%` } },
    { c_tel1: { [Op.like]: `%${searchValue}%` } },
    { c_tel2: { [Op.like]: `%${searchValue}%` } },
    { c_vessel: { [Op.like]: `%${searchValue}%` } },
    { dob: { [Op.like]: `%${searchValue}%` } },
    { editedby: { [Op.like]: `%${searchValue}%` } },
    { email1: { [Op.like]: `%${searchValue}%` } },
    { email2: { [Op.like]: `%${searchValue}%` } },
    { experience: { [Op.like]: `%${searchValue}%` } },
    { fname: { [Op.like]: `%${searchValue}%` } },
    { grade: { [Op.like]: `%${searchValue}%` } },
    { height: { [Op.like]: `%${searchValue}%` } },
    { imp_discussion: { [Op.like]: `%${searchValue}%` } },
    { indos_number: { [Op.like]: `%${searchValue}%` } },
    { ipadress: { [Op.like]: `%${searchValue}%` } },
    { joined_date: { [Op.like]: `%${searchValue}%` } },
    { last_company: { [Op.like]: `%${searchValue}%` } },
    { last_salary: { [Op.like]: `%${searchValue}%` } },
    { las_date: { [Op.like]: `%${searchValue}%` } },
    { las_time: { [Op.like]: `%${searchValue}%` } },
    { lname: { [Op.like]: `%${searchValue}%` } },
    { l_country: { [Op.like]: `%${searchValue}%` } },
    { mobile_code1: { [Op.like]: `%${searchValue}%` } },
    { mobile_code2: { [Op.like]: `%${searchValue}%` } },
    { m_status: { [Op.like]: `%${searchValue}%` } },
    { nationality: { [Op.like]: `%${searchValue}%` } },
    { other_mobile_code: { [Op.like]: `%${searchValue}%` } },
    { other_numbers: { [Op.like]: `%${searchValue}%` } },
    { photos: { [Op.like]: `%${searchValue}%` } },
    { p_ad1: { [Op.like]: `%${searchValue}%` } },
    { p_ad2: { [Op.like]: `%${searchValue}%` } },
    { p_city: { [Op.like]: `%${searchValue}%` } },
    { p_country: { [Op.like]: `%${searchValue}%` } },
    { p_mobi1: { [Op.like]: `%${searchValue}%` } },
    { p_mobi2: { [Op.like]: `%${searchValue}%` } },
    { p_pin: { [Op.like]: `%${searchValue}%` } },
    { p_rank: { [Op.like]: `%${searchValue}%` } },
    { p_state: { [Op.like]: `%${searchValue}%` } },
    { p_tel1: { [Op.like]: `%${searchValue}%` } },
    { p_tel2: { [Op.like]: `%${searchValue}%` } },
    { ref_check: { [Op.like]: `%${searchValue}%` } },
    { resume: { [Op.like]: `%${searchValue}%` } },
    { resume_upload_date: { [Op.like]: `%${searchValue}%` } },
    { safety_shoe_size: { [Op.like]: `%${searchValue}%` } },
    { skype: { [Op.like]: `%${searchValue}%` } },
    { stcw: { [Op.like]: `%${searchValue}%` } },
    { weight: { [Op.like]: `%${searchValue}%` } },
    { work_nautilus: { [Op.like]: `%${searchValue}%` } },
    { zone: { [Op.like]: `%${searchValue}%` } },
    { group: { [Op.like]: `%${searchValue}%` } },
    { vendor: { [Op.like]: `%${searchValue}%` } },
    ]
    },
    include: [
    discussionplus,
    contract,
    cdocument,
    bank,
    travel,
    medical,
    NKD, // Include CandidateNkds here
    // Add more models to include here...
    ]
    }),
    NKD.findAll({
    where: {
    [Op.or]: [
    { candidateId: { [Op.like]: `%${searchValue}%` } },
    { kin_name: { [Op.like]: `%${searchValue}%` } },
    { kin_relation: { [Op.like]: `%${searchValue}%` } },
    { kin_contact_number: { [Op.like]: `%${searchValue}%` } },
    { kin_contact_address: { [Op.like]: `%${searchValue}%` } },
    { kin_priority: { [Op.like]: `%${searchValue}%` } },
    // Add more conditions for NKD model...
    ]
    },
    }),
    bank.findAll({
    where: {
    [Op.or]: [
    { bank_name: { [Op.like]: `%${searchValue}%` } },
    { account_num: { [Op.like]: `%${searchValue}%` } },
    { bank_addr: { [Op.like]: `%${searchValue}%` } },
    { ifsc_code: { [Op.like]: `%${searchValue}%` } },
    { swift_code: { [Op.like]: `%${searchValue}%` } },
    { beneficiary: { [Op.like]: `%${searchValue}%` } },
    { beneficiary_addr: { [Op.like]: `%${searchValue}%` } },
    { pan_num: { [Op.like]: `%${searchValue}%` } },
    { passbook: { [Op.like]: `%${searchValue}%` } },
    { pan_card: { [Op.like]: `%${searchValue}%` } },
    { branch: { [Op.like]: `%${searchValue}%` } },
    { types: { [Op.like]: `%${searchValue}%` } },
    { created_by: { [Op.like]: `%${searchValue}%` } },
    // Add more conditions for Bank model...
    ],
    },
    }),
    medical.findAll({
    where: {
    [Op.or]: [
    { hospitalName: { [Op.like]: `%${searchValue}%` } },
    { place: { [Op.like]: `%${searchValue}%` } },
    { date: { [Op.like]: `%${searchValue}%` } },
    { expiry_date: { [Op.like]: `%${searchValue}%` } },
    { done_by: { [Op.like]: `%${searchValue}%` } },
    { status: { [Op.like]: `%${searchValue}%` } },
    { amount: { [Op.like]: `%${searchValue}%` } },
    { upload: { [Op.like]: `%${searchValue}%` } },
    { created_by: { [Op.like]: `%${searchValue}%` } },
    
    // Add more conditions for Medical model...
    ],
    },
    }),
    travel.findAll({
    where: {
    [Op.or]: [
    { travel_date: { [Op.like]: `%${searchValue}%` } },
    { travel_from: { [Op.like]: `%${searchValue}%` } },
    { travel_to: { [Op.like]: `%${searchValue}%` } },
    { travel_mode: { [Op.like]: `%${searchValue}%` } },
    { travel_status: { [Op.like]: `%${searchValue}%` } },
    { ticket_number: { [Op.like]: `%${searchValue}%` } },
    { agent_name: { [Op.like]: `%${searchValue}%` } },
    { portAgent: { [Op.like]: `%${searchValue}%` } },
    { travel_amount: { [Op.like]: `%${searchValue}%` } },
    {reason: { [Op.like]: `%${searchValue}%` } },
    { created_by: { [Op.like]: `%${searchValue}%` } },
    
    
    // Add more conditions for Travel model...
    ],
    },
    }),
    contract.findAll({
    where: {
    [Op.or]: [
    { rank: { [Op.like]: `%${searchValue}%` } },
    { company: { [Op.like]: `%${searchValue}%` } },
    { vslName: { [Op.like]: `%${searchValue}%` } },
    { vesselType: { [Op.like]: `%${searchValue}%` } },
    { sign_on_port: { [Op.like]: `%${searchValue}%` } },
    { sign_on: { [Op.like]: `%${searchValue}%` } },
    { wages: { [Op.like]: `%${searchValue}%` } },
    { wage_start: { [Op.like]: `%${searchValue}%` } },
    { eoc: { [Op.like]: `%${searchValue}%` } },
    { currency: { [Op.like]: `%${searchValue}%` } },
    { wages_types: { [Op.like]: `%${searchValue}%` } },
    { sign_off_port: { [Op.like]: `%${searchValue}%` } },
    { sign_off: { [Op.like]: `%${searchValue}%` } },
    { reason_for_sign_off: { [Op.like]: `%${searchValue}%` } },
    { documents: { [Op.like]: `%${searchValue}%` } },
    { aoa: { [Op.like]: `%${searchValue}%` } },
    { aoa_number: { [Op.like]: `%${searchValue}%` } },
    { emigrate_number: { [Op.like]: `%${searchValue}%` } },
    { created_by: { [Op.like]: `%${searchValue}%` } },
    
    // Add more conditions for Contract model...
    ]
    },
    }),
    cdocument.findAll({
    where: {
    [Op.or]: [
    { document: { [Op.like]: `%${searchValue}%` } },
    { document_number: { [Op.like]: `%${searchValue}%` } },
    { issue_date: { [Op.like]: `%${searchValue}%` } },
    { issue_place: { [Op.like]: `%${searchValue}%` } },
    { expiry_date: { [Op.like]: `%${searchValue}%` } },
    { document_files: { [Op.like]: `%${searchValue}%` } },
    { stcw: { [Op.like]: `%${searchValue}%` } },
    // Add more conditions for cDocument model...
    ]
    },
    })
    
    
    ]);
    
    // Check if there are any results
    const hasResults = candidateResults.length > 0 || nkdResults.length > 0 || bankResults.length > 0 || medicalResults.length > 0 || travelResults.length > 0 || contractResults.length > 0 || cdocumentsResults.length > 0;
    
    if (hasResults) {
    console.log('Search Results:', candidateResults, nkdResults, bankResults, medicalResults, travelResults, contractResults, cdocumentsResults);
    res.json({ success: true, candidateResults, nkdResults, bankResults, medicalResults, travelResults, contractResults, cdocumentsResults });
    } else {
    console.log('No results found');
    res.json({ success: false, message: 'No results found' });
    }
}
else if(userGroup === 'vendor'){
    const [candidateResults, nkdResults,bankResults,medicalResults,travelResults,contractResults,cdocumentsResults] = await Promise.all([
        Candidate.findAll({
        where: {
            userId: userIdSearch,
        [Op.or]: [
        { candidateId: { [Op.like]: `%${searchValue}%` } },
        { active_details: { [Op.like]: `%${searchValue}%` } },
        { area_code1: { [Op.like]: `%${searchValue}%` } },
        { area_code2: { [Op.like]: `%${searchValue}%` } },
        { avb_date: { [Op.like]: `%${searchValue}%` } },
        { birth_place: { [Op.like]: `%${searchValue}%` } },
        { boiler_suit_size: { [Op.like]: `%${searchValue}%` } },
        { category: { [Op.like]: `%${searchValue}%` } },
        { company_status: { [Op.like]: `%${searchValue}%` } },
        { createdby: { [Op.like]: `%${searchValue}%` } },
        { cr_date: { [Op.like]: `%${searchValue}%` } },
        { cr_time: { [Op.like]: `%${searchValue}%` } },
        { c_ad1: { [Op.like]: `%${searchValue}%` } },
        { c_ad2: { [Op.like]: `%${searchValue}%` } },
        { c_city: { [Op.like]: `%${searchValue}%` } },
        { c_mobi1: { [Op.like]: `%${searchValue}%` } },
        { c_mobi2: { [Op.like]: `%${searchValue}%` } },
        { c_pin: { [Op.like]: `%${searchValue}%` } },
        { c_rank: { [Op.like]: `%${searchValue}%` } },
        { c_state: { [Op.like]: `%${searchValue}%` } },
        { c_tel1: { [Op.like]: `%${searchValue}%` } },
        { c_tel2: { [Op.like]: `%${searchValue}%` } },
        { c_vessel: { [Op.like]: `%${searchValue}%` } },
        { dob: { [Op.like]: `%${searchValue}%` } },
        { editedby: { [Op.like]: `%${searchValue}%` } },
        { email1: { [Op.like]: `%${searchValue}%` } },
        { email2: { [Op.like]: `%${searchValue}%` } },
        { experience: { [Op.like]: `%${searchValue}%` } },
        { fname: { [Op.like]: `%${searchValue}%` } },
        { grade: { [Op.like]: `%${searchValue}%` } },
        { height: { [Op.like]: `%${searchValue}%` } },
        { imp_discussion: { [Op.like]: `%${searchValue}%` } },
        { indos_number: { [Op.like]: `%${searchValue}%` } },
        { ipadress: { [Op.like]: `%${searchValue}%` } },
        { joined_date: { [Op.like]: `%${searchValue}%` } },
        { last_company: { [Op.like]: `%${searchValue}%` } },
        { last_salary: { [Op.like]: `%${searchValue}%` } },
        { las_date: { [Op.like]: `%${searchValue}%` } },
        { las_time: { [Op.like]: `%${searchValue}%` } },
        { lname: { [Op.like]: `%${searchValue}%` } },
        { l_country: { [Op.like]: `%${searchValue}%` } },
        { mobile_code1: { [Op.like]: `%${searchValue}%` } },
        { mobile_code2: { [Op.like]: `%${searchValue}%` } },
        { m_status: { [Op.like]: `%${searchValue}%` } },
        { nationality: { [Op.like]: `%${searchValue}%` } },
        { other_mobile_code: { [Op.like]: `%${searchValue}%` } },
        { other_numbers: { [Op.like]: `%${searchValue}%` } },
        { photos: { [Op.like]: `%${searchValue}%` } },
        { p_ad1: { [Op.like]: `%${searchValue}%` } },
        { p_ad2: { [Op.like]: `%${searchValue}%` } },
        { p_city: { [Op.like]: `%${searchValue}%` } },
        { p_country: { [Op.like]: `%${searchValue}%` } },
        { p_mobi1: { [Op.like]: `%${searchValue}%` } },
        { p_mobi2: { [Op.like]: `%${searchValue}%` } },
        { p_pin: { [Op.like]: `%${searchValue}%` } },
        { p_rank: { [Op.like]: `%${searchValue}%` } },
        { p_state: { [Op.like]: `%${searchValue}%` } },
        { p_tel1: { [Op.like]: `%${searchValue}%` } },
        { p_tel2: { [Op.like]: `%${searchValue}%` } },
        { ref_check: { [Op.like]: `%${searchValue}%` } },
        { resume: { [Op.like]: `%${searchValue}%` } },
        { resume_upload_date: { [Op.like]: `%${searchValue}%` } },
        { safety_shoe_size: { [Op.like]: `%${searchValue}%` } },
        { skype: { [Op.like]: `%${searchValue}%` } },
        { stcw: { [Op.like]: `%${searchValue}%` } },
        { weight: { [Op.like]: `%${searchValue}%` } },
        { work_nautilus: { [Op.like]: `%${searchValue}%` } },
        { zone: { [Op.like]: `%${searchValue}%` } },
        { group: { [Op.like]: `%${searchValue}%` } },
        { vendor: { [Op.like]: `%${searchValue}%` } },
        ]
        },
        include: [
        discussionplus,
        contract,
        cdocument,
        bank,
        travel,
        medical,
        NKD, // Include CandidateNkds here
        // Add more models to include here...
        ]
        }),
        NKD.findAll({
        where: {
        [Op.or]: [
        { candidateId: { [Op.like]: `%${searchValue}%` } },
        { kin_name: { [Op.like]: `%${searchValue}%` } },
        { kin_relation: { [Op.like]: `%${searchValue}%` } },
        { kin_contact_number: { [Op.like]: `%${searchValue}%` } },
        { kin_contact_address: { [Op.like]: `%${searchValue}%` } },
        { kin_priority: { [Op.like]: `%${searchValue}%` } },
        // Add more conditions for NKD model...
        ]
        },
        }),
        bank.findAll({
        where: {
        [Op.or]: [
        { bank_name: { [Op.like]: `%${searchValue}%` } },
        { account_num: { [Op.like]: `%${searchValue}%` } },
        { bank_addr: { [Op.like]: `%${searchValue}%` } },
        { ifsc_code: { [Op.like]: `%${searchValue}%` } },
        { swift_code: { [Op.like]: `%${searchValue}%` } },
        { beneficiary: { [Op.like]: `%${searchValue}%` } },
        { beneficiary_addr: { [Op.like]: `%${searchValue}%` } },
        { pan_num: { [Op.like]: `%${searchValue}%` } },
        { passbook: { [Op.like]: `%${searchValue}%` } },
        { pan_card: { [Op.like]: `%${searchValue}%` } },
        { branch: { [Op.like]: `%${searchValue}%` } },
        { types: { [Op.like]: `%${searchValue}%` } },
        { created_by: { [Op.like]: `%${searchValue}%` } },
        // Add more conditions for Bank model...
        ],
        },
        }),
        medical.findAll({
        where: {
        [Op.or]: [
        { hospitalName: { [Op.like]: `%${searchValue}%` } },
        { place: { [Op.like]: `%${searchValue}%` } },
        { date: { [Op.like]: `%${searchValue}%` } },
        { expiry_date: { [Op.like]: `%${searchValue}%` } },
        { done_by: { [Op.like]: `%${searchValue}%` } },
        { status: { [Op.like]: `%${searchValue}%` } },
        { amount: { [Op.like]: `%${searchValue}%` } },
        { upload: { [Op.like]: `%${searchValue}%` } },
        { created_by: { [Op.like]: `%${searchValue}%` } },
        
        // Add more conditions for Medical model...
        ],
        },
        }),
        travel.findAll({
        where: {
        [Op.or]: [
        { travel_date: { [Op.like]: `%${searchValue}%` } },
        { travel_from: { [Op.like]: `%${searchValue}%` } },
        { travel_to: { [Op.like]: `%${searchValue}%` } },
        { travel_mode: { [Op.like]: `%${searchValue}%` } },
        { travel_status: { [Op.like]: `%${searchValue}%` } },
        { ticket_number: { [Op.like]: `%${searchValue}%` } },
        { agent_name: { [Op.like]: `%${searchValue}%` } },
        { portAgent: { [Op.like]: `%${searchValue}%` } },
        { travel_amount: { [Op.like]: `%${searchValue}%` } },
        {reason: { [Op.like]: `%${searchValue}%` } },
        { created_by: { [Op.like]: `%${searchValue}%` } },
        
        
        // Add more conditions for Travel model...
        ],
        },
        }),
        contract.findAll({
        where: {
        [Op.or]: [
        { rank: { [Op.like]: `%${searchValue}%` } },
        { company: { [Op.like]: `%${searchValue}%` } },
        { vslName: { [Op.like]: `%${searchValue}%` } },
        { vesselType: { [Op.like]: `%${searchValue}%` } },
        { sign_on_port: { [Op.like]: `%${searchValue}%` } },
        { sign_on: { [Op.like]: `%${searchValue}%` } },
        { wages: { [Op.like]: `%${searchValue}%` } },
        { wage_start: { [Op.like]: `%${searchValue}%` } },
        { eoc: { [Op.like]: `%${searchValue}%` } },
        { currency: { [Op.like]: `%${searchValue}%` } },
        { wages_types: { [Op.like]: `%${searchValue}%` } },
        { sign_off_port: { [Op.like]: `%${searchValue}%` } },
        { sign_off: { [Op.like]: `%${searchValue}%` } },
        { reason_for_sign_off: { [Op.like]: `%${searchValue}%` } },
        { documents: { [Op.like]: `%${searchValue}%` } },
        { aoa: { [Op.like]: `%${searchValue}%` } },
        { aoa_number: { [Op.like]: `%${searchValue}%` } },
        { emigrate_number: { [Op.like]: `%${searchValue}%` } },
        { created_by: { [Op.like]: `%${searchValue}%` } },
        
        // Add more conditions for Contract model...
        ]
        },
        }),
        cdocument.findAll({
        where: {
        [Op.or]: [
        { document: { [Op.like]: `%${searchValue}%` } },
        { document_number: { [Op.like]: `%${searchValue}%` } },
        { issue_date: { [Op.like]: `%${searchValue}%` } },
        { issue_place: { [Op.like]: `%${searchValue}%` } },
        { expiry_date: { [Op.like]: `%${searchValue}%` } },
        { document_files: { [Op.like]: `%${searchValue}%` } },
        { stcw: { [Op.like]: `%${searchValue}%` } },
        // Add more conditions for cDocument model...
        ]
        },
        })
        
        
        ]);
        
        // Check if there are any results
        const hasResults = candidateResults.length > 0 || nkdResults.length > 0 || bankResults.length > 0 || medicalResults.length > 0 || travelResults.length > 0 || contractResults.length > 0 || cdocumentsResults.length > 0;
        
        if (hasResults) {
        console.log('Search Results:', candidateResults, nkdResults, bankResults, medicalResults, travelResults, contractResults, cdocumentsResults);
        res.json({ success: true, candidateResults, nkdResults, bankResults, medicalResults, travelResults, contractResults, cdocumentsResults });
        } else {
        console.log('No results found');
        res.json({ success: false, message: 'No results found' });
        }
}
else{
    console.log('No results found');
    res.json({ success: false, message: 'No results found' });
}
    } catch (error) {
    console.error('Error in search operation:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
    });
    

    
    // app.post('/searchspl', async (req, res) => {
    // try {
    // const { nemoId, name, rank, vsl, experience, grade, status, license, zone, avb_date, las_date,group } = req.body;
    // const searchCriteria = {};
    // if (nemoId) {
    // searchCriteria.candidateId = nemoId;
    // }
    // if (name) {
    // searchCriteria.fname = name;
    // }
    // if (rank) {
    // searchCriteria.c_rank = rank;
    // }
    // if (vsl) {
    // searchCriteria.c_vessel = vsl;
    // }
    // if (experience) {
    // searchCriteria.experience = experience;
    // }
    // if (grade) {
    // searchCriteria.grade = grade;
    // }
    // if (status) {
    // searchCriteria.company_status = status;
    // }
    // if (license) {
    // searchCriteria.l_country = license;
    // }
    // if (zone) {
    // searchCriteria.zone = zone;
    // }
    // if(group)
    // {
    // searchCriteria.group = group
    // }
    // if (avb_date && las_date) {
    //     searchCriteria.avb_date = {
    //         [Op.between]: [avb_date, las_date]
    //     };
    // } else if (avb_date) {
    //     // If only avb_date is provided, search for candidates with avb_date equal to or greater than avb_date
    //     searchCriteria.avb_date = {
    //         [Op.gte]: avb_date
    //     };
    // } else if (las_date) {
    //     // If only las_date is provided, search for candidates with las_date equal to or less than las_date
    //     searchCriteria.avb_date = {
    //         [Op.lte]: las_date
    //     };
    // }
    
    
    // // Perform the search
    // const results = await Candidate.findAll({
    // where: searchCriteria
    // });
    
    // res.json(results);
    // } catch (error) {
    // console.error('Error:', error);
    // res.status(500).json({ error: 'Internal Server Error' });
    // }
    // });

// app.post('/searchspl', async (req, res) => {
//     try {
//         const { nemoId, name, rank, vsl, experience, grade, status, license, zone, avb_date, las_date, group, age } = req.body;
//         const searchCriteria = {};

//         if (nemoId) {
//             searchCriteria.candidateId = nemoId;
//         }
//         if (name) {
//             searchCriteria.fname = name;
//         }
//         if (rank) {
//             searchCriteria.c_rank = rank;
//         }
//         if (vsl) {
//             searchCriteria.c_vessel = vsl;
//         }
//         if (experience) {
//             searchCriteria.experience = experience;
//         }
//         if (grade) {
//             searchCriteria.grade = grade;
//         }
//         if (status) {
//             searchCriteria.company_status = status;
//         }
//         if (license) {
//             searchCriteria.l_country = license;
//         }
//         if (zone) {
//             searchCriteria.zone = zone;
//         }
//         if (group) {
//             searchCriteria.group = group;
//         }
//         if (avb_date && las_date) {
//             searchCriteria.avb_date = {
//                 [Op.between]: [avb_date, las_date]
//             };
//         } else if (avb_date) {
//             searchCriteria.avb_date = {
//                 [Op.gte]: avb_date
//             };
//         } else if (las_date) {
//             searchCriteria.avb_date = {
//                 [Op.lte]: las_date
//             };
//         }

//         // Calculate age based on date of birth (dob) if age is provided
//         if (age) {
//             const today = new Date();
//             const birthDateCriteria = {
//                 [Op.lte]: new Date(today.getFullYear() - age, today.getMonth(), today.getDate()),
//                 [Op.gte]: new Date(today.getFullYear() - age - 1, today.getMonth(), today.getDate())
//             };

//             searchCriteria.dob = birthDateCriteria;
//         }

//         // Perform the search
//         const results = await Candidate.findAll({
//             where: searchCriteria
//         });

//         res.json(results);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

app.post('/searchspl', async (req, res) => {
    try {
        const { nemoId, name, rank, vsl, experience, grade, status, license, zone, avb_date, las_date, group, fromAge, toAge } = req.body;
        const searchCriteria = {};

        if (nemoId) {
            searchCriteria.candidateId = nemoId;
        }
        if (name) {
            searchCriteria.fname = name;
        }
        if (rank) {
            searchCriteria.c_rank = rank;
        }
        if (vsl) {
            searchCriteria.c_vessel = vsl;
        }
        if (experience) {
            searchCriteria.experience = experience;
        }
        if (grade) {
            searchCriteria.grade = grade;
        }
        if (status) {
            searchCriteria.company_status = status;
        }
        if (license) {
            searchCriteria.l_country = license;
        }
        if (zone) {
            searchCriteria.zone = zone;
        }
        if (group) {
            searchCriteria.group = group;
        }
        if (avb_date && las_date) {
            searchCriteria.avb_date = {
                [Op.between]: [avb_date, las_date]
            };
        } else if (avb_date) {
            searchCriteria.avb_date = {
                [Op.gte]: avb_date
            };
        } else if (las_date) {
            searchCriteria.avb_date = {
                [Op.lte]: las_date
            };
        }

        // Calculate age range based on fromAge and toAge
        if (fromAge || toAge) {
            const today = new Date();
            const from = fromAge ? parseInt(fromAge) : 18;
            const to = toAge ? parseInt(toAge) : 100;
            
            const birthDateCriteria = {
                [Op.lte]: new Date(today.getFullYear() - from, today.getMonth(), today.getDate()),
                [Op.gte]: new Date(today.getFullYear() - to, today.getMonth(), today.getDate())
            };

            searchCriteria.dob = birthDateCriteria;
        }

        // Perform the search
        const results = await Candidate.findAll({
            where: searchCriteria
        });

        res.json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const PasswordRoutes=require('./routes/forgotpassword');
const Forgotpassword=require('./models/forgotpassword');
  
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);
app.use('/password',PasswordRoutes);

const cPasswordRoutes = require('./routes/c_forgotpassword');
const cForgotpassword = require('./models/c_forgotpassword');
const Discussion = require("./models/discussion");
  
Candidate.hasMany(cForgotpassword);
cForgotpassword.belongsTo(Candidate);
app.use('/candidate-password', cPasswordRoutes);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/evaluation');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/photos');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/tickets');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const storage3 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/resume');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const storage4 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const storage5 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/uploads/contract');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const storage6 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/uploads/aoa');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const storage7 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/uploads/medical');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const storage8 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/bank_details');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const storage9 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/bank_details/pan_card');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const upload1 = multer({ storage: storage1 });
const upload2 = multer({ storage: storage2 });
const upload3 = multer({ storage: storage3 });
const upload4 = multer({ storage: storage4 });
const upload5 = multer({ storage: storage5 });
const upload6 = multer({ storage: storage6 });
const upload7 = multer({ storage: storage7 });
const upload8 = multer({ storage: storage8 });
const upload9 = multer({ storage: storage9 });
const evaluationDirectory = '/views/public/files/evaluation';
const bankDirectory = '/var/www/html/nemonode/views/public/bank_details';
const pancardDirectory = '/var/www/html/nemonode/views/public/bank_details/pan_card';
const photosDirectory = '/var/www/html/nemonode/views/public/files/photos';
const resumeDirectory = '/var/www/html/nemonode/views/public/files/resume';
const ticketsDirectory = '/var/www/html/nemonode/views/public/files/tickets';
const documentDirectory = '/var/www/html/nemonode/views/public/files'
const contractDirectory = '/var/www/html/nemonode/views/public/uploads/contract'
const aoaDirectory = '/var/www/html/nemonode/views/public/uploads/aoa'
const medicalDirectory = '/var/www/html/nemonode/views/public/uploads/medical'
// Serve static files from the evaluation directory

app.use(express.static('/views/public/files'));
app.use(express.static('/views/public/uploads'));
app.use(express.static('/views/public/bank_details'));
app.use('/documents',express.static(documentDirectory))
app.use('/photos', express.static(photosDirectory));
app.use('/tickets', express.static(ticketsDirectory));  
app.use('/resume', express.static(resumeDirectory));
app.use('/contract', express.static(contractDirectory));
app.use('/aoa', express.static(aoaDirectory));
app.use('/medical', express.static(medicalDirectory));
app.use('/evaluation', express.static(evaluationDirectory));
app.use('/bank_details', express.static(bankDirectory));
app.use('/bank_details/pan_card', express.static(pancardDirectory));
// Serve static files from various directories
// Route to handle file uploads 
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload1', upload1.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload2', upload2.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload3', upload3.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload4', upload4.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload5', upload5.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload6', upload6.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload7', upload7.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload8', upload8.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});

app.post('/upload9', upload9.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('Error uploading file');
    }
});


// Route to fetch files based on candidateId
app.get('/fetch-files/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(evaluationDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/evaluation/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});

app.get('/fetch-files1/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(photosDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/photos/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});
app.get('/fetch-files2/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(resumeDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/resume/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});
app.get('/fetch-files3/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(ticketsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/tickets/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});

app.get('/fetch-files4/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(contractDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/contract/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});




app.get('/fetch-files5/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(aoaDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/aoa/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});



app.get('/fetch-files6/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(medicalDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/medical/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});
app.get('/fetch-files7/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(bankDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/bank_details/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});

app.get('/fetch-files8/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(pancardDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/bank_details/pan_card/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});

app.get('/fetch-files9/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    // Read the contents of the directory
    fs.readdir(documentDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter files based on the candidateId pattern
        const candidateFiles = files.filter(file => {
            const fileName = file.split('_')[0]; // Get the part before the first underscore
            return fileName === candidateId;
        });

        // Construct the file names (relative paths)
        const fileNames = candidateFiles.map(file => `/${file}`);

        // Send the list of file names to the client
        res.json(fileNames);
    });
});


// Middleware for serving files dynamically
app.use((req, res, next) => {
    const viewPath = path.join(__dirname, req.path);
    console.log("DIRNAME",__dirname,"PATH",req.path)
    const decodedPath = decodeURIComponent(viewPath); // Decode URL
    res.sendFile(decodedPath, (err) => {
        if (err) {
            console.error('Error serving file:', err);
            console.error('Requested URL:', req.url);
            console.error('Resolved File Path:', decodedPath);
            res.status(err.status || 500).send('Internal Server Error');
        } else {
            console.log('File sent successfully:', decodedPath);
        }
    });
});


sequelize.sync(/*{force:true},*/{logging: console.log})
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error syncing Sequelize:', error);
    });