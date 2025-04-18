
const company_name = document.getElementById("company_name");
const company_b_type = document.getElementById("company_b_type");
const company_contact = document.getElementById("company_contact");
const company_email = document.getElementById("company_email");
const company_address = document.getElementById("company_address");
const company_management = document.getElementById("company_management");
const company_phone = document.getElementById("company_phone");
const rpsl = document.getElementById("rpsl");

const addCompanyButton = document.getElementById("company-form");
addCompanyButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selectedBusinessType = document.querySelector('input[name="business_type"]:checked');
    const businessType = selectedBusinessType ? selectedBusinessType.value : null;
   
    const company_details = {
        c_name: company_name.value.trim(),
        b_type: businessType,
        c_contact: company_contact.value.trim(),
        c_email: company_email.value.trim(),
        c_addr: company_address.value.trim(),
        c_mgmt: company_management.value.trim(),
        c_ph: company_phone.value.trim(),
        rpsl:(rpsl.checked===true)?"Yes":'No',
    };
    try {
        const serverResponse = await axios.post(`${config.APIURL}company/create-company`, company_details,{headers:{"Authorization":token}});
        console.log('Response:', serverResponse.data);
        Swal.fire({
            icon: "success",
            title: "Success",
            text:"Customers Created Successfully!",
          });
        
    } catch (error) {
        console.error('Error:', error);
        var errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
        errorToast.show();
    } 
});


