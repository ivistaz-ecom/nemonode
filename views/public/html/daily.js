document.addEventListener("DOMContentLoaded", async () => {
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
      datetime: document.getElementById("datetimedashboard"),
      icon: document.querySelector('link[rel="icon"]'),
    };
    signOnDGailycount();
    signOffDGailycount();
    contractextensioncount();
    ecoexceededcount();
    signOnPending();

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
            rankWiseConnect(days)
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

      try {
        const response = await axios.get(
          `${config.APIURL}candidate/evaluationcount?days=${days}`
        );
        console.log("Sign on", response);
        const candidates = response.data.count;
        const evaluationsDiv = document.getElementById("evaluations");
        evaluationsDiv.innerHTML = ""; // Clear previous content
        evaluationsDiv.textContent = candidates;
      } catch (error) {
        console.error("Error fetching evaluations:", error);
        document.getElementById("evaluations").innerText =
          "Error fetching evaluations";
      }
    }

    document
      .getElementById("dailyButton")
      .addEventListener("click", () => { document.getElementById("currentOption").value = 1; fetchData(1) });
    document
      .getElementById("yesterdayButton")
      .addEventListener("click", () => { document.getElementById("currentOption").value = 1; fetchData(2) });
      
    document
      .getElementById("weeklyButton")
      .addEventListener("click", () => { document.getElementById("currentOption").value = 7; fetchData(7) });
    document
      .getElementById("monthlyButton")
      .addEventListener("click", () => { document.getElementById("currentOption").value = 30; fetchData(30) });

    // Fetch initial data for daily view
    fetchData(1);

    updateDateTimeN(elements.datetime);
    setInterval(() => updateDateTimeN(elements.datetime), 1000);

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
    console.log(percentageChangeElement, 'percentageChangeElement')
      percentageChangeElement.textContent = Math.abs(percentageChange);

      if (percentageChange > 0) {
        arrowIconElement.className = "bx bx-up-arrow-alt text-success";
      } else if (percentageChange < 0) {
        arrowIconElement.className = "bx bx-down-arrow-alt text-danger";
      } else {
        arrowIconElement.className = "bx bx-minus text-secondary";
      }
    }

  
    function updateDateTimeN(element) {
      const now = new Date();
      if(element!==null) { 
      // Format time
      const options = { hour: "2-digit", minute: "2-digit", hour12: true };
      const formattedTime = now.toLocaleTimeString("en-IN", options);

      // Get day of the week
      const dayOfWeek = now.toLocaleDateString("en-IN", { weekday: "long" });

      // Update the element's text content
      element.textContent = `Indian Time: ${formattedTime}, ${dayOfWeek}`;
      }
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
      lables = "Last 30 Days";
    }
    var UserList = response?.data?.users || [];
    const rankDropdown = document.getElementById("userList");
    rankDropdown.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Select User --"; 
    rankDropdown.appendChild(defaultOption);
    if(UserList.length>0) {
      for (let i = 0; i < UserList.length; i++) {
          const option = document.createElement("option");
          option.value = UserList[i].id;
          option.text = UserList[i].userName;
          rankDropdown.appendChild(option);
      }
    }
    Highcharts.chart('chartcontainer', {
      chart: {
          type: 'column'
      },
      title: {
          text: `${lables} Total Calls`
      },
      xAxis: {
          type: 'category',
          labels: {
              autoRotation: [-45, -90],
              style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif'
              }
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Call Count'
          }
      },
      legend: {
          enabled: false
      },
      tooltip: {
          pointFormat: '<b>{point.y} Calls</b>'
      },
      series: [{
          name: 'Call Count',
          colorByPoint: true,
          groupPadding: 0,
          data: response.data.totalCallList,
          dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#FFFFFF',
              inside: true,
              verticalAlign: 'top',
              format: '{point.y}',
              y: 10,
              style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif'
              }
          }
      }]
  });

  Highcharts.chart('chartcontainer1', {
    chart: {
        type: 'column'
    },
    title: {
        text: `${lables} Total Created`
    },
    xAxis: {
        type: 'category',
        labels: {
            autoRotation: [-45, -90],
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Call Count'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<b>{point.y} Profiles created</b>'
    },
    series: [{
        name: 'Call Count',
        colorByPoint: true,
        groupPadding: 0,
        data: response.data.createdList,
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            inside: true,
            verticalAlign: 'top',
            format: '{point.y}',
            y: 10,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
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
        categories: response.data.currentUser,
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
    `${config.APIURL}candidate/dueforrenewalcount`
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

async function signOnDGailycount() {
  const response = await axios.get(
    `${config.APIURL}candidate/signondgcount`
  );
  const SignOnDGContainer = document.getElementById("SignOnDG"); // Use a different variable name
  SignOnDGContainer.innerHTML = ""; // Clear previous content
  const SignOnDGData = response.data.count;
  SignOnDGContainer.textContent = SignOnDGData;
}

async function signOffDGailycount() {
  const response = await axios.get(
    `${config.APIURL}candidate/signoffdgcount`
  );
  const SignOffDGContainer = document.getElementById("SignOffDG"); // Use a different variable name
  SignOffDGContainer.innerHTML = ""; // Clear previous content
  const SignOffDGData = response.data.count;
  SignOffDGContainer.textContent = SignOffDGData;
}

async function contractextensioncount() {
  const response = await axios.get(
    `${config.APIURL}candidate/contractextensioncount`
  );
  const contractextensionContainer = document.getElementById("ContractExtension"); // Use a different variable name
  contractextensionContainer.innerHTML = ""; // Clear previous content
  const contractextensionData = response.data.count;
  contractextensionContainer.textContent = contractextensionData;
}

async function ecoexceededcount() {
  const response = await axios.get(
    `${config.APIURL}candidate/ecoexceededcount`
  );
  const ecoexceededContainer = document.getElementById("EOCExceeded"); // Use a different variable name
  ecoexceededContainer.innerHTML = ""; // Clear previous content
  const ecoexceededData = response.data.count;
  ecoexceededContainer.textContent = ecoexceededData;
}

async function signOnPending() {
  const response = await axios.get(
    `${config.APIURL}candidate/signonpendingcount`
  );
  const SignOnPending = document.getElementById("SignOnPending"); // Use a different variable name
  SignOnPending.innerHTML = ""; // Clear previous content
  const SignOnPendingData = response.data.count;
  SignOnPending.textContent = SignOnPendingData;
}

async function rankWiseConnect(days) {
  try {
    const response = await axios.get(
      `${config.APIURL}candidate/rankwisecallsmade?days=${days}`    
    );
    loadRankWiseChart(response.data.result, days);    
  } catch (error) {
    loadRankWiseChart([], days);
    console.error("Error fetching discussion data:", error);
  } 
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

function gotoStats(type) {
  selecteddays = document.getElementById("currentOption").value;
  
  const selectUser = document.getElementById("userList").value;
  const userFilter = document.getElementById("filterByUser").checked;
  var userCond = '';
  if(selectUser!=="" && userFilter===true) {
    userCond=`&userID=${selectUser}`
  }
  window.open(
    `daily-stats.html?type=${type}&days=${selecteddays}${userCond}`,
    '_blank' // <- This is what makes it open in a new window.
  );
}

/* Load Rank Wise Discussion*/ 

function loadRankWiseChart(callsList, days) {
  let dayDisply = 'Today';
  if(days===2) {
    dayDisply = 'Yesterday';
  }else if(days===7) {
    dayDisply = 'Last 7 Days';
  } else if(days===30) {
    dayDisply = 'Lst 30 Days';
  }
  const ranks = callsList.map(item => item.discussionranks);
  document.getElementById("rankWiseDiscussion").style.height = `${parseInt(100*ranks.length) + 100}px`;
  const totalCalls = callsList.map(item => parseInt(item.totalCalls));
  const yesCount = callsList.map(item => parseInt(item.yesCount));
  const noCount = callsList.map(item => parseInt(item.noCount));
  Highcharts.chart('rankWiseDiscussion', {
    chart: {
        type: 'bar' // 👈 horizontal bars
    },
    title: {
      text: `Rank Wise Calls Made - ${dayDisply}`,
    },
    xAxis: {
        categories: ranks,
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Count',
            align: 'high'
        },
        labels: {
            overflow: 'justify',
            fontSize:20
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                fontSize:20
            }
        }
    },
    tooltip: {
        formatter: function () {
            return `<b>${this.x}</b><br/>${this.series.name}: ${this.y}<br/>Total: ${this.point.stackTotal}`;
        }
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                fontSize:20
            }
        }
    },
    legend: {
        reversed: true,
    },
    series: [{
        name: 'Connected',
        color:'#008000',
        data: yesCount
    }, {
        name: 'Not Connected',
        color:'#C4A484',
        data: noCount
    }]
  });
}


/* 

const startYear = 1960,
    endYear = 2022,
    nbr = 20;

let dataset, chart;


(function (H) {
    const FLOAT = /^-?\d+\.?\d*$/;

    // Add animated textSetter, just like fill/strokeSetters
    H.Fx.prototype.textSetter = function () {
        const chart = H.charts[this.elem.renderer.chartIndex];

        let thousandsSep = chart.numberFormatter('1000.0')[1];

        if (/[0-9]/.test(thousandsSep)) {
            thousandsSep = ' ';
        }

        const replaceRegEx = new RegExp(thousandsSep, 'g');

        let startValue = this.start.replace(replaceRegEx, ''),
            endValue = this.end.replace(replaceRegEx, ''),
            currentValue = this.end.replace(replaceRegEx, '');

        if ((startValue || '').match(FLOAT)) {
            startValue = parseInt(startValue, 10);
            endValue = parseInt(endValue, 10);

            // No support for float
            currentValue = chart.numberFormatter(
                Math.round(startValue + (endValue - startValue) * this.pos),
                0
            );
        }

        this.elem.endText = this.end;

        this.elem.attr(this.prop, currentValue, null, true);
    };

    // Add textGetter, not supported at all at this moment:
    H.SVGElement.prototype.textGetter = function () {
        const ct = this.text.element.textContent || '';
        return this.endText ? this.endText : ct.substring(0, ct.length / 2);
    };

    // Temporary change label.attr() with label.animate():
    // In core it's simple change attr(...) => animate(...) for text prop
    H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
        const attr = H.SVGElement.prototype.attr,
            chart = this.chart;

        if (chart.sequenceTimer) {
            this.points.forEach(point =>
                (point.dataLabels || []).forEach(
                    label =>
                        (label.attr = function (hash) {
                            if (
                                hash &&
                                hash.text !== undefined &&
                                chart.isResizing === 0
                            ) {
                                const text = hash.text;

                                delete hash.text;

                                return this
                                    .attr(hash)
                                    .animate({ text });
                            }
                            return attr.apply(this, arguments);

                        })
                )
            );
        }

        const ret = proceed.apply(
            this,
            Array.prototype.slice.call(arguments, 1)
        );

        this.points.forEach(p =>
            (p.dataLabels || []).forEach(d => (d.attr = attr))
        );

        return ret;
    });
}(Highcharts));

function getData(year) {
    const output = Object.entries(dataset)
        .map(country => {
            const [countryName, countryData] = country;
            return [countryName, Number(countryData[year])];
        })
        .sort((a, b) => b[1] - a[1]);
    return [output[0], output.slice(1, nbr)];
}

function getSubtitle() {
   
    return `
        <span style="font-size: 22px">
            Total:  billion
        </span>`;
}

(async () => {

    dataset = await fetch(
        'https://demo-live-data.highcharts.com/population.json'
    ).then(response => response.json());


    chart = Highcharts.chart('avilablityCandidate', {
        chart: {
            animation: {
                duration: 500
            },
            marginRight: 50
        },
        title: {
            text: 'World population by country',
            align: 'left'
        },
        subtitle: {
            text: getSubtitle(),
            floating: true,
            align: 'right',
            verticalAlign: 'middle',
            useHTML: true,
            y: -80,
            x: -100
        },

        legend: {
            enabled: false
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            opposite: true,
            tickPixelInterval: 150,
            title: {
                text: null
            }
        },
        plotOptions: {
            series: {
                animation: false,
                groupPadding: 0,
                pointPadding: 0.1,
                borderWidth: 0,
                colorByPoint: true,
                dataSorting: {
                    enabled: true,
                    matchByName: true
                },
                type: 'bar',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                type: 'bar',
                name: startYear,
                data: getData(startYear)[1]
            }
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 550
                },
                chartOptions: {
                    xAxis: {
                        visible: false
                    },
                    subtitle: {
                        x: 0
                    },
                    plotOptions: {
                        series: {
                            dataLabels: [{
                                enabled: true,
                                y: 8
                            }, {
                                enabled: true,
                                format: '{point.name}',
                                y: -8,
                                style: {
                                    fontWeight: 'normal',
                                    opacity: 0.7
                                }
                            }]
                        }
                    }
                }
            }]
        }
    });
})();


function update(increment) {
    if (increment) {
        input.value = parseInt(input.value, 10) + increment;
    }
    if (input.value >= endYear) {
        // Auto-pause
        pause(btn);
    }

    chart.update(
        {
            subtitle: {
                text: getSubtitle()
            }
        },
        false,
        false,
        false
    );

    chart.series[0].update({
        name: input.value,
        data: getData(input.value)[1]
    });
} */







