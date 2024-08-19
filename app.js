const express = require("express")
require('dotenv').config()
const fs = require('fs-extra')
const PORT = process.env.PORT;
const axios = require('axios')
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
const { QueryTypes } = require('sequelize');


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.get('/home', (req, res) => {
    res.redirect("/aaaa.html");
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
const Rank = require("./models/ranks");
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
    const userGroup = req.body.userGroup;

    if (userGroup !== 'admin' && userGroup !== 'vendor') {
        return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
    }

    try {
        const fields = [
            'candidateId', 'active_details', 'area_code1', 'area_code2', 'avb_date', 'birth_place', 
            'boiler_suit_size', 'category', 'company_status', 'createdby', 'cr_date', 'cr_time', 
            'c_ad1', 'c_ad2', 'c_city', 'c_mobi1', 'c_mobi2', 'c_pin', 'c_rank', 'c_state', 
            'c_tel1', 'c_tel2', 'c_vessel', 'dob', 'editedby', 'email1', 'email2', 'experience', 
            'fname', 'grade', 'height', 'imp_discussion', 'indos_number', 'ipadress', 'joined_date', 
            'last_company', 'last_salary', 'las_date', 'las_time', 'lname', 'l_country', 'mobile_code1', 
            'mobile_code2', 'm_status', 'nationality', 'other_mobile_code', 'other_numbers', 'photos', 
            'p_ad1', 'p_ad2', 'p_city', 'p_country', 'p_mobi1', 'p_mobi2', 'p_pin', 'p_rank', 'p_state', 
            'p_tel1', 'p_tel2', 'ref_check', 'resume', 'resume_upload_date', 'safety_shoe_size', 
            'skype', 'stcw', 'weight', 'work_nautilus', 'zone', 'vendor'
        ];

        const searchConditions = fields.map(field => `${field} LIKE :searchValue`).join(' OR ');
        const orderByCase = fields.map((field, index) => `WHEN ${field} LIKE :searchValue THEN ${index}`).join(' ');

        let query = `
            SELECT * FROM Candidates
            WHERE (${searchConditions})
            ORDER BY CASE 
                ${orderByCase}
                ELSE ${fields.length}
            END
        `;

        if (userGroup === 'vendor') {
            query += ` AND userId = :userIdSearch`;
        }

        const replacements = {
            searchValue: `%${searchValue}%`,
            userIdSearch: userIdSearch,
        };

        const candidateResults = await sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT,
        });

        if (candidateResults.length > 0) {
            console.log('Search Results:', candidateResults);
            res.json({ success: true, candidateResults });
        } else {
            console.log('No results found');
            res.json({ success: false, message: 'No results found' });
        }
    } catch (error) {
        console.error('Error in search operation:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.post('/searchspl', async (req, res) => {
    try {
        const { nemoId, name, rank, vsl, experience, grade, status, license, zone, avb_date, las_date, group, fromAge, toAge, c_mobi1,email1 } = req.body;
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
        if(c_mobi1){
            searchCriteria.c_mobi1=c_mobi1
        }
        if(email1){
            searchCriteria.email1=email1
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

app.post('/send-email', async (req, res) => {
    console.log('Request received');
    const { base64File } = req.body;
    console.log('key +>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>',process.env.BREVO_API_KEY)
    const emailData = {
        sender: { email: "mccivistasolutions@gmail.com" }, // Replace with your email
        to: [
            { email: "crewing@nautilusshipping.com" },
            { email: "operations@nautilusshipping.com" }
        ], // Recipient email addresses
        subject: "Contracts Due Report",
        htmlContent: "<p>Please find the attached Excel file.</p>",
        attachment: [{
            name: "ContractsTable.xlsx",
            content: base64File,
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }]
    };

    try {
        console.log(process.env.BREVO_API_KEY)
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY // Ensure this is correct
                
            }
        });
        res.status(200).json({ success: true, info: response.data });
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: error.response ? error.response.data : error.message });
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

const fileFilter1 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|img/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};

const fileFilter3 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /pdf|docx|xls|xlsx|doc/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf, .docx, .xls and .xlsx format allowed!'));
    }
};
const fileFilter2 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf format allowed!'));
    }
};

const fileFilter4 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /pdf|png|jpg|jpeg|img/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf, .png, .jpg, .jpeg, .img file format allowed!'));
    }
};
const fileFilter5 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf format allowed!'));
    }
};
const fileFilter6 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf format allowed!'));
    }
};

const fileFilter8 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /pdf|png|jpg|jpeg|img/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf, .png, .jpg, .jpeg, .img format allowed!'));
    }
};

const fileFilter9 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /pdf|png|jpg|jpeg|img/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf, .png, .jpg, .jpeg, .img format allowed!'));
    }
};
const fileFilter7 = (req, file, cb) => {
    // Allowed ext
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test(file.originalname.toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .pdf format allowed!'));
    }
};



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/evaluation');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});

const storage10 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/queries');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/photos');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/tickets');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});

const storage3 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files/resume');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});


const storage4 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/files');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});
const storage5 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/uploads/contract');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});
const storage6 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/uploads/aoa');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});
const storage7 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/uploads/medical');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});
const storage8 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/bank_details');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});
const storage9 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/var/www/html/nemonode/views/public/bank_details/pan_card');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
        const uniqueName = `${timestamp}_${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }  });
const upload1 = multer({ storage: storage1,
    limits: { fileSize: 10 * 1024 * 1024 },
fileFilter:fileFilter1  });
const upload2 = multer({ storage: storage2,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter:fileFilter2 });
const upload3 = multer({ storage: storage3,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter:fileFilter3
 });
const upload4 = multer({ storage: storage4,
    limits: { fileSize: 30 * 1024 * 1024 },
    fileFilter:fileFilter4
  });
const upload5 = multer({ storage: storage5,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter:fileFilter5  });
const upload6 = multer({ storage: storage6,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter:fileFilter6  });
const upload7 = multer({ storage: storage7,
    limits: { fileSize: 30 * 1024 * 1024 },
    fileFilter:fileFilter7
    });
const upload8 = multer({ storage: storage8,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter:fileFilter8  });
const upload9 = multer({ storage: storage9,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter:fileFilter9  });
    const upload10 = multer({ storage: storage10,
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter:fileFilter1  });
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
const queryDirectory = '/var/www/html/nemonode/views/public/files/queries'
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
app.use('/queries', express.static(queryDirectory));
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
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});

app.post('/upload2', upload2.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload3', upload3.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload4', upload4.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload5', upload5.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload6', upload6.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload7', upload7.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});
app.post('/upload8', upload8.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});

app.post('/upload9', upload9.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
    } else {
        res.status(400).send('Error uploading file');
    }
});

app.post('/upload10', upload10.single('file'), (req, res) => {
    if (req.file) {
        const filename = req.file.filename;
        res.status(200).send({filename});
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

app.get('/fetch-files10/:candidateId', (req, res) => {
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

// test file


