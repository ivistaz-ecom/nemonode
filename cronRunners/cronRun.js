const cron = require("node-cron");
const sequelize = require('../util/database')
const axios = require('axios')
require('dotenv').config()
const Sib = require('sib-api-v3-sdk');

module.exports = {
  runCron: async function () {

    //******************* Get and update[every 1-minit] the whatsapp status from twilio ******************/
    cron.schedule("*/1 * * * *", async function () {
     // twilioWhatsapp.updateWhatsappStatus();
     try {
      const todaydate = new Date();
      let date = todaydate.getMonth();
      if(parseInt(date)<=9) {
        date = `0${date}`;
      }
      let month = parseInt(todaydate.getMonth())+1;
      if(parseInt(month)<=9) {
        month = `0${month}`;
      }

      const query = `SELECT candidateId, CONCAT(fname,' ',lname) AS name, c_mobi1, email1, dob FROM Candidates WHERE dob LIKE '%-${month}-${date}%' AND dob!='1970-01-01' AND active_details=1`;
      const existingCandidate = await sequelize.query(query, {
          type: sequelize.QueryTypes.SELECT
      });
      if(existingCandidate.length>0) {



        
              const client = Sib.ApiClient.instance;
              const apiKey = client.authentications['api-key'];
              apiKey.apiKey = process.env.BREVO_API_KEY; // Ensure this environment variable is set

              const tranEmailApi = new Sib.TransactionalEmailsApi();

              const sender = {
                  email: 'mccivistasolutions@gmail.com',
                  name: 'I-Vistaz'
              };

              const recipients = [
                  { email: 'praba9717@gmail.com' } // Ensure this is inside an array
              ];
              console.log(recipients, 'recipients')
           
                  /* try {
                      const response = await tranEmailApi.sendTransacEmail({
                          sender,
                          to: recipients, // Must be an array
                          subject: 'Evaluation for Nemo Candidate',
                          htmlContent: `
                              <h2>Hello!</h2>
                          `,
                      });

                      console.log('Email sent successfully:', response);
                  } catch (error) {
                      console.error('Error sending email:', error);
                  } */
           


       /* 
                // Get interviewer email from some source, e.g., a database or static list
                const interviewerEmail = 'praba9717@gmail.com'
        
                // Send email to the interviewer
                const client = Sib.ApiClient.instance;
                const apiKey = client.authentications['api-key'];
                apiKey.apiKey = process.env.BREVO_API_KEY;
                const tranEmailApi = new Sib.TransactionalEmailsApi();
                const sender = {
                    email: 'mccivistasolutions@gmail.com',
                    name: 'I-Vistaz'
                };
        
                await tranEmailApi.sendTransacEmail({
                    sender,
                    to: 'praba9717@gmail.com',
                    subject: 'Evaluation for Nemo Candidate',
                    htmlContent: `
                        <h2>Hello!</h2>
                    `,
                });
                console.log('Email sent successfully');
 */
        

          /* console.log('key +>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>+>',process.env.BREVO_API_KEY)
            const emailData = {
                sender: { email: "mccivistasolutions@gmail.com" }, // Replace with your email
                to: [
                    { email: "praba9717@gmail.com" },
                ],
                subject: "Contracts Due Report",
                htmlContent: "<p>Please find the attached Excel file.</p>",
            };
        
            try {
                console.log(process.env.BREVO_API_KEY)
                const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': process.env.BREVO_API_KEY // Ensure this is correct
                        
                    }
                });
                console.log(response, 'responseresponseresponseresponse')
            
            } catch (error) {
                console.error('Error sending email:', error.response ? error.response.data : error.message);
            } */

      }
     // console.log(existingCandidate, query, 'existingCandidate')
      console.log("Im CRON to get whatsapp status from twilio and update in the whatsapp template table");
      } catch (err) {
        console.log(err);
      }
    });
  },
};
