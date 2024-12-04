document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  try {
    // Fetch the data from the backend using Axios

  const elements = {
      userName: document.getElementById("user_name"),
      userAvatar: document.getElementById("user-avatar"),
      userAvatar1: document.getElementById("user-avatar1"),
      userGroup: document.getElementById("user-group"),
      activeCount: document.getElementById("activeCount"),
      inactiveCount: document.getElementById("inactiveCount"),
      rankCharts: document.getElementById("rankCharts"),
      proposedCount: document.getElementById("proposedCount"),
      approvedCount: document.getElementById("approvedCount"),
      joinedCount: document.getElementById("joinedCount"),
      rejectedCount: document.getElementById("rejectedCount"),
      proposedPercentageChange: document.getElementById(
        "proposedPercentageChange"
      ),
      approvedPercentageChange: document.getElementById(
        "approvedPercentageChange"
      ),
      joinedPercentageChange: document.getElementById("joinedPercentageChange"),
      rejectedPercentageChange: document.getElementById(
        "rejectedPercentageChange"
      ),
      proposedArrowIcon: document.getElementById("proposedArrowIcon"),
      approvedArrowIcon: document.getElementById("approvedArrowIcon"),
      joinedArrowIcon: document.getElementById("joinedArrowIcon"),
      rejectedArrowIcon: document.getElementById("rejectedArrowIcon"),
      callCount: document.getElementById("callCount"),
      percentageChange: document.getElementById("percentageChange"),
      arrowIcon: document.getElementById("arrowIcon"),
      datetime: document.getElementById("datetime"),
      icon: document.querySelector('link[rel="icon"]'),
  };

  async function fetchData(days) {
        const selectUser = document.getElementById("userList").value;
        const userFilter = document.getElementById("filterByUser").checked;
      try {       
        if(selectUser!=="" || userFilter===true) {
            if(selectUser!=="" && userFilter===true) {
                getSelectedUserStats(selectUser)
            }else if(userFilter===true) {
                getUserStats(days);
            }
        }else {
            hideLoader('stats-discussion')
            signOff(days);
            onboard(days);
            signoffdailycount(days);
            dueforrenewal(days);
            getUserStats(days);
            const response = await axios.get(
            `${config.APIURL}candidate/signups?days=${days}`
            );
          const signupCount = response.data.signupCount;
          console.log(response);
            document.getElementById("signupCount").innerText = signupCount;
        }
      } catch (error) {
        console.error("Error fetching signup count:", error);
        document.getElementById("signupCount").innerText = "Error";
      }

      try {
        if(selectUser==="" && userFilter===false) {
            const callCountResponse = await axios.get(
            `${config.APIURL}candidate/call-count?days=${days}`,
            { headers: { Authorization: token } }
            );
            const statusCountResponse = await axios.get(
            `${config.APIURL}candidate/statuscount?days=${days}`,
            { headers: { Authorization: token } }
            );
            const callCountFromModelResponse = await axios.get(
            `${config.APIURL}candidate/percentage?days=${days}`,
            { headers: { Authorization: token } }
            );
      
          const callCountData = callCountResponse.data;
          const statusCountData = statusCountResponse.data.counts[0];
          const percentageData = callCountFromModelResponse.data;
      
          updateCallCounts(callCountData, percentageData, elements);
          updateStatusCounts(statusCountData, percentageData, elements);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await axios.get(
          `${config.APIURL}candidate/signondaily?days=${days}`
        );
        console.log("Sign on", response);
          const candidates = response.data.count;
        const contractsDiv = document.getElementById("contracts");
        contractsDiv.innerHTML = ""; // Clear previous content
        contractsDiv.textContent = candidates;
      } catch (error) {
        console.error("Error fetching contracts:", error);
        document.getElementById("contracts").innerText =
          "Error fetching contracts";
      }
  }

    document
      .getElementById("dailyButton")
      .addEventListener("click", () => { document.getElementById("currentOption").value = 1; fetchData(1) });
    document
      .getElementById("weeklyButton")
      .addEventListener("click", () => { document.getElementById("currentOption").value = 7; fetchData(7) });
    document
      .getElementById("monthlyButton")
      .addEventListener("click", () => { document.getElementById("currentOption").value = 30; fetchData(30) });

  // Fetch initial data for daily view
  fetchData(1);

  const decodedToken = decodeToken(token);
  updateDateTime(elements.datetime);
  setInterval(() => updateDateTime(elements.datetime), 1000);

  function updateCallCounts(callCountData, percentageData, elements) {
      const callCountFromAPI = callCountData.call_count;
      const callCountFromModel = percentageData.call_count;
      const percentageChange = callCountFromAPI - callCountFromModel;
      console.log(callCountFromAPI, "callCountFromAPI");
      if (
        elements.callCount &&
        elements.percentageChange &&
        elements.arrowIcon
      ) {
          elements.callCount.textContent = callCountFromAPI;
        elements.callCount.className = "text-dark";

          elements.percentageChange.textContent = `${Math.abs(percentageChange)}`;

          if (percentageChange > 0) {
          elements.arrowIcon.className = "bx bx-up-arrow-alt text-success";
          } else if (percentageChange < 0) {
          elements.arrowIcon.className = "bx bx-down-arrow-alt text-danger";
          } else {
          elements.arrowIcon.className = "bx bx-minus text-secondary";
          }
      } else {
        console.error("One or more elements are missing in the DOM.");
      }
  }

  function updateStatusCounts(statusCountData, percentageData, elements) {
      const proposedPercentageChange =
        statusCountData.proposed_count - percentageData.proposed_count;
      const approvedPercentageChange =
        statusCountData.approved_count - percentageData.approved_count;
      const joinedPercentageChange =
        statusCountData.joined_count - percentageData.joined_count;
      const rejectedPercentageChange =
        statusCountData.rejected_count - percentageData.rejected_count;

      elements.proposedCount.textContent = statusCountData.proposed_count;
      elements.approvedCount.textContent = statusCountData.approved_count;
      elements.joinedCount.textContent = statusCountData.joined_count;
      elements.rejectedCount.textContent = statusCountData.rejected_count;

      updateArrowIcon(
        elements.proposedArrowIcon,
        elements.proposedPercentageChange,
        proposedPercentageChange
      );
      updateArrowIcon(
        elements.approvedArrowIcon,
        elements.approvedPercentageChange,
        approvedPercentageChange
      );
      updateArrowIcon(
        elements.joinedArrowIcon,
        elements.joinedPercentageChange,
        joinedPercentageChange
      );
      updateArrowIcon(
        elements.rejectedArrowIcon,
        elements.rejectedPercentageChange,
        rejectedPercentageChange
      );
  }

    function updateArrowIcon(
      arrowIconElement,
      percentageChangeElement,
      percentageChange
    ) {
      percentageChangeElement.textContent = Math.abs(percentageChange);

      if (percentageChange > 0) {
        arrowIconElement.className = "bx bx-up-arrow-alt text-success";
      } else if (percentageChange < 0) {
        arrowIconElement.className = "bx bx-down-arrow-alt text-danger";
      } else {
        arrowIconElement.className = "bx bx-minus text-secondary";
      }
  }

    document.getElementById("logout").addEventListener("click", function () {
      // Display the modal with initial message
      var myModal = new bootstrap.Modal(document.getElementById("logoutModal"));
      myModal.show();
      
      // Send request to update logged status to false
      const userId = localStorage.getItem("userId");
      if (userId) {
        axios
          .put(`${config.APIURL}user/${userId}/logout`)
          .then((response) => {
            console.log("Logged out successfully");
              })
          .catch((error) => {
            console.error("Error logging out:", error);
              });
      } else {
        console.error("User ID not found in localStorage");
      }
  
      localStorage.clear();
      
      // Change the message and spinner after a delay
      setTimeout(function () {
        document.getElementById("logoutMessage").textContent =
          "Shutting down all sessions...";
      }, 1000);
  
      // Redirect after another delay
      setTimeout(function () {
          window.location.href = "loginpage.html";
      }, 2000);
  });

  function decodeToken(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(atob(base64));
  }

  function updateDateTime(element) {
      const now = new Date();
  
      // Format time
      const options = { hour: "2-digit", minute: "2-digit", hour12: true };
      const formattedTime = now.toLocaleTimeString("en-IN", options);
  
      // Get day of the week
      const dayOfWeek = now.toLocaleDateString("en-IN", { weekday: "long" });
  
      // Update the element's text content
      element.textContent = `Indian Time: ${formattedTime}, ${dayOfWeek}`;
  }



async function getUserStats(days) {
    
    showLoader("chart-sec");
    const response = await axios.get(
      `${config.APIURL}candidate/user-stats?days=${days}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    hideLoader("chart-sec");
    var lables = "Today";
    if (days === 7) {
      lables = "Last 7 Days";
    } else if (days === 30) {
      lables = "Last 7 Days";
    }
  
    Highcharts.chart("chartcontainer", {
      chart: {
        type: "pie",
      },
      title: {
        text: `${lables} Total Calls`,
      },
      tooltip: {
        valueSuffix: "",
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: [
            {
              enabled: true,
              distance: 20,
            },
            {
              enabled: true,
              distance: -40,
              format: "{point.y}",
              style: {
                fontSize: "1.2em",
                textOutline: "none",
                opacity: 0.7,
              },
            },
          ],
        },
      },
      series: [
        {
          name: "",
          colorByPoint: true,
          data: response.data.totalCallList,
        },
      ],
    });
    Highcharts.chart("chartcontainer1", {
      chart: {
        type: "pie",
      },
      title: {
        text: `${lables} Total Created`,
      },
      tooltip: {
        valueSuffix: "",
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: [
            {
              enabled: true,
              distance: 20,
            },
            {
              enabled: true,
              distance: -40,
              format: "{point.y}",
              style: {
                fontSize: "1.2em",
                textOutline: "none",
                opacity: 0.7,
              },
            },
          ],
        },
      },
      series: [
        {
          name: "",
          colorByPoint: true,
          data: response.data.createdList,
        },
      ],
    });
  
    Highcharts.chart("chartcontainer2", {
      chart: {
        type: "column",
      },
      title: {
        text: "User Wise Statistics",
        align: "left",
      },
  
      xAxis: {
        categories: response.data.users,
        crosshair: true,
        accessibility: {
          description: "Countries",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Total Count",
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          pointWidth: 20, // Set the bar width in pixels
        },
      },
      series: response.data.chartdata,
    });
  }
  
  const checkbox = document.getElementById("filterByUser");
  const myDiv = document.querySelectorAll(".stats-count");
  const hiddenStats = document.querySelectorAll(".hidden-stats");
  const user_list = document.getElementById("user_list");
  
  
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      myDiv.forEach((div) => {
        div.classList.toggle("hidden-sec");
      });
      hiddenStats.forEach((div) => {
        div.classList.remove("hidden-sec");
      });
      user_list.classList.remove("hidden-sec");
    } else {
        var days_ = document.getElementById("currentOption").value
      fetchData(days_);
      myDiv.forEach((div) => {
        div.classList.remove("hidden-sec");
      });
      hiddenStats.forEach((div) => {
        div.classList.toggle("hidden-sec");
      });
      user_list.classList.toggle("hidden-sec");
    }
  });
  const statsdiscussion = document.getElementById("stats-discussion");
  const chartsec = document.getElementById("chart-sec");
  
  const userListSelect = document.getElementById("userList");
  userListSelect.addEventListener("change", (event) => {
    showLoader("stats-discussion");
    var selectedValue = event.target.value
      if(selectedValue!=="") {
          getSelectedUserStats(event.target.value);
          statsdiscussion.classList.remove("hidden-sec");
          chartsec.classList.add("hidden-sec");
      }else {
          statsdiscussion.classList.add("hidden-sec");
          chartsec.classList.remove("hidden-sec");
          document.getElementById("percentage1").style.display = 'block';
          document.getElementById("percentage2").style.display = 'block';
          document.getElementById("percentage3").style.display = 'block';
          document.getElementById("percentage4").style.display = 'block';
          document.getElementById("percentage5").style.display = 'block';
      }
  });
  
  async function getSelectedUserStats(userID) {
    var days_ = document.getElementById("currentOption").value
      const response = await axios.get(
        `${config.APIURL}candidate/single-user-stats?days=${days_}&userID=${userID}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response.data.success === true) {
          document.getElementById("callCount").textContent = response.data.totalCallList
          document.getElementById("proposedCount").textContent = response.data.proposedList
          document.getElementById("approvedCount").textContent = response.data.approvedList
          document.getElementById("joinedCount").textContent = response.data.joinedList
          document.getElementById("rejectedCount").textContent = response.data.rejectedList
  
          document.getElementById("percentage1").style.display = 'none';
          document.getElementById("percentage2").style.display = 'none';
          document.getElementById("percentage3").style.display = 'none';
          document.getElementById("percentage4").style.display = 'none';
          document.getElementById("percentage5").style.display = 'none';
          
      }
      hideLoader("stats-discussion");
  
  }
  
  loadCurrentUser();
  async function loadCurrentUser() {
    const rankDropdown = document.getElementById("userList");
    rankDropdown.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Select User --";
    rankDropdown.appendChild(defaultOption);
    const response = await axios.get(`${config.APIURL}user/current-user`);
    if (response.data.success === true) {
      if (response.data.userList.length > 0) {
        for (let i = 0; i < response.data.userList.length; i++) {
          const option = document.createElement("option");
          option.value = response.data.userList[i].id;
          option.text = response.data.userList[i].userName;
          rankDropdown.appendChild(option);
        }
      }
    } 
  }

  } catch (err) {
    console.log(err);
  }
});

  async function signOff(days) {
  const response = await axios.get(
    `${config.APIURL}candidate/signoffdaily/?days=${days}`
  );
  const signOffContainer = document.getElementById("sign-off"); // Use a different variable name
  signOffContainer.innerHTML = ""; // Clear previous content
    const signOffData = response.data.count;
  signOffContainer.textContent = signOffData;
}
async function onboard(days) {
  const response = await axios.get(
    `${config.APIURL}candidate/onboardcount?days=${days}`
  );
  const signOffContainer = document.getElementById("onboardcount"); // Use a different variable name
  signOffContainer.innerHTML = ""; // Clear previous content
    const signOffData = response.data.count;
  signOffContainer.textContent = signOffData;
}

async function dueforrenewal(days) {
  const response = await axios.get(
    `${config.APIURL}candidate/dueforrenewalcount?days=${days}`
  );
  const signOffContainer = document.getElementById("dueforrenewal"); // Use a different variable name
  signOffContainer.innerHTML = ""; // Clear previous content
    const signOffData = response.data.count;
  signOffContainer.textContent = signOffData;
}


async function signoffdailycount(days) {
  const response = await axios.get(
    `${config.APIURL}candidate/signoffcount?days=${days}`
  );
  const signOffContainer = document.getElementById("signoffcount"); // Use a different variable name
  signOffContainer.innerHTML = ""; // Clear previous content
    const signOffData = response.data.count;
  signOffContainer.textContent = signOffData;
}

async function fetchDatas() {
    try {
    const url = `${config.APIURL}candidate/statusdata`;
        const response = await axios.get(url);
        renderDiscussionData(response.data);
    } catch (error) {
    console.error("Error fetching discussion data:", error);
    }
}

// Function to render discussion data
function renderDiscussionData(data) {
  const discussionList = document.getElementById("discussionList");
  discussionList.innerHTML = ""; // Clear existing items

    // Iterate over each status and render discussions for each status
    for (const status in data) {
        const discussions = data[status];
    console.log(status);

    discussions.forEach((discussion) => {
            // Render each discussion item
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
            listItem.innerHTML = `
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="mb-1 d-flex align-items-center text-white">Candidate ID: <button class="btn btn-primary btn-link  ms-2  pt-0 pb-0 candidate-btn text-white" data-candidate-id="${
                          discussion.candidateId
                        }">${discussion.candidateId}</button></h5>
                        <p class="mb-1 text-dark">Discussion: ${
                          discussion.discussion
                        }</p>
                    </div>
                    <div>
                        <span class="${getBadgeColor(status)}">${status}</span>
                    </div>
                </div>
                <small class="text-white">Reminder Date: ${
                  discussion.r_date
                }</small>
            `;
            discussionList.appendChild(listItem);

            // Add event listener to candidate ID button
      listItem.querySelector(".candidate-btn").addEventListener("click", () => {
                const candidateId = discussion.candidateId;
        localStorage.setItem("memId", candidateId);
                // Redirect to view-candidate page with candidateId
                window.location.href = `view-candidate.html?id=${candidateId}`;
            });
        });
    }
}

// Function to determine badge color based on discussion status
function getBadgeColor(status) {
    switch (status) {
    case "Proposed":
      return "badge bg-primary";
    case "Approved":
      return "badge bg-success";
    case "Joined":
      return "badge bg-info";
    case "Rejected":
      return "badge bg-danger";
        default:
      return "badge bg-secondary"; // Default badge color for unknown statuses
    }
}
fetchDatas();

async function fetchCallsCount() {
    try {
    const response = await axios.get(`${config.APIURL}candidate/callforoneday`);
      const { count } = response.data;
    console.log(count);
      // Update the DOM with the fetched count
    document.getElementById("callsCount").textContent = count;
    } catch (error) {
    console.error("Error fetching calls count:", error);
    }
  }
fetchCallsCount();
