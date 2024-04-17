const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Candidate = sequelize.define('Candidate', {
    candidateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    active_details: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    qualifications:{
        type:Sequelize.STRING,
        allowNull:true
    },
       area_code1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    area_code2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    avb_date: {
        type: Sequelize.DATE,
        allowNull: true,

    },
    birth_place: {
        type: Sequelize.STRING,
        allowNull: true
    },
    boiler_suit_size: {
        type: Sequelize.STRING,
        allowNull: true
    },
    category: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    company_status: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdby: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cr_date: {
        type: Sequelize.DATE,
        allowNull:true
    },
    cr_time: {
        type: Sequelize.TIME,
        allowNull: true
    },
    c_ad1: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    c_ad2: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    c_city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    c_mobi1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    c_mobi2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    c_pin: {
        type: Sequelize.STRING,
        allowNull: true
    },
    c_rank: {
        type: Sequelize.STRING,
        allowNull: true
    },
    c_state: {
        type: Sequelize.STRING,
        allowNull: true
    },
    c_tel1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    c_tel2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    c_vessel: {
        type: Sequelize.STRING,
        allowNull: true
    },
    dob: {
        type: Sequelize.DATE,
        allowNull: true
    },
    editedby: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email1: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    email2: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    experience: {
        type: Sequelize.STRING,
        allowNull: true
    },
    fname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    grade: {
        type: Sequelize.STRING,
        allowNull: true
    },
    height: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imp_discussion: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    indos_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true 
    },
    ipadress: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue:""
    },
    joined_date: {
        type: Sequelize.DATE,
        allowNull: true
    },
    last_company: {
        type: Sequelize.STRING,
        allowNull: true
    },
    last_salary: {
        type: Sequelize.STRING,
        allowNull: true
    },
    las_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    las_time: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue:"00:00:00"
    },
    lname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    l_country: {
        type: Sequelize.STRING,
        allowNull: true
    },

    mobile_code1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    mobile_code2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    m_status: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nationality: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    ntbr:{
        type:  Sequelize.STRING,
        allowNull: true
      },
    other_mobile_code: {
        type: Sequelize.STRING,
        allowNull: true
    },
    other_numbers: {
        type: Sequelize.STRING,
        allowNull: true
    },
    photos: {
        type: Sequelize.STRING,
        allowNull: true
    },
    p_ad1: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    p_ad2: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    p_city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    p_country: {
        type: Sequelize.STRING,
        allowNull: true
    },
    p_mobi1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    p_mobi2: {
        type: Sequelize.STRING,
        allowNull: true
    },
  
    p_pin: {
        type: Sequelize.STRING,
        allowNull: true
    },
    p_rank: {
        type: Sequelize.STRING,
        allowNull: true
    },
    p_state: {
        type: Sequelize.STRING,
        allowNull: true
    },
    p_tel1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    p_tel2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ref_check: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    resume: {
        type: Sequelize.STRING,
        allowNull: true
    },
    resume_upload_date: {
        type: Sequelize.DATE,
        allowNull: true
    },
    safety_shoe_size: {
        type: Sequelize.STRING,
        allowNull: true
    },
    skype: {
        type: Sequelize.STRING,
        allowNull: true
    },
    stcw: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
 
    weight: {
        type: Sequelize.STRING,
        allowNull: true
    },
    work_nautilus: {
        type: Sequelize.STRING,
        allowNull: true
    },
    zone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    group:{
        type:Sequelize.STRING,
        allowNull:true
    },
    vendor:{
        type:Sequelize.STRING,
        allowNull:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:true
    },
    nemo_source:{
        type:Sequelize.STRING,
        allowNull:true,
    }
},{timestamps:false});

module.exports = Candidate;
