let cateogryList = [];
let itemList = [
  {
    cateogry: "",
    candidates: [],
    quantity: "",
    unit: "",
    rate: "",
    gstValue: "",
    gstAmount: "",
    totalRate: 0.0,
  },
];
document.addEventListener("DOMContentLoaded", async function () {
  fetchAndDisplayVessels();
  fetchAndDisplayBranch();
  fetchAndDisplayCategory();
  fetchAndDisplayVendor();
  loadSelect();
  if (pageType !== "create") {
    loadPOList();
  }
});
async function serachPO() {
  showLoader("serachPO");
  loadPOList();
}

async function loadPOList(page = 1, limit = 10) {
  try {
    let addParam = "";
    const searchpo_number = $("#searchpo_number").val();
    if (searchpo_number !== "" && searchpo_number !== null) {
      addParam += `&searchpo_number=${searchpo_number}`;
    }
    const branch = $("#branch").val();
    if (branch !== "" && branch !== null) {
      addParam += `&branch=${branch}`;
    }
    const potype = $("#potype").val();
    if (potype !== "" && potype !== null) {
      addParam += `&potype=${potype}`;
    }
    const POvessel = $("#POvessel").val();
    if (POvessel !== "" && POvessel !== null) {
      addParam += `&POvessel=${POvessel}`;
    }
    const vendor = $("#vendor").val();
    if (vendor !== "" && vendor !== null) {
      addParam += `&vendor=${vendor}`;
    }
    const fromDate = $("#po_from_date").val();
    const toDate = $("#po_to_date").val();
    if (fromDate !== "" && fromDate !== null && toDate !== "" && toDate !== null) {
      addParam += `&fromDate=${fromDate}&toDate=${toDate}`;
    }else if (fromDate !== "" && fromDate !== null) {
      addParam += `&fromDate=${fromDate}`;
    }

    const response = await axios.get(`${config.APIURL}api/purchase/list?page=${page}&limit=${limit}${addParam}`, { headers: { Authorization: token } });
    const list = response.data.result;

    const statsBody = document.getElementById("po-list");
    statsBody.innerHTML = "";
    if (list.length > 0) {
      list.forEach((result, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${parseInt(index) + 1 * page}</td>
          <td>${result.poNumber}</td>
          <td>${result.poDate}</td>
          <td>${result.vendorName}</td>
          <td>${result.vesselName}</td>
          <td>${result.poCurrency} ${result.poGrandTotal}</td>          
          <td><a href="javascript:;" onclick="viewPO('${result.poID}', this)"><i class="fa fa-file-pdf" aria-hidden="true"></i></a></td>
          <td id="po-invoice-${result.poID}">${result.poInvoice!=="" && result.poInvoice!==null?`<a href="${config.APIURL}uploads/poinvoice/${result.poInvoice}" target="_blank"><i class="fa fa-file-pdf" aria-hidden="true" title="View Invoice"></i></a>`:`<input type="file" id="${result.poID}" style="display:none" onchange="handleFileUpload(event, '${result.poID}')" />
            <i class="fa fa-upload" aria-hidden="true" style="cursor:pointer" onclick="triggerUpload('${result.poID}')">`}</td>
        `;
        statsBody.appendChild(row);
      });
    } else {
      statsBody.innerHTML = "";
      const row = document.createElement("tr");
      row.innerHTML = `
          <td colspan="6" align="center">No Record Found</td>
        `;
      statsBody.appendChild(row);
    }
    hideLoader("serachPO");
    loadPagenation("pagination-controls", page, response.data.totalPages, response.data.totalRecord);
  } catch (error) {
    hideLoader("serachPO");
    console.error("Error fetching vessels:", error);
  }
}
function triggerUpload(id) {
  document.getElementById(id).click();
}
 function handleFileUpload(event, poID) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("invoice", file);
    formData.append("poID", poID);

    axios.post(`${config.APIURL}api/purchase/uploadPoInvoice`, formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data"
      }
    })
    .then(res => {
      console.log("Upload success:", res.data);
      if(res.data.success===true) {
      alert("Invoice uploaded successfully!");
      $(`#po-invoice-${poID}`).html(`<a href="${config.APIURL}uploads/poinvoice/${res.data.fileName}" target="_blank"><i class="fa fa-file-pdf" aria-hidden="true" title="View Invoice"></i></a>`);
      }else {
        alert("Upload failed!");
      }
      // optionally reload or update row
    })
    .catch(err => {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    });
  }

async function viewPO(poID) {
  showLoader("po-list");
  try {
    const response = await axios.get(`${config.APIURL}api/purchase/generatePO?poID=${poID}`, { headers: { Authorization: token } });
    const fileName = response.data.fileName;
    if (fileName !== "" && fileName !== null) {
      const fileUrl = `${config.APIURL}po/${fileName}`;
      // Create a temporary link and trigger download immediately
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileName; // optional dynamic filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    hideLoader("po-list");
  } catch (e) {
    hideLoader("po-list");
    console.error("Error:", e);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Faild to download",
    });
    console.error("Error fetching vessels:", error);
  }
}
function loadPageData(page) {
  loadPOList(page);
}
async function fetchAndDisplayVessels() {
  try {
    const serverResponse = await axios.get(`${config.APIURL}others/get-vsls`, { headers: { Authorization: token } });
    console.log(serverResponse);
    const vessels = serverResponse.data.vessels; // Fix here

    // Get the select element
    const vesselSelect = document.getElementById("POvessel");

    // Clear previous options
    vesselSelect.innerHTML = "";

    // Add a default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Select Vessel --";

    vesselSelect.appendChild(defaultOption);

    // Add vessels to the dropdown
    vessels.forEach((vessel) => {
      if (vessel.vesselCode !== "" && vessel.vesselCode !== null) {
        const option = document.createElement("option");
        option.value = vessel.id;
        option.text = vessel.vesselName;
        vesselSelect.appendChild(option);
      }
    });
    loadSelect();
  } catch (error) {
    console.error("Error fetching vessels:", error);
  }
}

async function fetchAndDisplayBranch() {
  try {
    const serverResponse = await axios.get(`${config.APIURL}api/purchase/branch/dropdown`, { headers: { Authorization: token } });
    console.log(serverResponse);
    const branches = serverResponse.data.result; // Fix here

    // Get the select element
    const branchSelect = document.getElementById("branch");

    // Clear previous options
    branchSelect.innerHTML = "";

    // Add a default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Select Branch --";

    branchSelect.appendChild(defaultOption);

    // Add vessels to the dropdown
    branches.forEach((branch) => {
      const option = document.createElement("option");
      option.value = branch.value;
      option.text = branch.label;
      branchSelect.appendChild(option);
    });
    loadSelect();
  } catch (error) {
    console.error("Error fetching vessels:", error);
  }
}
async function fetchAndDisplayVendor() {
  try {
    const serverResponse = await axios.get(`${config.APIURL}api/purchase/vendor/dropdown`, { headers: { Authorization: token } });
    console.log(serverResponse);
    const vendors = serverResponse.data.result; // Fix here

    // Get the select element
    const vendorSelect = document.getElementById("vendor");

    // Clear previous options
    vendorSelect.innerHTML = "";

    // Add a default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Select Vendor --";

    vendorSelect.appendChild(defaultOption);

    // Add vessels to the dropdown
    vendors.forEach((vendor) => {
      const option = document.createElement("option");
      option.value = vendor.value;
      option.text = vendor.label;
      vendorSelect.appendChild(option);
    });
    loadSelect();
  } catch (error) {
    console.error("Error fetching vessels:", error);
  }
}

async function fetchAndDisplayCategory() {
  try {
    const serverResponse = await axios.get(`${config.APIURL}api/purchase/category/dropdown`, { headers: { Authorization: token } });
    cateogryList = serverResponse.data.result; // Fix here
    displyitem();
  } catch (error) {
    console.error("Error fetching vessels:", error);
  }
}
function addItem() {
  console.log(itemList, "itemListitemList");
  itemList.push({
    cateogry: "",
    candidates: [],
    quantity: "",
    unit: "",
    rate: "",
    gstValue: "",
    gstAmount: "",
    totalRate: 0.0,
  });
  console.log(itemList, "itemListitemListb");
  displyitem();
}

function displyitem(focusID = "") {
  let finalData = "";
  let subTotal = 0;
  itemList.forEach((item, index) => {

    let totalAmount = item.quantity !== "" && item.rate !== "" ? parseFloat(parseInt(item.quantity) * parseFloat(item.rate)).toFixed("2") : "0.00";    
    const gstAmount =  item.gstValue !== "" && parseFloat(item.gstValue)>0 ? parseFloat((parseFloat(item.gstValue)/100) * parseFloat(totalAmount)).toFixed("2") : "0.00";
    if(item.gstValue !== "" && parseFloat(item.gstValue)>0) {
      totalAmount = parseFloat(parseFloat(totalAmount) + parseFloat(gstAmount)).toFixed("2");
    }
    subTotal += parseFloat(totalAmount);
    let cateogryList_ = cateogryList.map((citem) => {
      return `<option value="${citem.value}" ${item.cateogry == citem.value ? 'selected="selected"' : ""}>${citem.label}</option>`;
    });
    const cateogryError = item?.cateogryError ?? false;
    const candidatesError = item?.candidatesError ?? false;
    const quantityError = item?.quantityError ?? false;
    const unitError = item?.unitError ?? false;
    const rateError = item?.rateError ?? false;
    finalData += `<tr>
                    <td valign="top" class="center-align">${parseInt(index) + 1}</td>
                    <td valign="top">
                    <select class="form-select ${cateogryError ? "error" : ""}"  onchange="changeValue('${index}', 'cateogry', '', this)">
                        <option value="">Select Category</option>
                        ${cateogryList_}
                    </select>
                    </td>
                    <td valign="top">
                    <input type="text" class="form-control ${
                      candidatesError ? "error" : ""
                    }"  placeholder="Candidate ID" onkeydown="if(event.key==='Enter'){changeValue('${index}', 'candidates', '', this)}" />
                    </td>
                    <td>${
                      item.candidates.length > 0
                        ? item.candidates.map((cItem) => `${cItem.ID} - ${cItem.name} - ${cItem.rank}<br/><br/>`).join("") // join all items without commas
                        : ""
                    }</td>
                    <td valign="top">
                    <input type="text" pattern="[0-9]*"  class="form-control ${
                      quantityError ? "error" : ""
                    }" id="quantity_${index}"  placeholder="Qty" onchange="changeValue('${index}', 'quantity', 'quantity_${index}', this)" onkeyup="changeValue('${index}', 'quantity', 'quantity_${index}', this)" value="${
      item.quantity
    }" />
                    </td>
                    <td valign="top">
                    <select class="form-select ${unitError ? "error" : ""}" onchange="changeValue('${index}', 'unit', '', this)">
                        <option value="">Unit</option>
                        <option value="Nos" ${item.unit == "Nos" ? 'selected="selected"' : ""}>Nos</option>
                        <option value="Doz" ${item.unit == "Doz" ? 'selected="selected"' : ""}>Doz</option>
                        <option value="Set" ${item.unit == "Set" ? 'selected="selected"' : ""}>Set</option>
                        <option value="Pcs" ${item.unit == "Pcs" ? 'selected="selected"' : ""}>Pcs</option>
                    </select>
                    </td>
                    <td valign="top">
                    <input type="text" pattern="[0-9]*"  class="form-control ${
                      rateError ? "error" : ""
                    }" id="rate_${index}" placeholder="Rate" onchange="changeValue('${index}', 'rate', 'rate_${index}', this)" onkeyup="changeValue('${index}', 'rate', 'rate_${index}', this)" value="${
      item.rate
    }" />
                    </td>
                    <td valign="top">
                    <input type="text" pattern="[0-9]*"  class="form-control ${
                      rateError ? "error" : ""
                    }" id="gstValue_${index}" placeholder="GST%" onchange="changeValue('${index}', 'gstValue', 'gstValue_${index}', this)" onkeyup="changeValue('${index}', 'gstValue', 'gstValue_${index}', this)" value="${
      item.gstValue
    }" />
                    </td>
                    <td valign="top" class="right-align">${gstAmount}</td>
                    <td valign="top" class="right-align">${totalAmount}</td>
                    <td  valign="top" class="center-align"><i onmouseover="this.style.color='red'" onmouseout="this.style.color='gray'" onclick="removeItem(${index})" class="fa fa-trash" style="color: gray;"></i></td>
                </tr>`;
  });
  $("#po-item").html(finalData);
  calculateAmount(subTotal);
  if (focusID !== "") {
    const el = $(`#${focusID}`)[0];
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }
}
function removeItem(removeID) {
  let itemList_ = itemList;
  itemList_.splice(removeID);
  if(itemList_.length<=0) {
    itemList_ = [{
      cateogry: "",
      candidates: [],
      quantity: "",
      unit: "",
      rate: "",
      gstValue: "",
      gstAmount: "",
      totalRate: 0.0,
    }]
  }
  itemList = itemList_;
  displyitem();  
}
function calculateAmount(subTotal) {
  $("#subTotal").html(subTotal.toFixed("2"));
  const del_charges = $("#del_charges").val() || 0;
  const insurance_amount = $("#insurance_amount").val() || 0;
  const other_amount = $("#other_amount").val() || 0;
  const LessDiscount = $("#LessDiscount").val() || 0;
  let grand_total = 0;
  if (subTotal > 0) {
    grand_total =
      parseFloat(subTotal) +
      parseFloat(del_charges) +
      parseFloat(insurance_amount) +
      parseFloat(other_amount) -
      parseFloat(LessDiscount);
    $("#grand_total").html(parseFloat(grand_total).toFixed(2));
  } else {
    $("#grand_total").html("");
  }
  return { del_charges, insurance_amount, other_amount, grand_total, LessDiscount };
}
async function createNewPO() {
  let error = 0;
  const branch = $("#branch").val();
  if (branch === "") {
    $(".sel-branch .select2-selection").addClass("error");
    error++;
  }
  const potype = $("#potype").val();
  if (potype === "") {
    $(".sel-potype .select2-selection").addClass("error");
    error++;
  }
  const POvessel = $("#POvessel").val();
  if (POvessel === "") {
    $(".sel-POvessel .select2-selection").addClass("error");
    error++;
  }
  const vendor = $("#vendor").val();
  if (vendor === "") {
    $(".sel-vendor .select2-selection").addClass("error");
    error++;
  }
  const po_date = $("#po_date").val();
  if (po_date === "") {
    $("#po_date").addClass("error");
    error++;
  }
  const vendor_ref = $("#vendor_ref").val();
  if (vendor_ref === "") {
    $("#vendor_ref").addClass("error");
    error++;
  }
  const poCurrency = $("#poCurrency").val();
  if (poCurrency === "") {
    $(".sel-poCurrency .select2-selection").addClass("error");
    error++;
  }
  itemList.map((citem) => {
    if (citem.cateogry === "") {
      citem.cateogryError = true;
      error++;
    }
    if (citem.candidates.length === 0) {
      citem.candidatesError = true;
      error++;
    }
    if (citem.quantity === "") {
      citem.quantityError = true;
      error++;
    }
    if (citem.unit === "") {
      citem.unitError = true;
      error++;
    }
    if (citem.rate === "") {
      citem.rateError = true;
      error++;
    }
    if (citem.cateogry === "") {
      citem.cateogryError = true;
      error++;
    }
    if (citem.cateogry === "") {
      citem.cateogryError = true;
      error++;
    }
    return citem;
  });
  if (error > 0) {
    displyitem();
    $("html, body").animate({ scrollTop: $("#po-form .error:first").offset().top - 50 });
  } else {
    let finalItem = [];
    let subTotal = 0;
    let totalTaxAmount = 0;
    itemList.map((citem) => {
      let totalAmount = citem.quantity !== "" && citem.rate !== "" ? parseFloat(parseInt(citem.quantity) * parseFloat(citem.rate)).toFixed("2") : "0.00";
       const gstAmount =  citem.gstValue !== "" && parseFloat(citem.gstValue)>0 ? parseFloat((parseFloat(citem.gstValue)/100) * parseFloat(totalAmount)).toFixed("2") : "0.00";
       totalTaxAmount+= parseFloat(gstAmount);
      if(citem.gstValue !== "" && parseFloat(citem.gstValue)>0 && parseFloat(totalAmount)>0) {
        totalAmount = parseFloat(parseFloat(totalAmount) + parseFloat(gstAmount)).toFixed("2");
      }
      subTotal += parseFloat(totalAmount);
      finalItem.push({
        cateogry: citem.cateogry,
        candidates: citem.candidates,
        quantity: citem.quantity,
        unit: citem.unit,
        rate: citem.rate,
        gstValue: citem.gstValue,
        gstAmount: gstAmount,
        totalRate: totalAmount,
      });
    });
    const calValue = calculateAmount(subTotal);
    const formData = new FormData();
    const poDatas = {
      branch,
      potype,
      POvessel,
      vendor,
      po_date,
      vendor_ref,
      poCurrency,
      finalItem:JSON.stringify(finalItem),
      subTotal: parseFloat(subTotal) - parseFloat(totalTaxAmount),
      gst_amount: totalTaxAmount,
      del_charges: calValue?.del_charges || 0,
      insurance_amount: calValue?.insurance_amount || 0,
      other_amount: calValue?.other_amount || 0,
      lessDiscount: calValue?.LessDiscount || 0,
      grand_total: calValue?.grand_total || 0,
      poNote:$('#poNote').val()
    };
    for (const key in poDatas) {
      if (poDatas.hasOwnProperty(key)) {
        formData.append(key, poDatas[key]);
      }
    }
    try {
      showLoader("createPO");
      const serverResponse = await axios.post(`${config.APIURL}api/purchase/createPO`, formData, { headers: { Authorization: token, "Content-Type": "multipart/form-data", } });
      const successMsg = serverResponse?.data?.message ?? '';
      alert(successMsg);
      setTimeout(() => {
        window.location.href = "/views/public/html/purchase-order.html";  
      }, 1000);      
      hideLoader("createPO");
    } catch (e) {
      hideLoader("createPO");
      const errorMsg = e?.response?.data?.massage || e.message;
      console.error("Error:", e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
    }
  }
}
function changeAmount(evt) {
  evt.addEventListener("input", function () {
    this.value = this.value
      .replace(/[^0-9.]/g, "") // remove non-digits and non-dot
      .replace(/(\..*)\./g, "$1"); // allow only one decimal point
    displyitem();
  });
}
function removeSelectError(name) {
  if(name==='poCurrency') {
    $('#currency_disply').html($('#poCurrency').val());
  }
  $(`.sel-${name} .select2-selection`).removeClass("error");
}
function removeTextError(name) {
  $(`#${name}`).removeClass("error");
}

async function changeValue(index, filedName, focusID, e) {
  let value = e.value;
  if (filedName === "quantity" || filedName === "rate" || filedName ==='gstValue') {
    value = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    if(filedName ==='gstValue' && value>100) {
      value = 100;
    }
  }

  if (filedName === "candidates") {
    try {
      const checkAvail = itemList[index][filedName].some((citem) => citem?.ID === value);
      if (checkAvail) {
        alert("Already Added");
        return false;
      }
      const serverResponse = await axios.get(`${config.APIURL}api/purchase/getNemoDetails?nemoID=${value}`, { headers: { Authorization: token } });
      const result = serverResponse.data.result;
      itemList[index][filedName].push({ ID: value, name: result.name, rank: result.c_rank });
      if (itemList[index][filedName].length > 0) {
        itemList[index][`${filedName}Error`] = false;
      }
    } catch (error) {
      alert("Invalid CandidateID");
      return false;
    }
  } else {
    itemList[index][filedName] = value;
    itemList[index][`${filedName}Error`] = false;
  }
  displyitem(focusID);
}

function loadSelect() {
  $(".form-select").select2();
}
