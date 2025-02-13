async function displayStats(intitalLoad = false, page = 1, limit = 10) {
  try {
    const url = new URL(window.location.href);
    showLoader("stats-sec");
    // Get query string parameters
    const params = new URLSearchParams(url.search);
    const type = params.get("type");
    const days = params.get("days");
    const userID = params.get("userID") || "";
    var stattitle = "";
    var dayText = days;
    if (days == 1) {
      dayText = "Today ";
    }
    if (type === "totalcalls") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days Calls`;
    } else if (type === "Created") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days Created`;
    } else if (type === "Proposed") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days Proposed`;
    } else if (type === "Approved") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days Approved`;
    } else if (type === "Joined") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days Joined`;
    } else if (type === "Rejected") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days Rejected`;
    } else if (type === "SignOff") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days Sign Off`;
    } else if (type === "SignOn") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days Sign On`;
    } else if (type === "OnBoard") {
      stattitle = `${days != 1 ? `Last ${dayText}` : dayText} days On Board`;
    } else if (type === "DueforSignOff") {
      stattitle = `${
        days != 1 ? `Next ${dayText}` : dayText
      } days Due for Sign Off`;
    } else if (type === "DueforRenewal") {
      stattitle = `${
        days != 1 ? `Next ${dayText}` : dayText
      } days Due for Renewal`;
    }
    document.getElementById("stat-title").innerHTML = stattitle;

    const searchKeywords = document.getElementById("searchKeywords").value;

    // Fetch vessels from the server with pagination parameters
    const result = await axios.get(
      `${config.APIURL}candidate/stats-list?days=${days}&type=${type}&userID=${userID}&searchKeywords=${searchKeywords}&page=${page}&limit=${limit}`,
      { headers: { Authorization: token } }
    );
    hideLoader("stats-sec");
    let totalPage = result.data.totalPage;
    let totalRecord = result.data.totalRecord;

    if (parseInt(page) > 1) {
      totalPage = document.getElementById("totalPage").value;
      totalRecord = document.getElementById("totalRecord").value;
    } else {
      document.getElementById("totalPage").value = totalPage;
      document.getElementById("totalRecord").value = totalRecord;
    }
    const statshead = document.getElementById("stats-head");
    if (intitalLoad === true) {
      const row = document.createElement("tr");
      var tblheader = ["Sno", "Candidate ID", "First Name", "Rank"];
      if (type === "DueforRenewal") {
        tblheader.push(
          "Document",
          "Document Number",
          "Issue Date",
          "Expiry Date",
          "Expiry Days",
          "Issue Place",
          "Document Files"
        );
      } else {
        tblheader.push("Vessel", "Mobile", "Email");
      }
      if (
        type === "totalcalls" ||
        type === "Proposed" ||
        type === "Approved" ||
        type === "Joined" ||
        type === "Rejected"
      ) {
        tblheader.push("Discussion");
      } else if (type === "Created") {
        tblheader.push("Created Date");
      } else if (
        type === "SignOff" ||
        type === "SignOn" ||
        type === "OnBoard" ||
        type === "DueforSignOff"
      ) {
        tblheader.push(
          "Sign On",
          "Sign On Port",
          "EOC",
          "Sign Off",
          "Sign Off Port",
          "Reason for Sign Off",
          "Wages",
          "Wages Types",
          "Company Name",
          "AOA Number"
        );
      }
      if (
        type === "totalcalls" ||
        type === "Proposed" ||
        type === "Approved" ||
        type === "Joined" ||
        type === "Rejected" ||
        type === "Created"
      ) {
        tblheader.push("User");
      }
      row.innerHTML = "";
      if (tblheader.length > 0) {
        tblheader.forEach((item) => {
          row.innerHTML += `<th scope="col" class="col-auto">
              ${item}
            </th>`;
        });
      }

      statshead.appendChild(row);
    }
    const statsBody = document.getElementById("stats-list");

    // Clear existing rows
    statsBody.innerHTML = "";
    let sno = (page - 1) * limit + 1;
    if (totalRecord > 0) {
      result.data.listData.forEach((result) => {
        const row = document.createElement("tr");
        var totalDays = "";
        if (type === "DueforRenewal") {
          var totalDays = getDaysBetweenDates(
            new Date(),
            result["expiry_date"]
          );
          if (totalDays <= -1) {
            totalDays = parseFloat(totalDays) + 1;
          }
          if (totalDays <= 7) {
            row.classList.add("table-dangers");
          } else if (totalDays > 7 && totalDays <= 15) {
            row.classList.add("table-orange");
          } else if (totalDays > 15) {
            row.classList.add("table-yellow");
          }
        }

        const cell_ = document.createElement("td");
        cell_.textContent = sno;
        row.appendChild(cell_);
        const fieldsToDisplay = ["candidateId", "fname", "c_rank"];
        if (type === "DueforRenewal") {
          fieldsToDisplay.push(
            "document",
            "document_number",
            "issue_date",
            "expiry_date",
            "expirydays",
            "issue_place",
            "document_files"
          );
        } else {
          fieldsToDisplay.push("c_vessel", "c_mobi1", "email1");
        }

        if (
          type === "totalcalls" ||
          type === "Proposed" ||
          type === "Approved" ||
          type === "Joined" ||
          type === "Rejected"
        ) {
          fieldsToDisplay.push("discussion");
        } else if (type === "Created") {
          fieldsToDisplay.push("cr_date");
        } else if (
          type === "SignOff" ||
          type === "SignOn" ||
          type === "OnBoard" ||
          type === "DueforSignOff"
        ) {
          fieldsToDisplay.push(
            "sign_on",
            "portName",
            "eoc",
            "sign_off",
            "sign_off_port",
            "reason_for_sign_off",
            "wages",
            "wages_types",
            "company_name",
            "aoa_number"
          );
        }
        if (
          type === "totalcalls" ||
          type === "Proposed" ||
          type === "Approved" ||
          type === "Joined" ||
          type === "Rejected" ||
          type === "Created"
        ) {
          fieldsToDisplay.push("userName");
        }

        fieldsToDisplay.forEach((field) => {
          const cell = document.createElement("td");
          if (field === "candidateId") {
            const link = document.createElement("a");
            link.href = `./view-candidate.html?id=${result[field]}`;
            link.textContent = result[field];
            link.target = "_blank";
            cell.appendChild(link);
          } else if (field === "fname") {
            cell.textContent = `${result["fname"]} ${result["lname"]}`;
          } else if (field === "expirydays") {
            cell.textContent = `${totalDays} Day${
              parseInt(totalDays) > 1 ? "s" : ""
            }`;
          } else if (
            field === "sign_on" ||
            field === "issue_date" ||
            field === "expiry_date" ||
            field === "sign_off" ||
            field === "eoc"
          ) {
            cell.textContent = `${showDateFormat(result[field])}`;
          } else {
            if (field === "sign_off") {
              cell.textContent =
                result[field] !== "1970-01-01" && result[field] !== ""
                  ? result[field]
                  : "";
            }
            if (field === "document_files") {
              const link = document.createElement("a");
              link.href = `/views/public/files/${result[field]}`;
              link.textContent = result[field];
              link.target = "_blank";
              cell.appendChild(link);
            } else {
              cell.textContent = result[field];
            }
          }
          row.appendChild(cell);
        });
        statsBody.appendChild(row);
        sno++;
      });
      loadPagenation("pagination-controls", page, totalPage, totalRecord);
    } else {
      document.getElementById("pagination-controls").innerHTML = "";
      const row = document.createElement("tr");
      row.innerHTML = "";
      row.innerHTML = `
                  <td
                      scope="col"
                      class="col-1"
                      colspan="8"
                      align="center"
                  >
                      <b>No Record Found<b/>
                  </th>
              `;

      statsBody.appendChild(row);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function displaymedicalStats(intitalLoad = false, page = 1, limit = 10) {
  try {
    const url = new URL(window.location.href);
    showLoader("medicalstats-sec");
    // Get query string parameters
    const params = new URLSearchParams(url.search);
    const type = params.get("type");
    const days = params.get("days");
    const userID = params.get("userID") || "";

    const searchKeywords = document.getElementById(
      "medicalsearchKeywords"
    ).value;

    // Fetch vessels from the server with pagination parameters
    const result = await axios.get(
      `${config.APIURL}candidate/medical-stats-list?days=${days}&type=${type}&searchKeywords=${searchKeywords}&page=${page}&limit=${limit}`,
      { headers: { Authorization: token } }
    );
    hideLoader("medicalstats-sec");
    let totalPage = result.data.totalPage;
    let totalRecord = result.data.totalRecord;

    if (parseInt(page) > 1) {
      totalPage = document.getElementById("medicaltotalPage").value;
      totalRecord = document.getElementById("medicaltotalRecord").value;
    } else {
      document.getElementById("medicaltotalPage").value = totalPage;
      document.getElementById("medicaltotalRecord").value = totalRecord;
    }
    const statshead = document.getElementById("medicalstats-head");
    if (intitalLoad === true) {
      const row = document.createElement("tr");
      var tblheader = [
        "S.No.",
        "Candidate ID",
        "Name",
        "Rank",
        "hospitalName",
        "place",
        "Issue Date",
        "Expiry Date",
        "Expiry Days",
        "Document",
      ];
      row.innerHTML = "";
      if (tblheader.length > 0) {
        tblheader.forEach((item) => {
          row.innerHTML += `<th scope="col" class="col-auto">
              ${item}
            </th>`;
        });
      }

      statshead.appendChild(row);
    }
    const statsBody = document.getElementById("medicalstats-list");

    // Clear existing rows
    statsBody.innerHTML = "";
    let sno = (page - 1) * limit + 1;
    if (totalRecord > 0) {
      result.data.listData.forEach((result) => {
        var totalDays = getDaysBetweenDates(new Date(), result["expiry_date"]);
        if (totalDays <= -1) {
          totalDays = parseFloat(totalDays) + 1;
        }
        const row = document.createElement("tr");
        if (totalDays <= 7) {
          row.classList.add("table-dangers");
        } else if (totalDays > 7 && totalDays <= 15) {
          row.classList.add("table-orange");
        } else if (totalDays > 15) {
          row.classList.add("table-yellow");
        }
        const fieldsToDisplay = [
          "candidateId",
          "fname",
          "c_rank",
          "hospitalName",
          "place",
          "date",
          "expiry_date",
          "expirydays",
          "upload",
        ];
        const cell_ = document.createElement("td");
        cell_.textContent = sno;
        row.appendChild(cell_);
        fieldsToDisplay.forEach((field) => {
          const cell = document.createElement("td");
          if (field === "candidateId") {
            const link = document.createElement("a");
            link.href = `./view-candidate.html?id=${result[field]}`;
            link.textContent = result[field];
            link.target = "_blank";
            cell.appendChild(link);
          } else if (field === "fname") {
            cell.textContent = `${result["fname"]} ${result["lname"]}`;
          } else if (field === "expirydays") {
            cell.textContent = `${totalDays} Day${
              parseInt(totalDays) > 1 ? "s" : ""
            }`;
          } else if (field === "date" || field === "expiry_date") {
            cell.textContent = `${showDateFormat(result[field])}`;
          } else {
            if (field === "upload") {
              const link = document.createElement("a");
              link.href = `/views/public/uploads/medical/${result[field]}`;
              link.textContent = result[field];
              link.target = "_blank";
              cell.appendChild(link);
            } else {
              cell.textContent = result[field];
            }
          }
          row.appendChild(cell);
        });
        statsBody.appendChild(row);
        sno++;
      });
      loadPagenation(
        "medicalpagination-controls",
        page,
        totalPage,
        totalRecord,
        "medical"
      );
    } else {
      document.getElementById("medicalpagination-controls").innerHTML = "";
      const row = document.createElement("tr");
      row.innerHTML = "";
      row.innerHTML = `
                  <td
                      scope="col"
                      class="col-1"
                      colspan="8"
                      align="center"
                  >
                      <b>No Record Found<b/>
                  </th>
              `;

      statsBody.appendChild(row);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function loadPageData(page, tableType) {
  if (tableType === "medical") {
    var currentPage = document.getElementById("medicalcurrentPage").value;
    if (currentPage != page) {
      document.getElementById("medicalcurrentPage").value = page;
      displaymedicalStats(false, page);
    }
  } else {
    var currentPage = document.getElementById("currentPage").value;
    if (currentPage != page) {
      document.getElementById("currentPage").value = page;
      displayStats(false, page);
    }
  }
}
document.getElementById("searchData").addEventListener("click", () => {
  document.getElementById("currentPage").value = 1;
  displayStats(false, 1);
});

document.getElementById("medicalsearchData").addEventListener("click", () => {
  document.getElementById("medicalcurrentPage").value = 1;
  displaymedicalStats(false, 1);
});
window.onload = async function () {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const type = params.get("type");
  await displayStats(true);
  if (type === "DueforRenewal") {
    await displaymedicalStats(true);
    document.getElementById("medicalstats-div").style.display = "block";
  }
};
