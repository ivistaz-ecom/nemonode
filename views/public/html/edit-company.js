// Get the token from localStorage

window.onload = async function () {

    const queryParams = new URLSearchParams(window.location.search);

    // Get values using parameter names
    const companyId = queryParams.get('companyId');
    const companyName = queryParams.get('companyname');
    // const businessType = queryParams.get('b_type');
    const contactPerson = queryParams.get('contact_person');
    const email = queryParams.get('email');
    const address = queryParams.get('address');
    const management = queryParams.get('management');
    const phone = queryParams.get('phone');
    const rpsl = queryParams.get('rpsl');

    // Set values into the input fields
    document.getElementById("u_company_id").value = companyId;
    document.getElementById("u_company_name").value = companyName;

    // Set the radio button based on the businessType value (converted to lowercase)
    // document.getElementById(`u_${businessType.toLowerCase()}`).checked = true;

    document.getElementById("u_company_contact").value = contactPerson;
    document.getElementById("u_company_email").value = email;
    document.getElementById("u_company_address").value = address;
    document.getElementById("u_company_management").value = management;
    document.getElementById("u_company_phone").value = phone;
    document.getElementById("rpsl").checked = (rpsl==="Yes")?true:false;
};


const updateCompanyButton = document.getElementById("update-company-form");
updateCompanyButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const companyId = document.getElementById("u_company_id").value;
    
    const selectedBusinessType = document.querySelector('input[name="u_business_type"]:checked');
    const businessType = selectedBusinessType ? selectedBusinessType.value : null;
    const rpsl = document.getElementById("rpsl")
    const updatedCompanyDetails = {
        company_id: companyId,
        c_name: document.getElementById("u_company_name").value,
        b_type: businessType || null, // Use the businessType here
        c_contact: document.getElementById("u_company_contact").value,
        c_email: document.getElementById("u_company_email").value,
        c_addr: document.getElementById("u_company_address").value,
        c_mgmt: document.getElementById("u_company_management").value,
        c_ph: document.getElementById("u_company_phone").value,
        rpsl: (rpsl.checked===true)?'Yes':'No',
    };

    try {
        const response = await axios.put(`${config.APIURL}company/update-company/${companyId}`, updatedCompanyDetails, { headers: { "Authorization": token } });
        console.log('Response:', response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text:"Customers Updated Successfully!",
        });
    } catch (error) {
        console.error('Error:', error);
    }
});