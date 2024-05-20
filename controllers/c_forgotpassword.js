const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const Candidate = require('../models/candidate');
const Forgotpassword = require('../models/c_forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        console.log(req.body)
        const candidate = await Candidate.findOne({where : { email1: email }});
        // console.log(user)
        const candidateId = candidate.candidateId
        if(candidate){
            const id = uuid.v4();
            candidate.createCForgotpassword({ id , isactive: true })
            .then(response=>console.log(response))
                .catch(err => {
                    throw new Error(err)
                })

                const client = Sib.ApiClient.instance
                const apiKey = client.authentications['api-key']
                apiKey.apiKey = process.env.BREVO_API_KEY
                const tranEmailApi = new Sib.TransactionalEmailsApi()
                const sender ={
                        email:'sibbe.sharpener@gmail.com',
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
                             htmlContent: `<a>Click <a href="https://nemo.ivistaz.co/candidate-password/resetpassword/${id}">here</a> to reset your password for Nsnemo</a>`,
                            }).then(result=>console.log(result))
                         .catch(err=>console.log(err))
                      
        }else {
            throw new Error('Candidate doesnt exist')
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
            const candidate = await Candidate.findOne({ where: { candidateId: resetpasswordrequest.CandidateCandidateId } });

            if (candidate) {
                // Use bcrypt.hash directly without genSalt for simplicity
                const hash = await bcrypt.hash(password, 10);

                // Store hash in your password DB.
                await candidate.update({ password: hash });

                return res.status(201).json({ message: 'Successfully updated the new password', success: true });
            } else {
                return res.status(404).json({ error: 'No candidate exists', success: false });
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
                   <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
                   </head>
                <form id='submit_form'>
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" id='pass' type="password" required></input>
                <button type="submit">Reset password</button>
            </form>
            <script>
            document.getElementById('submit_form').addEventListener('submit', async function (e) {
                e.preventDefault();
                const newpassword = document.getElementById('pass').value;
                console.log(newpassword)            
            const data = {
                password:newpassword
            }
            const response = await axios.post('https://nemo.ivistaz.co/candidate-password/updatepassword/${id}',data)
            console.log(response.data)
        });
            </script>
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