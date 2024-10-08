const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        console.log(req.body)
        const user = await User.findOne({where : { userEmail: email }});
        // console.log(user)
        const userId = user.id
        if(user){
            const id = uuid.v4();
            user.createForgotpassword({ id , isactive: true })
            .then(response=>console.log(response))
                .catch(err => {
                    throw new Error(err)
                })

                const client = Sib.ApiClient.instance
                const apiKey = client.authentications['api-key']
                apiKey.apiKey = process.env.BREVO_API_KEY
                const tranEmailApi = new Sib.TransactionalEmailsApi()
                const sender ={
                        email:'mccivistasolutions@gmail.com',
                        name:'I-Vistaz'
                    }
                    const receivers = [
                        {
                            email:email
                        }
                    ]
                    
                         tranEmailApi.sendTransacEmail({
                             sender,
                             to:receivers,
                             subject:'Reset Password',
                             htmlContent: `<a>Click <a href="https://nsnemo.com/password/resetpassword/${id}">here</a> to reset your password for Nsnemo</a>`,
                            }).then(result=>console.log(result))
                         .catch(err=>console.log(err))
                      
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}
const updatepassword = async (req, res) => {
    try {
        const { password } = req.body;
        const resetpasswordid = req.params.id;

        console.log(password);

        const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });

        if (resetpasswordrequest) {
            const user = await User.findOne({ where: { id: resetpasswordrequest.UserId } });

            if (user) {
                // Use bcrypt.hash directly without genSalt for simplicity
                const hash = await bcrypt.hash(password, 10);

                // Store hash in your password DB.
                await user.update({ userPassword: hash });

                return res.status(201).json({ message: 'Successfully updated the new password', success: true });
            } else {
                return res.status(404).json({ error: 'No user exists', success: false });
            }
        } else {
            return res.status(404).json({ error: 'Invalid resetpasswordid parameter', success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error, success: false });
    }
};



const resetpassword = async (req, res) => {
    const id = req.params.id;

    try {
        if (!id) {
            return res.status(400).json({ error: 'Missing id parameter', success: false });
        }

        const forgotpasswordrequest = await Forgotpassword.findOne({ where: { id } });

        if (forgotpasswordrequest) {
            // Correct the attribute name to 'isactive'
            await forgotpasswordrequest.update({ isactive: false });

            return res.status(200).send(`
                <html>
                   <head>
                       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                       <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
                   </head>
                   <body>
                       <div class="container vh-100 d-flex justify-content-center align-items-center">
                           <div class="card shadow-lg p-4" style="max-width: 400px; width: 100%;">
                               <h2 class="text-center mb-4">Reset Password</h2>
                               <form id="submit_form">
                                   <div class="mb-3">
                                       <label for="newpassword" class="form-label">Enter New Password</label>
                                       <input type="password" class="form-control" id="pass" name="newpassword" placeholder="New Password" required>
                                   </div>
                                   <button type="submit" class="btn btn-primary w-100">Reset Password for Nemo</button>
                               </form>
                           </div>
                       </div>
                       <script>
                           document.getElementById('submit_form').addEventListener('submit', async function (e) {
                               e.preventDefault();
                               const newpassword = document.getElementById('pass').value;
                               console.log(newpassword);            
                               const data = {
                                   password: newpassword
                               };
                               const response = await axios.post('https://nsnemo.com/password/updatepassword/${id}', data);
                               console.log(response.data);
                           });
                       </script>
                   </body>
                </html>
            `);
        } else {
            return res.status(404).json({ error: 'Invalid id parameter', success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error, success: false });
    }
};




module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}