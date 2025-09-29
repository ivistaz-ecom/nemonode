const purchaseorder = require("../../models/purchaseorder");
const purchaseorderitem = require("../../models/purchaseorderitem");
const sequelize = require("../../util/database");
const puppeteer = require("puppeteer");
const https = require("https");
const fs = require("fs");
const path = require("path");

const getNemoDetails = async (req, res) => {
  try {
    const nemoID = req.query?.nemoID ?? "";
    let query = `SELECT CONCAT(fname,' ',lname) AS name, c_rank FROM Candidates WHERE candidateId='${nemoID}' AND active_details='1'`;

    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      return res.status(200).json({
        success: true,
        result: listData[0],
      });
    } else {
      res.status(400).json({ success: false, message: `Invalid CandidateID ` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const getList = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1; // Get the page from query parameters, default to 1
    let limit = parseInt(req.query.limit) || 10; // Get the limit from query parameters, default to 10
    // Calculate the offset based on the page and limit
    let offset = (page - 1) * limit;

    const searchpo_number = req.query.searchpo_number || '';
    const branch = req.query.branch || '';
    const potype = req.query.potype || '';
    const POvessel = req.query.POvessel || '';
    const vendor = req.query.vendor || '';
    let addParam = '';
    if(searchpo_number!=="") {
      addParam+=` AND poNumber LIKE '%${searchpo_number}%'`
    }
    if(branch!=="") {
      addParam+=` AND pobranchID='${branch}'`
    }
    if(potype!=="") {
      addParam+=` AND poType='${potype}'`
    }
    if(POvessel!=="") {
      addParam+=` AND poVessel='${POvessel}'`
    }
    if(vendor!=="") {
      addParam+=` AND poVendor='${vendor}'`
    }
  


    const query = `SELECT a.*, vesselName, vendorName FROM purchaseorder AS a INNER JOIN vsls ON a.poVessel=id INNER JOIN povendor ON a.poVendor=vendorID WHERE poID IS NOT NULL ${addParam}  ORDER BY poID DESC LIMIT ${offset}, ${limit}`;
    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    const queryTotal = `SELECT COUNT(poID) AS totalRecord FROM purchaseorder  INNER JOIN vsls ON poVessel=id INNER JOIN povendor ON poVendor=vendorID WHERE poID IS NOT NULL ${addParam}`;
    const resultTotal = await sequelize.query(queryTotal, {
      type: sequelize.QueryTypes.SELECT,
    });

    const totalRecord = resultTotal.length > 0 ? resultTotal[0].totalRecord : 0;
    res.status(200).json({
      result: result,
      totalRecord: totalRecord,
      totalPages: Math.ceil(totalRecord / limit),
      currentPage: page,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err, message: "Internal Server Error", success: false });
  }
};

const createPO = async (req, res) => {
  try {
    const userId = req.user.id;
    const request = req.body;
    const POvessel = request?.POvessel ?? "";
    const finalItem = request?.finalItem ?? [];
    const potype = request?.potype ?? "";
    let potype_ = "O";
    if (potype === "Owners") {
      potype_ = "C";
    }
    let poquery = `SELECT poNumber FROM purchaseorder ORDER BY poID DESC LIMIT 0,1`;
    const poDetails = await sequelize.query(poquery, {
      type: sequelize.QueryTypes.SELECT,
    });
    let poIncNumber = "";
    if (poDetails.length > 0) {
      const expoNumber = poDetails[0].poNumber.split("/");
      const expoNumber_ = expoNumber[2];
      const addedValue = parseInt(expoNumber_).toString();
      poIncNumber = parseInt(parseInt(addedValue)+1).toString().padStart(4, "0");
    } else {
      poIncNumber = "0001";
    }
    let query = `SELECT * FROM vsls WHERE id='${POvessel}'`;
    const vesselDetails = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    let vesselCode = "PO";
    if (vesselDetails.length > 0) {
      vesselCode = vesselDetails[0].vesselCode;
    }
    const today = new Date();
    let month = today.getMonth().toString();
    if (parseFloat(month) + 1 <= 9) {
      month = `0${parseFloat(month) + 1}`;
    }
    const year = today.getFullYear().toString().slice(-2);
    const poNumber = `${vesselCode}/${month}${year}/${poIncNumber}/${potype_}`;
    const poData = {
      poNumber: poNumber,
      poType: request?.potype ?? "",
      pobranchID: request?.branch ?? "",
      poVessel: request?.POvessel ?? "",
      poVendor: request?.vendor ?? "",
      poDate: request?.po_date ?? "",
      poVesselRef: request?.vendor_ref ?? "",
      poCurrency: request?.poCurrency ?? "",
      posubTotal: request?.subTotal ?? "",
      poLessDiscount: request?.lessDiscount ?? "",
      poGSTPercentage: request?.gst_percentage ?? "",
      poGSTAmount: request?.gst_amount ?? "",
      poIGSTPercentage: request?.igst_percentage ?? "",
      poIGSTAmount: request?.igst_amount ?? "",
      poVatPercentage: request?.vat_percentage ?? "",
      poVatAmount: request?.vat_amount ?? "",
      poDelCharges: request?.del_charges ?? "",
      poInsuranceAmount: request?.insurance_amount ?? "",
      poOtherAmount: request?.other_amount ?? "",
      poGrandTotal: request?.grand_total ?? "",
      poCreatedBy: userId,
      poCreateOn: new Date(),
    };
    const createPODetails = await purchaseorder.create(poData);
    if (createPODetails !== "") {
      const poID = createPODetails?.poID ?? "";
      if (finalItem.length > 0 && poID !== "" && poID !== null) {
        finalItem.map(async (item) => {
          const candidateids = item.candidates.length > 0 ? item.candidates.map((c) => c.ID).join(",") : "";
          const itemData = {
            poID: poID,
            poItemCateogryID: item.cateogry ?? "",
            poItemCandidateID: candidateids,
            poItemQuantity: item.quantity ?? "",
            poItemUnit: item.unit ?? "",
            poItemRate: item.rate ?? "",
            poItemTotalRate: item.totalRate ?? "",
          };
          await purchaseorderitem.create(itemData);
        });
      }
    }
    return res.status(200).json({ success: true, message: `Purchase order created successfully. Your PO number is ${poNumber}.` });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const generatePO = async (req, res) => {
  try {
    const poID = req.query?.poID ?? "";
    const query = `SELECT a.*, vesselName, b.*, d.*, e.* FROM purchaseorder AS a INNER JOIN vsls ON a.poVessel=id INNER JOIN companies AS e ON vsl_company=company_id INNER JOIN povendor AS b ON a.poVendor=b.vendorID INNER JOIN branch AS d ON pobranchID=branchID WHERE poID=${poID}`;
    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    const poData = result[0];
    const filePath = `./po/Purchase-Order-${poData.poNumber.replaceAll("/", "-")}.pdf`;

    if (!fs.existsSync(filePath)) {
      const itemquery = `SELECT a.*, categoryName FROM purchaseorderitem AS a INNER JOIN pocategory ON a.poItemCateogryID=categoryID WHERE poID=${poID}`;
      const itemresult = await sequelize.query(itemquery, {
        type: sequelize.QueryTypes.SELECT,
      });

      // Step 1 + 2: split by comma and flatten into one array
      let allIds = itemresult
        .map((item) => item.poItemCandidateID.split(",")) // split each string into array
        .flat(); // flatten arrays into a single array

      // Step 3: remove duplicates
      const uniqueIds = [...new Set(allIds)];
    
      const candidatequery = `SELECT candidateId, CONCAT(fname,' ',lname) AS name, c_rank FROM Candidates WHERE candidateId  IN (${uniqueIds.join(",")})`;
      const candidateresult = await sequelize.query(candidatequery, {
        type: sequelize.QueryTypes.SELECT,
      });

      
      let leftAddress = "";
      if (poData.poType === "Nautilus") {
        leftAddress = `
        <b>MASTER & OWNERS OF VESSEL M.V. ${poData.vesselName.toUpperCase()}</b><br>
      <b>${poData.companyName.toUpperCase()}</b><br>
        ${poData.branchAddress}<br>
        CONTACT PERSON: ${poData.branchContactPerson}<br/>
        MOBILE NUMBER: ${poData.branchContactPhone}`;
      } else {
        leftAddress = `
         <b>MASTER & OWNERS OF VESSEL M.V. ${poData.vesselName.toUpperCase()}</b><br>
        <b>${poData.company_name.toUpperCase()}</b><br>
        ${poData.address}<br>
        CONTACT PERSON: ${poData.contact_person}<br/>
        MOBILE NUMBER: ${poData.phone}<br/>
        ${poData.GSTNumber !== "" && poData.GSTNumber !== null ? `GST NUMBER:${poData.GSTNumber}` : ""}`;
      }
     
      (async () => {
        const browser = await puppeteer.launch({
          headless:true,
          arg:['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Load page content (use your HTML or page.goto)
        await page.setContent(
          `
<html>
<head>
  <meta charset="utf-8">
  <title>Purchase Order</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      margin: 20px;
    }
    .title {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .box {
      border: 1px solid #d9dee3;
      padding: 5px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5px;
    }
    table, th, td {
      border: 1px solid #d9dee3;
    }
    th, td {
      padding: 2px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f2f2f2;
      font-weight: bold;
    }
      .vendor-details {
      border:none !important;
      }
    .vendor-details td{
      border:none !important;
      padding: 2px;
    } 
    .no-border {
      border: none !important;
    }
    .right {
      text-align: right;
    }
    .highlight {
      color: red;
      font-weight: bold;
    }
      .center-align {
      text-align:center
      }
      .table-item th {
      text-align:center;
      padding:4px !important;
      }
      .table-item td {
       padding:4px !important;
      }
        </style>
      </head>
      <body>
        <div class="title">PURCHASE ORDER</div>

  <table style="font-size:11px">
    <tr>
      <td width="50%"  style="padding-left:10px">
        <table border="0" class="vendor-details"  style="font-size:11px">
          <tr><td style="width:80px;" ><b>P.O No</b></td><td  width="10">:</td><td>${poData.poNumber}</td></tr>
          <tr><td><b>Vessel</b></td><td>:</td><td>${poData.vesselName}</td></tr>
          <tr><td><b>Date</b></td><td>:</td><td>${poData.poDate}</td></tr>
          <tr><td><b>Vendor Ref.</b></td><td>:</td><td>${poData.poVesselRef}</td></tr>
        </table>
      </td>
      <td width="50%" style="padding-left:10px">
        <b>${poData.vendorName}</b><br>
        <b>${poData.vendorAddress}</b><br>
        <b>${poData.vendorPhone}</b><br>
        <b>${poData.vendorEmail}</b><br>
        <b>${poData.vendorGSTNumber}</b>
      </td>
    </tr>
  </table>
    <div style="border-left: 1px solid #d9dee3; border-right: 1px solid #d9dee3; padding:10px; margin-top:-11px">
  <p>Dear Sir,<br>
  We are pleased to confirm the following Purchase Order for the Vessel: <b>${poData.vesselName}</b></p>
  </div>

  <table style="margin-top:-12px; font-size:10px;" class="table-item">
    <thead style="display: table-header-group;">
      <tr>
        <th style="width:30px">S. No</th>
        <th>Category</th>
        <th>DESCRIPTION</th>
        <th style="width:40px">Qty</th>
        <th style="width:40px">Unit</th>
        <th style="width:40px">Currency</th>
        <th style="width:60px">Rate</th>
        <th style="width:60px">Total</th>
      </tr>
    </thead>
    <tbody>
      
      ${
        itemresult.length > 0 &&
        itemresult.map((item, index) => {
          const poItemCandidateID = item.poItemCandidateID !== "" && item.poItemCandidateID !== null ? item.poItemCandidateID.split(",") : [];
          const finalCandidate =
            poItemCandidateID.length > 0
              ? poItemCandidateID
                  .map((id) => {
                    const cand = candidateresult.find((c) => c.candidateId === Number(id));
                    return cand ? `${cand.candidateId} - ${cand.name} - ${cand.c_rank}` : null;
                  })
                  .filter(Boolean) // remove nulls if any id not found
                  .join("<br/>")
              : "";

          return `<tr>
            <td class="center-align">${parseInt(index) + 1}</td>
            <td>${item.categoryName}</td>
            <td>${finalCandidate}</td>
            <td class="center-align">${item.poItemQuantity}</td><td class="center-align">${item.poItemUnit}</td><td class="center-align">${poData.poCurrency}</td><td class="right">${
            item.poItemRate
          }</td><td class="right">${item.poItemTotalRate}</td>
          </tr>
         `;
        })
      }
      
    </tbody>
  </table>
  <table style="margin-top:-1px;">
    <tr>
      <td style="border-top:none !important; width:50%; font-size:11px; padding:10px">
        <p>
       ${leftAddress}
      </p>
      </td>
      <td style="border-top:none !important; width:50%;  font-size:10px;  padding-top:10px">
        <table style="border:none !important; font-size:10px;">
          <tr>
            <td class="no-border right">
              <b>Currency:</b> ${poData.poCurrency}<br>
              Less discount<br>
              ${parseFloat(poData.poGSTPercentage) > 0 ? `Add GST % ${parseFloat(poData.poGSTPercentage).toLocaleString()}%<br>` : ""}
              ${parseFloat(poData.poIGSTPercentage) > 0 ? `Add IGST % ${parseFloat(poData.poIGSTPercentage).toLocaleString()}%<br>` : ""}
              ${parseFloat(poData.poInsuranceAmount) > 0 ? `Add Insurance<br>` : ""}
              ${parseFloat(poData.poVatPercentage) > 0 ? `Add VAT % ${parseFloat(poData.poVatPercentage).toLocaleString()}%<br>` : ""}
              ${parseFloat(poData.poDelCharges) > 0 ? `Add Del.Charges<br>` : ""}
              ${parseFloat(poData.poOtherAmount) > 0 ? `Other<br>` : ""}
              
            </td>
            <td class="no-border right">
              <b>${poData.posubTotal}</b><br>
              <b>${parseFloat(poData.poLessDiscount) > 0 ? parseFloat(poData.poLessDiscount).toLocaleString() : ""}</b><br>
              ${parseFloat(poData.poGSTAmount) > 0 ? `<b>${parseFloat(poData.poGSTAmount).toLocaleString()}</b><br>` : ""}
              ${parseFloat(poData.poIGSTAmount) > 0 ? `<b>${parseFloat(poData.poIGSTAmount).toLocaleString()}</b><br>` : ""}
              ${parseFloat(poData.poInsuranceAmount) > 0 ? `<b>${parseFloat(poData.poInsuranceAmount).toLocaleString()}</b><br>` : ""}
              ${parseFloat(poData.poVatAmount) > 0 ? `<b>${parseFloat(poData.poVatAmount).toLocaleString()}</b><br>` : ""}
              ${parseFloat(poData.poDelCharges) > 0 ? `<b>${parseFloat(poData.poDelCharges).toLocaleString()}</b><br>` : ""}
              ${parseFloat(poData.poOtherAmount) > 0 ? `<b>${parseFloat(poData.poOtherAmount).toLocaleString()}</b><br>` : ""}
            </td>
          </tr>
          <tr>
            <td class="right" style="border-left:none !important; border-right:none !important; border-bottom:none !important;">
              <b>Total Amount INR</b>
            </td>
            <td class="right" style="border-left:none !important;border-right:none !important;border-bottom:none !important;">
               <b>${parseFloat(poData.poGrandTotal).toLocaleString()}</b>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <table style="margin-top:-2px;  border-top:none !important;">
  <tr><td style="width:50%;  border-right:none !important; border-top:none !important;"></td><td style="width:50%; border-left:none !important;  border-top:none !important;"">
  <div style=" padding:10px;  font-size:10px;">
  <b>Yours Faithfully<br/>For ${poData.poType === "Nautilus" ? poData.companyName : poData.company_name}<br/><br/><br/><br/>Authorised Signatory</b></br>
  
  
  ${poData.poType === "Nautilus" ? "As Agents" : "As agent on behalf of the owners"}
  
  </div>
  </td></tr>
  
  <tr><td colspan="2" style="padding:10px;  font-size:10px; border-top:none !important;">
  <b>NOTES</b><br/>
  A) Please mail original invoice in 3 Copies raised in the name of Owners, to Shipmanager, Nautilus Shipping for approval & further processing.<br/>
  B) Payment Terms : CREDIT 30 days<br/>
  C) Delivery Period: Within 2 Weeks from the date of receipt of Confirm Order<br/>
  D) Original invoice should reach to Mailing address within 7 days.
  </td></tr>
  </table>

      </body>
    </html>`,
          { waitUntil: "networkidle0" }
        );

        // Convert remote image to data URI
        const imgData = await imageUrlToDataUri("https://nsnemo.com/nautilusshipping-logo.jpg");

        const dir = path.join(process.cwd(), "po");
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true }); // create folder if missing
        }
        const fileName = `Purchase-Order-${poData.poNumber.replaceAll("/", "-")}.pdf`;
        const pdfPath = path.join(dir, fileName);
        await page.pdf({
          path: pdfPath,
          format: "A4",
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: `
    <table style="width:100%; padding-left:30px; padding-right:30px; border-bottom: 1px solid #d9dee3;"><tr><td style="width:100px"> <img src="${imgData}" style="height:40px; width:auto; display:block;" /></td><td align="center">
    <div style="font-size:18px; font-weight:bold;">${poData.companyName}</div><br/>
    <div style="font-size:11px;">
    ${poData.branchAddress}
    </div>
    </td></tr>
    </table>
     `,
          footerTemplate: `
      <div style="font-size:10px; width:100%; text-align:center; padding:5px;  border-top: 1px solid #d9dee3;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>`,
          margin: { top: "60px", bottom: "60px", left: "14px", right: "14px" },
        });

        await browser.close();

        return res.status(200).json({ success: true, fileName });
      })();
    } else {
      fileName = `Purchase-Order-${poData.poNumber.replaceAll("/", "-")}.pdf`;
      return res.status(200).json({ success: true, fileName });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const imageUrlToDataUri = async (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const contentType = res.headers["content-type"] || "image/png";
          const base64 = buffer.toString("base64");
          resolve(`data:${contentType};base64,${base64}`);
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
};

module.exports = { generatePO, createPO, getNemoDetails, getList };
