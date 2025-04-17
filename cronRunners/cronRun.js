const cron = require("node-cron");
const sequelize = require("../util/database");
require("dotenv").config();
const Sib = require("sib-api-v3-sdk");
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

module.exports = {
  runCron: async function () {
    cron.schedule("*/1 * * * *", async function () { 
    /* cron.schedule("0 1 * * *", async function () { */
      try {
        const todaydate = new Date();
        let date = todaydate.getDate();
        if (parseInt(date) <= 9) {
          date = `0${date}`;
        }
        let month = parseInt(todaydate.getMonth()) + 1;
        if (parseInt(month) <= 9) {
          month = `0${month}`;
        }
        const emailToday = `${month}-${date}-${todaydate.getFullYear()}`;
        const query = `SELECT candidateId, CONCAT(fname,' ',lname) AS name, c_mobi1, email1, c_rank, dob FROM Candidates WHERE dob LIKE '%-${month}-${date}%' AND dob!='1970-01-01' AND active_details=1`;
        const existingCandidate = await sequelize.query(query, {
          type: sequelize.QueryTypes.SELECT,
        });
        if (existingCandidate.length > 0) {
          let htmlContent = `Dear Sir/Madam,<br/><br/>

        I hope you’re doing well!<br/>

        Please find below the list of employees celebrating their birthdays today:<br/><br/>

        🎂 Employee Birthday List:<br/>
       <table border="1" cellpadding="5" cellspacing="0">
                <tr><td><b>Candidate ID</b></td><td><b>Name</b></td><td><b>Rank</b></td><td><b>Date Of Birth</b></td><td><b>Phone</b></td><td><b>Email</b></td><td>Onboard<td></tr>
        `;
        let exportDatas = [];
        await Promise.all(existingCandidate.map(async (item) => {

            const contact = `SELECT id FROM contract WHERE candidateId='${item.candidateId}' AND (sign_off IS NULL OR sign_off='1970-01-01')`;
            const checkingContact = await sequelize.query(contact, {
                type: sequelize.QueryTypes.SELECT,
            });
            const checkingContact_ =  checkingContact.length>0?'Yes':'No';

            exportDatas.push({ candidateId: item.candidateId, name: item.name, c_rank: item.c_rank, dob: item.dob, c_mobi1: item.c_mobi1, email1: item.email1, checkingContact:checkingContact_ });

          
            htmlContent += `<tr><td>${item.candidateId}</td><td>${item.name}</td><td>${item.c_rank}</td><td>${item.dob}</td><td>${item.c_mobi1}</td><td>${item.email1}</td><td>${checkingContact_}</td></tr>`;

          }));
          htmlContent += `</table>`;
          console.log(htmlContent, 'htmlContent')

          const client = Sib.ApiClient.instance;
          const apiKey = client.authentications["api-key"];
          apiKey.apiKey = process.env.BREVO_API_KEY; // Ensure this environment variable is set

          const tranEmailApi = new Sib.TransactionalEmailsApi();

          const sender = {
            email: "nautilusshipping@gmail.com",
            name: "Nautilusshipping",
          };

          const recipients = [
            { email: "praba9717@gmail.com" },
           /*  { email: "crewing@nautilusshipping.com" },
            { email: "ajay@nautilusshipping.com" },
            { email: "Divakar@nautilusshipping.com" }, */
          ];
          console.log(recipients, "recipientssss");

        
          
          // Custom headers
          const headers = ['Candidate ID', 'Name', 'Rank', 'Date Of Birth', 'Phone', 'Email', 'Onboard'];
          
          // Convert JSON to sheet
          const worksheet = XLSX.utils.json_to_sheet(exportDatas, { skipHeader: true });
          
          // Insert custom header row
          XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
          
          // Create workbook and append worksheet
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'BirthdayCandidateList');
          
          // Write to file
          XLSX.writeFile(workbook, 'BirthdayCandidateList.xlsx');
          

          (async () => {
            try {
                const filePath = path.join(process.cwd(), 'BirthdayCandidateList.xlsx');
                const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

                const response = await tranEmailApi.sendTransacEmail({
                    sender,
                    to: recipients,
                    subject: `🎉 Birthday Notification – ${emailToday}`,
                    htmlContent: htmlContent,
                    attachment: [
                        {
                            name: 'BirthdayCandidateList.xlsx', // File name shown in the email
                            content: fileContent     // Base64-encoded content
                        }
                    ]
                });
        
                console.log('✅ Email sent with Excel attachment:', response);
            } catch (error) {
                console.error('❌ Error sending email:', error);
            }
        })();



         /*  try {

          

            const response = await tranEmailApi.sendTransacEmail({
              sender,
              to: recipients,
              subject: `🎉 Birthday Notification – ${emailToday}`,
              htmlContent: htmlContent,
            });

          //  console.log("Email sent successfully:", response);
          } catch (error) {
            console.error("Error sending email:", error);
          } */
        }
        console.log("sending Birthday Mail");
      } catch (err) {
        console.log(err);
      }
    });
  },
};
