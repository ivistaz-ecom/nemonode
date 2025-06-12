//const { JSON } = require("sequelize");
const token = localStorage.getItem("token")||'';
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get("id");
 
  if(token!=="") {
    $('#applicationLogin').hide();
    $('#applicationFrm').show();
    currentCandidateId = candidateId;
    if (candidateId) {
      if(formType==='edit') {
        const countries = await fetchAndDisplayNationalities();
        const nationalitySelect = document.getElementById("nationality");
        await displayDropdownOptions(nationalitySelect, countries, "Nationality");
        await displayDropdown(token);
        await fetchCountryCodes();  
        await fetchAndDisplayDocumentDetails(candidateId, token);
      }
      await fetchAndDisplayCandidate(candidateId, token);
      await fetchAndDisplaySeaService(candidateId);
      await getContract(candidateId, token)
    } else {
      console.error("Invalid URL. Missing memId parameter.");
    }
  }else {
    $('#applicationFrm').hide();
    $('#applicationLogin').show();    
  }
});

async function fetchCountryCodes() {
  try {
      const response = await axios.get(`${config.APIURL}fetch-nationality`);
      const countries = response.data.countries;
      // Clear existing options
      var select2 = document.getElementById("countryCodeSelect2");
      select2.innerHTML = '<option value="">Code</option>';
      // Populate the dropdown options
      countries.forEach(function(country) {
          var option = document.createElement("option");
          option.value = country.phone_code; // Set the value to phone_code
          option.text = country.phone_code; // Display only the phone_code
          select2.appendChild(option.cloneNode(true))
      });
  } catch (error) {
      console.error('Error fetching country codes:', error);
  }
}

const form = document.getElementById("login-form");
form.addEventListener("submit", login);

async function login(e) {
    e.preventDefault(); // Prevent default form submission
    const urlParams = new URLSearchParams(window.location.search);
    const candidateId = urlParams.get("id");
    const loginCredentials = {
        userName: user_id.value.trim(),
        candidateId: candidateId,
    };

    try {
        const response = await axios.post(
            `${config.APIURL}user/canditatelogin`,
            loginCredentials
        );

        if (response.data.success) {
            const token = response.data.token;
            // Save token and other data to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("loginType", 'canditate');
            setTimeout(() => {
                if(formType==='view') {
                  window.location.href = `viewapplicationform.html?id=${candidateId}`;
                }else  {
                window.location.href = `applicationform.html?id=${candidateId}`;
                }                
            }, 850);
        } else {
          Swal.fire({
            icon: "error",
            title: "Alert",
            text: response.data.message,
          });
           // handleLoginError();
        }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Alert",
        text: error?.response?.data?.message||error.message,
      });
        console.error("Error during login:", error.response.data, error.message);
     //   handleLoginError();
    }
}


async function fetchAndDisplayCandidate(candidateId, token) {
  try {
    const serverResponse = await axios.get(
      `${config.APIURL}candidate/get-candidate/${candidateId}`,
      {
        headers: { Authorization: token },
      }
    );

    const candidateData = serverResponse.data.candidate;
    const countryName = serverResponse.data.countryName;

    const nkdResponse = await axios.get(
      `${config.APIURL}candidate/get-nkd-details/${candidateId}`,
      {
        headers: { Authorization: token },
      }
    );
    const nkd = nkdResponse.data;

    const response = await axios.get(
      `${config.APIURL}candidate/get-previous-experience/${candidateId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const expDetails = response.data;

    displayCandidateDetails(candidateData, nkd, expDetails, countryName);
  } catch (error) {
    console.error("Error fetching candidate data:", error);
    // Handle error as needed
  }
}

async function fetchAndDisplaySeaService(candidateId) {
  try {
    let index = 1;
    const response = await axios.get(
      `${config.APIURL}candidate/get-sea-service/${candidateId}`,
      {
        headers: { Authorization: token },
      }
    );
    let contractData = [];
    let companies = [];
    let ports = [];
    const vessels = [];
    if(formType==='view') {
      const companyResponse = await axios.get(
        `${config.APIURL}company/dropdown-company`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
     
      companyResponse.data.companies.forEach((company) => {
        companies[company.company_id] = `${company.company_name}-${company.rpsl}`;
      });

      const portsResponse = await axios.get(`${config.APIURL}others/get-ports`, {
        headers: {
          Authorization: token,
        },
      });
      
      portsResponse.data.ports.forEach((port) => {
        ports[port.id] = port.portName;
      });

      const vesselsResponse = await axios.get(`${config.APIURL}others/get-vsls`, {
        headers: {
          Authorization: token,
        },
      });
      
      vesselsResponse.data.vessels.forEach((vessel) => {
        vessels[vessel.id] = vessel.vesselName;
      });

      
      const contractResponse = await axios.get(
        `${config.APIURL}candidate/get-contract-details/${candidateId}?withsignoff=Yes`,
        {
          headers: { Authorization: token },
        }
      );
      contractData =contractResponse.data;
    }

    var durationHead = "";
    if(formType==='view') {
      durationHead = `<td align="center" style="width:120px">
                <strong>Duration</strong>
              </td>`;
    }

    const seaServices = response.data;
    const finaContact = []
    var totalContract = 0;
    if(contractData.length>0) {
      contractData.map((item)=> {
        if(item.sign_off!=="" && item.sign_off!==null && item.sign_off!=='1970-01-01') {
          item.reportType = 'c';
          item.startDate = item.sign_on
          finaContact.push(item);
          totalContract++;
        }
      })
    }
    const finaseaServices = [];
    if(seaServices.length>0) {
      seaServices.map((item)=> {
        item.reportType = 'ss';
        item.startDate = item.from1        
        finaseaServices.push(item)
      });
    }
   
    const finalList = (formType==='view')?finaContact.concat(finaseaServices):finaseaServices;
    finalList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const eperienceTableBody = document.getElementById("preveperience");
    eperienceTableBody.innerHTML = `
        <tr>
              <td width="100" align="center">
                <p><strong>Company</strong></p>
              </td>
              <td width="122" align="center">
                <p><strong>Vessel Name</strong></p>
              </td>
              <td width="61" align="center">
                <p><strong>Type of Vessel</strong></p>
              </td>
              <td width="61" align="center">
                <p><strong>GRT</strong></p>
              </td>
              <td width="61" align="center">
                <p><strong>Flag</strong></p>
              </td>
              <td width="61" align="center">
                <p><strong>Engine</strong></p>
              </td>
              ${(formType==='edit')?`<td width="61" align="center">
                <p><strong>DWT</strong></p>
              </td><td width="61" align="center">
                <p><strong>KWT</strong></p>
              </td>`:`<td width="61" align="center">
                <p><strong>KWT</strong></p>
              </td>`}              
              <td width="62" align="center">
                <p><strong>Rank</strong></p>
              </td>
              <td align="center" style="width:120px">
                <strong>From</strong>
              </td>
              <td align="center" style="width:120px">
                <strong>To</strong>
              </td>
              ${durationHead}
              <td align="center" style="width:120px">
                <strong>Reason for sign off</strong>
              </td>
              
                            
            </tr>`;
    var i = 0;
    
    /* if(contractData.length>0) {
      contractData.map((item)=> {
        if(item.sign_off!=="" && item.sign_off!==null && item.sign_off!=='1970-01-01') {
          totalContract++;
        }
      })
    } */
    var totalRec = parseInt(seaServices.length) + parseInt(totalContract);
    var displayRecord = 10;
    if(totalRec>10) {
      displayRecord = totalRec;
    }
    $.each(new Array(displayRecord),function(n){
      const row = document.createElement("tr");
      const seaExp =(finalList.length>0)?(finalList[n] || ''):'';
     
      var exp_from = '';
      var exp_to = '';
      var exp_vesselname = '';
      var exp_flag = '';
      var exp_KWT = '';
      var exp_GRT = '';
      var exp_DWT = '';
      var exp_Engine = '';
      var exp_typeofvessel = '';
      var exp_Position = '';
      var reason_for_sign_off = '';
      var exp_company = '';
      var experienceID = '';
      var total_MMDD =  '';
      const reportType = seaExp?.reportType ?? '';
       if(reportType==="ss") {
        exp_from = (seaExp.from1!=="" && seaExp.from1!==null && seaExp.from1!=='1970-01-01')?seaExp.from1:'';
        exp_to = (seaExp.to1!=="" && seaExp.to1!==null && seaExp.to1!=='1970-01-01')?seaExp.to1:'';
        exp_vesselname = seaExp.vessel;
        exp_flag = seaExp.Flag;
        exp_KWT = seaExp.KWT;
        exp_GRT = seaExp.GRT;
        exp_DWT = seaExp.DWT;
        exp_Engine = seaExp.Engine;
        exp_typeofvessel = seaExp.type;
        exp_Position = seaExp.rank;
        reason_for_sign_off = seaExp.reason_for_sign_off;
        exp_company = seaExp.company;
        experienceID = seaExp.id;
        total_MMDD = seaExp.total_MMDD;
      }else {
        if(formType==='view' && reportType==="c") {
          if(seaExp!=="") {
            if(seaExp.sign_off!=="" && seaExp.sign_off!==null && seaExp.sign_off!=='1970-01-01') {
              
              const companyName = companies[seaExp.company] ?? '';
              const companyName_ = (companyName!=="")?companyName.split('-'):'';
              const vesselName = vessels[seaExp.vslName];
              exp_from = (seaExp.sign_on!=="" && seaExp.sign_on!==null && seaExp.sign_on!=='1970-01-01')?seaExp.sign_on:'';
              exp_to = (seaExp.sign_off!=="" && seaExp.sign_off!==null && seaExp.sign_off!=='1970-01-01')?seaExp.sign_off:'';
              exp_vesselname = vesselName;
              exp_flag =(seaExp.vesselFlag!==null)?seaExp.vesselFlag:'';
              exp_KWT = (seaExp.vesselKWT!==null)?seaExp.vesselKWT:'';
              exp_GRT = (seaExp.vesselGRT!==null)?seaExp.vesselGRT:'';
              exp_DWT = '';
              exp_Engine = (seaExp.vesselEngine!==null)?seaExp.vesselEngine:'';
              exp_typeofvessel = seaExp.vesselType;
              exp_Position = seaExp.rank;
              reason_for_sign_off = seaExp?.reason_for_sign_off || '';
              exp_company = (companyName!=="")?companyName_[1]=="Yes"?'Nautilus Shipping':companyName_[0]:'';
              experienceID = seaExp.id;
              var  totalMMDD = calculateTotalMonth(exp_from, exp_to);
              if(totalMMDD!=="") {
                total_MMDD = '';
                if(parseInt(totalMMDD.totalMonths)>0) {
                    total_MMDD+=`${totalMMDD.totalMonths} Month${parseInt(totalMMDD.totalMonths)>1?'s':''}`;
                }
                if(parseInt(totalMMDD.days)>0) {
                    if(total_MMDD!=="") {
                      total_MMDD+=' ';
                    }
                    total_MMDD+=`${totalMMDD.days} Day${parseInt(totalMMDD.days)>1?'s':''}`;
                }
              }
            }
          }
          i++;
          
        }
      }
      
      var durationVal = "";
      if(formType==='view') {
       
        if(exp_from!=="" && exp_from!==null) {
          exp_from = new Date(exp_from);
         
          exp_from = addFrontZero(exp_from.getDate())+'-'+month[exp_from.getMonth()]+'-'+exp_from.getFullYear()
        
        }
        if(exp_to!=="" && exp_to!==null) {
          exp_to = new Date(exp_to);
          exp_to = addFrontZero(exp_to.getDate())+'-'+month[exp_to.getMonth()]+'-'+exp_to.getFullYear()
        }
        durationVal = `<td>${total_MMDD}</td>`;
      }
      var displydwtkwd = '';
      if(formType==='edit') {
        displydwtkwd = `<td width="61">
        ${((formType==='edit') )?`<input type="text" name="exp_DWT" value="${exp_DWT}" />` :`${exp_DWT}`}
      </td>
      ${(formType==='edit')?`<td width="61">
        <input type="text" name="exp_KWT" value="${exp_KWT}" />
      </td>`:''}`;
      }else {
        var showdwt = '';
        if(exp_DWT!=="") {
          showdwt+= exp_DWT;
        }
        if(exp_KWT!=="") {
          if(showdwt!=="") {
            showdwt+= ' / ';
          }
          showdwt+= exp_KWT;
        }
        displydwtkwd = `<td width="61">${showdwt}</td>`
      }

      row.innerHTML = `     
      <td width="100">
        ${((formType==='edit') )?`<input type="text" name="exp_company" value="${exp_company}" />` :`${exp_company}`}        
        <input type="hidden" name="experienceID" value="${experienceID}" />
      </td>
      <td width="122">
        ${((formType==='edit') )?`<input type="text" name="exp_vesselname" value="${exp_vesselname}" />` :`${exp_vesselname}`}
      </td>
      <td width="61">
        ${((formType==='edit') )?`<input type="text" name="exp_typeofvessel" value="${exp_typeofvessel}" />` :`${exp_typeofvessel}`}
      </td>
      <td width="61">
        ${((formType==='edit') )?`<input type="text" name="exp_GRT" value="${exp_GRT}" />` :`${exp_GRT}`}
      </td>
      <td width="61">
        ${((formType==='edit') )?`<input type="text" name="exp_flag" value="${exp_flag}" />` :`${exp_flag}`}
      </td>
      <td width="61">
        ${((formType==='edit') )?`<input type="text" name="exp_Engine" value="${exp_Engine}" />` :`${exp_Engine}`}
      </td>
      ${displydwtkwd}
      <td width="62">
        ${((formType==='edit') )?`<input type="text" name="exp_Position" value="${exp_Position}" />` :`${exp_Position}`}        
      </td>
      
       <td style="width:120px">  
       <div style="min-height: 20px !important;">     
        ${((formType==='edit') )?`<input type="date" name="exp_from" value="${exp_from}" />` :`${exp_from}`}
        </div>
      </td>
      <td>
       ${((formType==='edit') )?`<input type="date" name="exp_to" value="${exp_to}" />` :`${exp_to}`}        
      </td>
      ${durationVal}
      <td>
       ${((formType==='edit') )?`<input type="text" name="reason_for_sign_off" value="${reason_for_sign_off}" />` :`${reason_for_sign_off}`}        
      </td>
      `;
      eperienceTableBody.appendChild(row);
    });
    
  } catch (error) {
    console.error("Error fetching and displaying sea service records:", error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}
function addFrontZero(value) {
  if(value!=="") {
    if(parseInt(value)<10) {
        return '0'+value;
    }else {
      return value;
    }
  }
}
async function displayCandidateDetails(candidateData, nkd, expDetails, countryName) {
  try {
   
    const userName = localStorage.getItem("username");

    if(formType==='view') {
      
     // candidateData = JSON.parse(candidateData.applicationDatas);
     var postdate =  new Date(candidateData.cr_date);
      $('#totalChild').val(candidateData.totalChild);
      $('#nearest_airport').val(candidateData.nearestAirport);

      if(candidateData?.avb_date!=="") {
        avb_date = new Date(candidateData?.avb_date);
        avb_date = addFrontZero(avb_date.getDate())+'-'+month[avb_date.getMonth()]+'-'+avb_date.getFullYear()
        $("#avb_date").val(avb_date);
      }
      
      const documentTableBody1 = document.getElementById("documentTableBody");
      documentTableBody1.innerHTML = "";
      let documentType = [
        { key: "passport", name: "PASSPORT" },
        { key: "nationalcdc", name: "NATIONAL LICENSE" },        
        { key: "seamanid", name: "SEAFARER ID (Indos)" },
        { key: "coc", name: "COC" },
      ];
      if(formType==='edit') {
        documentType.push({ key:'tankerany', name:'Tanker If any'},
          { key: "aff_fpff", name: "AFF / FPFF" },
          { key: "pst_pscrb", name: "PST / PSCRB" },
          { key: "medicare", name: "MEDICARE / MFA / EFA" },
          { key: "pssr", name: "PSSR" },
          { key: "stsdsd", name: "STSDSD / SSO" });
      }
      let inputType = "text"
      if(formType==='edit') {
        inputType = "date";
      }
      documentType.map((doc) => {
        let docNames = doc.name
        if(doc.key==='seamanid') {
          docNames = 'SEAFARER ID';
        }
        var checkingArray = searchArray(candidateData.cDocuments, docNames);
        if(doc.key==='nationalcdc' && checkingArray.length===0) {
          docNames = 'NATIONAL SEAMAN BOOK';
          var checkingArray = searchArray(candidateData.cDocuments, 'National Seaman Book');
        }
        

        if(doc.key==='tankerany') {
          checkingArray = searchArray(candidateData.cDocuments, 'DCE OIL');
          if(checkingArray.length===0) {
            checkingArray = searchArray(candidateData.cDocuments, 'DCE GAS');
          }else  if(checkingArray.length===0) {
            checkingArray = searchArray(candidateData.cDocuments, 'DCE CHEM');
          }
        }
        let docnumbers = (checkingArray.length>0)?checkingArray[0].document_number : "";
        let documentName = (checkingArray.length>0)?checkingArray[0].document : "";

        let issuedate = (checkingArray.length>0)?checkingArray[0].issue_date : "";
        if(issuedate!=="" && issuedate!==null) {
          if (issuedate !== "1970-01-01" && issuedate !== "01-01-1970") {
            issuedate = new Date(issuedate);
            issuedate = addFrontZero(issuedate.getDate())+'-'+month[issuedate.getMonth()]+'-'+issuedate.getFullYear()
          }else {
            issuedate = '';
          }
        }else {
          issuedate = '';
        }
        let issueplace = (checkingArray.length>0)?checkingArray[0].issue_place : "";
        let validuntill = (checkingArray.length>0)?checkingArray[0].expiry_date : "";
        if(validuntill!=="" && validuntill!==null) {
          if (validuntill !== "1970-01-01" && validuntill !== "01-01-1970") {
            validuntill = new Date(validuntill);
            validuntill = addFrontZero(validuntill.getDate())+'-'+month[validuntill.getMonth()]+'-'+validuntill.getFullYear()
          }else {
            validuntill = '';
          }
        } else {
          validuntill = '';
        }
        const row = document.createElement("tr");
        var allowToShow = 'Y';
        if(doc.key==='tankerany') {
          if(docnumbers==="") {
            allowToShow = 'N';
          }
        }
        if(formType==='view') {
          if(docnumbers==="") {
            allowToShow = 'N';
          }
        }

        if(allowToShow==="Y") {
          row.innerHTML = `
              <td>
                ${doc.key==='tankerany'?documentName:docNames}
              </td>
              <td width="151">
                ${docnumbers}
              </td>
              <td width="50">
                ${issuedate}
              </td>
              <td width="198">
                ${issueplace}
              </td>
              <td width="50">
                ${validuntill}
              </td>`;
              documentTableBody1.appendChild(row);
          }
        });
    }else {
      postdate = new Date();
    }

    
    const createDate = addFrontZero(postdate.getDate())+'-'+month[postdate.getMonth()]+'-'+postdate.getFullYear()
    $('#postdate').html(createDate);

    $("#candidate_c_rank").val(candidateData.c_rank);
    var avb_date = candidateData.avb_date!==null && candidateData.avb_date!=="" && candidateData.avb_date!=='11970-01-01'?candidateData.avb_date:'';
    $('#avb_date').val(avb_date);
    $("#lname").val(candidateData.lname);
    $("#fname").val(candidateData.fname);
    const dob = candidateData?.dob ? formatDate(candidateData.dob) : "";
    $("#dob").val(dob);
    $("#birth_place").val(candidateData.birth_place);
    var nationality = candidateData.nationality;
    if(formType==='view') {
      nationality  = countryName.country ?? '';
    }
    $("#nationality").val(nationality);
    $("#c_ad1").val(candidateData.c_ad1);
    $("#m_status").val(candidateData.m_status);
    $("#weight").val(candidateData.weight);
    $("#height").val(candidateData.height);
    $("#boiler_suit_size").val(candidateData.boiler_suit_size);
    $("#safety_shoe_size").val(candidateData.safety_shoe_size);     
    $("#m_status").val(candidateData.m_status);
    let mobile_code1 = '+'+(candidateData.mobile_code1.replace('+',''));
    $('#countryCodeSelect2').val(mobile_code1)
    $("#c_mobi1").val(candidateData.c_mobi1);
    $('#nearest_airport').val(candidateData.nearestAirport);
    $('#totalChild').val(candidateData.totalChild);
    var photos_ = candidateData.photos;
    if(photos_!=="" && photos_!==null) {
      $('#profileImage').attr('src', "../files/photos/" +photos_);
      $('#no-image').hide();
    }else {
      $('#profileImage').hide()
      $('#no-image').show();
    }

    if(nkd.length>0) {
      var nkdF = nkd[0];
      $('#kin_name').val(nkdF.kin_name);
      $('#kin_relation').val(nkdF.kin_relation);
      $('#kin_contact_number').val(nkdF.kin_contact_number);
      $('#kin_email').val(nkdF.kin_email);
      $('#kin_contact_address').val(nkdF.kin_contact_address);
    }

  } catch (error) {
    console.error("Error displaying candidate details:", error);
  }
}

function searchArray(array, searchTerm) {
  return array.filter(obj => obj.document === searchTerm);;
}

async function getContract(candidateId, token) {
const response = await axios.get(`${config.APIURL}candidate/get-contract-details/${candidateId}`, {
  headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
  });
  const contractDetails = response?.data||[];
  if(contractDetails.length>0) {
    var totalMonth = 0;
    var totalDays = 0;
    contractDetails.map((item)=> {
      if(item.sign_off!=="1970-01-01") {
        let resultMonth =  calculateTotalMonth(item.sign_on, item.sign_off);
        totalMonth = parseInt(totalMonth)+ parseInt(resultMonth.totalMonths);
        totalDays = parseInt(totalDays) + parseInt(resultMonth.days);
      }     
    })
    if(totalDays>=30) {
      totalMonth =  parseInt(totalMonth) + 1;
      totalDays = parseInt(totalDays) - 30;
    }
    if(totalDays>0 || totalDays>0) {
      let workNautilus = '';
      if(totalMonth>0) {
        workNautilus+=' '+totalMonth+' Month';
      }
      if(totalDays>0) {
        workNautilus+=' '+totalDays+' days';
      }
      $('#workNautilus').html(workNautilus);
    }else {
      $('#workNautilus').html('No');
    }
  }
 
}

function calculateTotalMonth(fromDate, toDate) {
  if(fromDate!=="" && toDate!=="") {
    var fromDate = new Date(fromDate);
    var toDate = new Date(toDate);

    if (fromDate && toDate && fromDate <= toDate) {
        var years = toDate.getFullYear() - fromDate.getFullYear();
        var months = toDate.getMonth() - fromDate.getMonth();
        var days = toDate.getDate() - fromDate.getDate();

        if (days < 0) {
            months--;
            var prevMonthDate = new Date(toDate.getFullYear(), toDate.getMonth(), 0); // Last day of the previous month
            days += prevMonthDate.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        var totalMonths = years * 12 + months;
        return {totalMonths:totalMonths, days:days}
    }
  }
}

async function fetchAndDisplayNationalities() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${config.APIURL}fetch-nationality`, {
      headers: { Authorization: token },
    });
    const countries = response.data.countries; // Access the array using response.data.countries
    return countries; // Return the fetched countries
  } catch (error) {
    console.error("Error fetching countries:", error);
    return []; // Return an empty array in case of an error
  }
}

function displayDropdownOptions(dropdown, options, placeholder) {
  dropdown.innerHTML = ""; // Clear existing options

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = ""; // Set the default value (empty in this case)
  defaultOption.text = `-- Select ${placeholder} --`; // Set the default display text
  dropdown.appendChild(defaultOption);

  // Check if options is an array before using forEach
  if (Array.isArray(options)) {
    options.forEach((option) => {
      const dropdownOption = document.createElement("option");
      dropdownOption.value = option.code; // Use the appropriate ID or value from your data
      dropdownOption.text = option.country; // Use the appropriate property from your data
      dropdown.appendChild(dropdownOption);
    });

    return true;
  } else {
    console.error(`Invalid or empty options for ${placeholder}:`, options);
    return true;
  }
}

const displayDropdown = async function (token) {
  const rankDropdown = document.getElementById("candidate_c_rank");
  rankDropdown.innerHTML = ""; // Clear existing options

  // Add the default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "-- Select Rank --";
  rankDropdown.appendChild(defaultOption);

  const rankResponse = await axios.get(`${config.APIURL}others/get-ranks`, {
    headers: { Authorization: token },
  });
  const rankOptions = rankResponse.data.ranks;
  const rankNames = rankOptions.map((rank) => rank.rank);

  for (let i = 0; i < rankNames.length; i++) {
    const option = document.createElement("option");
    option.value = rankNames[i];
    option.text = rankNames[i];
    rankDropdown.appendChild(option);
  }
};

async function fetchAndDisplayDocumentDetails(candidateId, token) {
  try {
    const response = await axios.get(
      `${config.APIURL}candidate/get-document-details/${candidateId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const documentDetails = response.data;

    const documentTableBody = document.getElementById("documentTableBody");
    documentTableBody.innerHTML = ""; // Clear existing rows

    let exitpassport = [];
    await documentDetails.forEach((doc) => {
      exitpassport[doc.document] = doc;
    });
   
    const documentType = [
      { key: "passport", name: "PASSPORT" },
      { key: "nationalcdc", name: "NATIONAL LICENSE" },
      { key: "seamanid", name: "SEAFARER ID (Indos)" },
      { key: "coc", name: "COC" },
      { key:'tankerany', name:'Tanker If any'},
      { key: "aff_fpff", name: "AFF / FPFF" },
      { key: "pst_pscrb", name: "PST / PSCRB" },
      { key: "medicare", name: "MEDICARE / MFA / EFA" },
      { key: "pssr", name: "PSSR" },
      { key: "stsdsd", name: "STSDSD / SSO" },
    ];
    let inputType = "text"
    if(formType==='edit') {
      inputType = "date";
    }
    documentType.map((doc) => {
      let chekcingDoct = exitpassport[doc.name] || "";
      const row = document.createElement("tr");
      var docName = '';
      if(doc.key==='tankerany') {
        docName = `<select name="document_${doc.key}_name" />
          <option value="">----${doc.name}----</option>
          <option value="DCE OIL">DCE OIL</option>
          <option value="DCE GAS">DCE GAS</option>
          <option value="DCE CHEM">DCE CHEM</option>
        </select>
        `
      }else {
        docName = `${doc.name}`
      }
      row.innerHTML = `
           <td>
                <p>${docName}</p>
              </td>
              <td width="151">
                <input type="text" name="document_${doc.key}_numbers" value="${
        chekcingDoct !== "" ? chekcingDoct.document_number : ""
      }" />
              </td>
              <td width="50">
                <input type="${inputType}" name="document_${
                  doc.key
                }_issuedate" value="${
        chekcingDoct !== "" ? chekcingDoct.issue_date : ""
      }"/>
              </td>
              <td width="198">
                <input type="text" name="document_${
                  doc.key
                }_issueplace" value="${
        chekcingDoct !== "" ? chekcingDoct.issue_place : ""
      }"/>
              </td>
              <td width="50">
                <input type="${inputType}" name="document_${
                  doc.key
                }_validuntill" value="${
        chekcingDoct !== "" ? chekcingDoct.expiry_date : ""
      }"/>
              </td>`;

      documentTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching document details:", error);
  }
}


function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#profileImage').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
  }
}

$("#uploadFiles").change(function(){
  readURL(this);
});

document
  .getElementById("application-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    var formData = $("#application-form").serializeArray();
    var candidate_details = {};
    $.each(formData, function () {
      if (candidate_details[this.name]) {
        if (!candidate_details[this.name].push) {
          candidate_details[this.name] = [candidate_details[this.name]];
        }
        candidate_details[this.name].push(this.value || "");
      } else {
        candidate_details[this.name] = this.value || "";
      }
    });
    candidate_details['postdate'] = new Date();

    try {     

      const newPhotoFile = document.getElementById("uploadFiles").files[0];
      // Check if there's a new photo to upload
      if (newPhotoFile) {
        const photoFormData = new FormData();
        photoFormData.append("file", newPhotoFile);
        const photoUploadResponse = await axios.post(
            "/upload1",
            photoFormData,
            {
              headers: {
                Authorization: token,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        console.log(photoUploadResponse);
        uploadedPhotoName = photoUploadResponse.data.filename; // Use the returned filename
        candidate_details['photos'] = uploadedPhotoName;
        console.log("Photo uploaded successfully");
        
      }
      const urlParams1 = new URLSearchParams(window.location.search);
      const candidateId1 = urlParams1.get("id");
      await axios.post(
        `${config.APIURL}candidate/submit-application/${candidateId1}`,
        { applicationDatas: JSON.stringify(candidate_details) },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text:"Your Information Updated Successfully!",
      });
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  });
