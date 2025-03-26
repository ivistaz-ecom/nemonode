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
      const emailToday = `${month}-${date}-${todaydate.getFullYear()}`;
      const query = `SELECT candidateId, CONCAT(fname,' ',lname) AS name, c_mobi1, email1, c_rank, dob FROM Candidates WHERE dob LIKE '%-${month}-${date}%' AND dob!='1970-01-01' AND active_details=1`;
      const existingCandidate = await sequelize.query(query, {
          type: sequelize.QueryTypes.SELECT
      });
      if(existingCandidate.length>0) {
        let htmlContent = `Dear Sir/Madam,<br/><br/>

        I hope you’re doing well!<br/>

        Please find below the list of employees celebrating their birthdays today:<br/><br/>

        🎂 Employee Birthday List:<br/>
       <table border="1" cellpadding="5" cellspacing="0">
                <tr><td><b>Candidate ID</b></td><td><b>Name</b></td><td><b>Rank</b></td><td><b>Date Of Birth</b></td><td><b>Phone</b></td><td><b>Email</b></td></tr>
        `;
        existingCandidate.map((item)=> {
            htmlContent+= `<tr><td>${item.candidateId}</td><td>${item.name}</td><td>${item.c_rank}</td><td>${item.dob}</td><td>${item.c_mobi1}</td><td>${item.email1}</td></tr>`;
        })
         htmlContent+= `</table>`

        
              const client = Sib.ApiClient.instance;
              const apiKey = client.authentications['api-key'];
              apiKey.apiKey = process.env.BREVO_API_KEY; // Ensure this environment variable is set

              const tranEmailApi = new Sib.TransactionalEmailsApi();

              const sender = {
                  email: 'anutedreamer@gmail.com',
                  name: 'Anu'
              };

              const recipients = [
                  { email: 'praba9717@gmail.com' } // Ensure this is inside an array
              ];
              console.log(recipients, 'recipients')
           
                  try {
                      const response = await tranEmailApi.sendTransacEmail({
                          sender,
                          to: recipients, // Must be an array
                          subject: `🎉 Birthday Notification – ${emailToday}`,
                          htmlContent: htmlContent,
                      });

                      console.log('Email sent successfully:', response);
                  } catch (error) {
                      console.error('Error sending email:', error);
                  }
           


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
