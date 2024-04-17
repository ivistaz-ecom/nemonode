document.addEventListener('DOMContentLoaded', async function () {
    await contract();
    const selectedFields = {
        candidateId: false,
        fname: false,
        c_rank: false,
        c_vessel: false,
        c_ad1: false,
        c_city: false,
        nationality: false,
        c_mobi1: false,
        last_company: false,
        email1: false,
        last_salary: false,
        experience: false,
        dob: false,
        avb_date: false,
        height: false,
        weight: false,
        safety_shoe_size: false,
        boiler_suit_size: false
    };

    const handleDropdownChange = function (e) {
        const selectedOption = e.target.value;
        const newProfileFields = document.getElementById('newProfileFields');
        if (selectedOption === 'New Profile') {
            newProfileFields.style.display = 'block';
        } else {
            newProfileFields.style.display = 'none';
        }
    };

    const handleCheckboxChange = function (e) {
        const id = e.target.id;
        const checked = e.target.checked;
        selectedFields[id] = checked;
    };

    const handleGenerateReport = async function () {
        try {
            if (!Object.values(selectedFields).some(Boolean)) {
                throw new Error('Please select at least one field.');
            }
    
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
    
            if (!startDate || !endDate) {
                throw new Error('Please select both start and end dates.');
            }
    
            const endpoint = 'https://nemonode.ivistaz.co/candidate/reports/view-new-profile';
            const token = localStorage.getItem('token');
            const response = await axios.post(endpoint, {
                selectedFields,
                startDate,
                endDate
            }, {
                headers: { "Authorization": token }
            });
    
            if (!response.data || !response.data.candidates) {
                throw new Error('Error generating report');
            }
    
            const filteredData = response.data.candidates.map(candidate => {
                const filteredCandidate = {};
                Object.keys(selectedFields).forEach(field => {
                    if (selectedFields[field]) {
                        filteredCandidate[field] = candidate[field];
                    }
                });
                return filteredCandidate;
            });
            renderTable(filteredData);
        } catch (error) {
            console.error('Error generating report:', error.message);
        }
    };
    

    const renderTable = function (data) {
        const reportTableDiv = document.getElementById('reportTable');
        reportTableDiv.innerHTML = '';

        if (data.length === 0) {
            reportTableDiv.innerHTML = '<div>No data to display</div>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const columns = Object.keys(data[0]);

        const headerRow = document.createElement('tr');
        columns.forEach((column) => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        data.forEach((rowData) => {
            const row = document.createElement('tr');
            columns.forEach((column) => {
                const td = document.createElement('td');
                td.textContent = rowData[column];
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        reportTableDiv.appendChild(table);

        // Add Export to Excel button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to Excel';
        exportButton.className='btn btn-success'
        exportButton.addEventListener('click', function () {
            exportToExcel(data);
        });
        reportTableDiv.appendChild(exportButton);
    };

    const exportToExcel = function (data) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        XLSX.writeFile(workbook, 'report.xlsx');
    };

    document.getElementById('reportType').addEventListener('change', handleDropdownChange);
    document.getElementById('generateReport').addEventListener('click', handleGenerateReport);

    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
});
async function contract() {
    const selectedFields = {
        id: false,
        rank: false,
        company: false,
        vslName: false,
        vesselType: false,
        sign_on_port: false,
        sign_on: false,
        wage_start: false,
        eoc: false,
        wages: false,
        currency: false,
        wages_types: false,
        sign_off_port: false,
        sign_off: false,
        reason_for_sign_off: false,
        documents: false,
        aoa: false,
        aoa_number: false,
        emigrate_number: false,
        created_by: false
    };

    const handleDropdownChange = async function (e) {
        const selectedOption = e.target.value;
        const contractFields = document.getElementById('contractFields');
        if (selectedOption === 'Contract report') {
            contractFields.style.display = 'block';
            // Fetch contract data from server
            try {
                const endpoint = 'https://nemonode.ivistaz.co/candidate/reports/contract';
                const token = localStorage.getItem('token');
                const response = await axios.post(endpoint, { selectedFields }, { headers: { "Authorization": token } });
                console.log(response.data.contracts)
                if (!response.data.contracts) {
                    throw new Error('Error fetching contract data');
                }

                renderTable(response.data.contracts);
            } catch (error) {
                console.error('Error fetching contract data:', error.message);
            }
        } else {
            contractFields.style.display = 'none';
        }
    };

    const handleCheckboxChange = function (e) {
        const id = e.target.id;
        const checked = e.target.checked;
        selectedFields[id] = checked;
    };

    const handleGenerateReport = async function () {
          try {
              if (!Object.values(selectedFields).some(Boolean)) {
                  throw new Error('Please select at least one field.');
              }

              const endpoint = 'https://nemonode.ivistaz.co/candidate/reports/contract';
              const token = localStorage.getItem('token');
              const response = await axios.post(endpoint, { selectedFields }, { headers: { "Authorization": token } });

              if (!response.data || !response.data.contracts) {
                  throw new Error('Error generating report');
              }

              const filteredData = response.data.contracts.map(contract => {
                  const filteredContract = {};
                  Object.keys(selectedFields).forEach(field => {
                      if (selectedFields[field]) {
                          filteredContract[field] = contract[field];
                      }
                  });
                  return filteredContract;
              });

              renderTable(filteredData);
          } catch (error) {
              console.error('Error generating report:', error.message);
          }
      };

    const renderTable = function (data) {
        const reportTableDiv = document.getElementById('reportTable');
        reportTableDiv.innerHTML = '';

        if (data.length === 0) {
            reportTableDiv.innerHTML = '<div>No data to display</div>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const columns = Object.keys(data[0]);

        const headerRow = document.createElement('tr');
        columns.forEach((column) => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        data.forEach((rowData) => {
            const row = document.createElement('tr');
            columns.forEach((column) => {
                const td = document.createElement('td');
                td.textContent = rowData[column];
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        reportTableDiv.appendChild(table);

        // Add Export to Excel button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to Excel';
        exportButton.className='btn btn-success'
        exportButton.addEventListener('click', function () {
            exportToExcel(data);
        });
        reportTableDiv.appendChild(exportButton);
    };

    const exportToExcel = function (data) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        XLSX.writeFile(workbook, 'report.xlsx');
    };

    document.getElementById('reportType').addEventListener('change', handleDropdownChange);
    document.getElementById('generateReport').addEventListener('click', handleGenerateReport);

    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}




