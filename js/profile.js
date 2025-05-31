// ----- Helper Functions -----
function showAlert(message, type, element) {
  if (!element) {
    console.error("Alert element not provided for message:", message);
    return;
  }
  // Reset classes first
  element.className = 'alert mt-3'; // Base classes
  element.classList.add(`alert-${type}`);
  element.innerText = message;
  element.style.display = "block";

  if (element.alertTimeout) {
    clearTimeout(element.alertTimeout);
  }

  element.alertTimeout = setTimeout(() => {
    element.style.display = "none";
    element.innerText = "";
    element.className = "alert mt-3";
  }, 4000);
}

function toggleInputs(ids, enable, formElement = document) {
  ids.forEach(id => {
    const input = formElement.querySelector(`#${id}`);
    if (input) {
      input.disabled = !enable;
      // For non-file inputs, if disabling, you might want to ensure their current values are from a trusted source (e.g., loaded data)
      // For file inputs, clearing them on cancel/successful save might be desired, handled specifically in KYC.
    }
  });
}

// ----- Generic Form Section Setup -----
function setupFormSection({
  formId,
  editButtonId,
  cancelButtonId,
  actionButtonsId,
  alertMessageId,
  inputIds,
  apiEndpoint,
  successMessage,
  buildPayloadFn
}) {
  const form = document.getElementById(formId);
  const editButton = document.getElementById(editButtonId);
  const cancelButton = document.getElementById(cancelButtonId);
  const actionButtons = document.getElementById(actionButtonsId);
  const alertMessage = document.getElementById(alertMessageId);

  if (!form || !actionButtons || !alertMessage) {
    console.error(`Missing critical elements for section controlled by form: ${formId}`);
    return { populate: () => console.warn(`Cannot populate ${formId} - elements missing.`) };
  }

  // Store original values for cancellation
  const originalValues = {};

  if (editButton) {
    editButton.addEventListener("click", () => {
      // Save current values before enabling edit
      inputIds.forEach(id => {
        const input = form.querySelector(`#${id}`);
        if (input) originalValues[id] = input.value;
      });
      toggleInputs(inputIds, true, form);
      actionButtons.style.display = "block";
      editButton.style.display = "none"; // Hide edit button during edit mode
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      // Restore original values
      inputIds.forEach(id => {
        const input = form.querySelector(`#${id}`);
        if (input && originalValues[id] !== undefined) {
          input.value = originalValues[id];
        }
      });
      toggleInputs(inputIds, false, form);
      actionButtons.style.display = "none";
      if (editButton) editButton.style.display = "inline-block"; // Show edit button again
      alertMessage.style.display = "none"; // Hide any previous alerts
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = buildPayloadFn(form);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST", // Or PUT, depending on your API design
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        showAlert(result.message || `Update failed: ${res.status}`, "danger", alertMessage);
      } else {
        showAlert(result.message || successMessage, "success", alertMessage);
        toggleInputs(inputIds, false, form);
        actionButtons.style.display = "none";
        if (editButton) editButton.style.display = "inline-block"; // Show edit button again
         // Update originalValues with new saved data
        inputIds.forEach(id => {
            const input = form.querySelector(`#${id}`);
            if (input) originalValues[id] = input.value;
        });
      }
    } catch (error) {
      console.error(`Error updating ${formId}:`, error);
      showAlert("An unexpected error occurred. Please try again.", "danger", alertMessage);
    }
  });

  const populate = (data) => {
    inputIds.forEach(id => {
      const inputElement = form.querySelector(`#${id}`);
      if (inputElement) {
        // Ensure data provides the key either as 'id' or as input 'name'
        const value = data[id] || data[inputElement.name] || "";
        inputElement.value = value;
        originalValues[id] = value; // Store initially loaded values
      }
    });
  };

  return { populate };
}

// ----- Payload Builder Functions -----
const buildProfilePayload = (form) => ({
  name: form.name.value,
  email: form.email.value,
  phone: form.phone.value,
  dob: form.dob.value,
});

const buildAddressPayload = (form) => ({
  streetAddress: form.streetAddress.value, // HTML id is streetAddress
  city: form.city.value,
  state: form.state.value,
  zipCode: form.zipCode.value,
});

const buildBankPayload = (form) => ({
  bankName: form.bankName.value,
  accountNumber: form.accountNumber.value,
  ifscCode: form.ifscCode.value,
});

const buildWalletPayload = (form) => ({
  walletAddress: form.walletAddress.value,
});


// ----- KYC Section Specific Logic -----
function setupKycSection() {
  const kycForm = document.getElementById("kycForm");
  const kycActionButtons = document.getElementById("kycActionButtons");
  const addressProofInput = document.getElementById("addressProof");
  const idProofInput = document.getElementById("idProof");
  const cancelKycButton = document.getElementById("cancelKycButton");
  const kycAlertMessage = document.getElementById("kycAlertMessage");

  if (!kycForm || !kycActionButtons || !addressProofInput || !idProofInput || !cancelKycButton || !kycAlertMessage) {
    console.error("Missing critical elements for KYC section.");
    return;
  }

  const toggleKycActionButtons = () => {
    if (addressProofInput.files.length > 0 || idProofInput.files.length > 0) {
      kycActionButtons.style.display = "block";
    } else {
      kycActionButtons.style.display = "none";
    }
  };

  addressProofInput.addEventListener('change', toggleKycActionButtons);
  idProofInput.addEventListener('change', toggleKycActionButtons);

  cancelKycButton.addEventListener("click", () => {
    addressProofInput.value = ''; // Clear file selection
    idProofInput.value = '';   // Clear file selection
    kycActionButtons.style.display = "none";
    kycAlertMessage.style.display = "none";
    // Ensure inputs are enabled (they are by default, but good to be explicit)
    addressProofInput.disabled = false;
    idProofInput.disabled = false;
  });

  kycForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const token = localStorage.getItem("token");

    if (addressProofInput.files[0]) {
      formData.append("address_proof", addressProofInput.files[0]);
    }
    if (idProofInput.files[0]) {
      formData.append("id_proof", idProofInput.files[0]);
    }

    if (formData.entries().next().done) { // Check if FormData is empty
        showAlert("Please select at least one file to upload.", "warning", kycAlertMessage);
        return;
    }

    try {
      const res = await fetch("/api/user/kyc-upload/", {
        method: "POST",
        headers: { // For FormData, browser sets Content-Type with boundary
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      const result = await res.json();

      if (!res.ok) {
        showAlert(result.message || `KYC upload failed: ${res.status}`, "danger", kycAlertMessage);
      } else {
        showAlert(result.message || "KYC uploaded successfully", "success", kycAlertMessage);
        addressProofInput.value = ''; // Clear file selection
        idProofInput.value = '';   // Clear file selection
        kycActionButtons.style.display = "none";
        // Files inputs remain enabled for future uploads
      }
    } catch (error) {
      console.error("KYC upload error:", error);
      showAlert("KYC upload failed due to a network or server error.", "danger", kycAlertMessage);
    }
  });
}


// ----- Load User Data and Initialize Sections on Page Load -----
document.addEventListener("DOMContentLoaded", async () => {
  const sections = {};

  sections.profile = setupFormSection({
    formId: "profileForm",
    editButtonId: "editProfileButton",
    cancelButtonId: "cancelProfileButton",
    actionButtonsId: "profileActionButtons",
    alertMessageId: "profileAlertMessage",
    inputIds: ["name", "email", "phone", "dob"],
    apiEndpoint: "/api/user/update/",
    successMessage: "Profile updated successfully",
    buildPayloadFn: buildProfilePayload
  });

  sections.address = setupFormSection({
    formId: "addressForm",
    editButtonId: "editAddressButton",
    cancelButtonId: "cancelAddressButton",
    actionButtonsId: "addressActionButtons",
    alertMessageId: "addressAlertMessage",
    inputIds: ["streetAddress", "city", "state", "zipCode"],
    apiEndpoint: "/api/user/address-update/",
    successMessage: "Address updated successfully",
    buildPayloadFn: buildAddressPayload
  });

  sections.bank = setupFormSection({
    formId: "bankForm",
    editButtonId: "editBankButton",
    cancelButtonId: "cancelBankButton",
    actionButtonsId: "bankActionButtons",
    alertMessageId: "bankAlertMessage",
    inputIds: ["bankName", "accountNumber", "ifscCode"],
    apiEndpoint: "/api/user/bank-update/",
    successMessage: "Bank details updated",
    buildPayloadFn: buildBankPayload
  });

  sections.wallet = setupFormSection({
    formId: "walletForm",
    editButtonId: "editWalletButton",
    cancelButtonId: "cancelWalletButton",
    actionButtonsId: "walletActionButtons",
    alertMessageId: "walletAlertMessage",
    inputIds: ["walletAddress"],
    apiEndpoint: "/api/user/wallet-update/",
    successMessage: "Wallet address updated",
    buildPayloadFn: buildWalletPayload
  });

  setupKycSection(); // Initialize KYC specific logic

  // Load user data
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      // Handle no token: Show a message or redirect. Forms will remain empty.
      // You might want to create a visible alert element in your HTML for global messages.
      console.warn("No authentication token found. User data cannot be loaded.");
      // For now, we'll create a temporary alert if no specific global alert area is defined.
      const container = document.querySelector('.container.py-5') || document.body;
      const alertDiv = document.createElement('div');
      alertDiv.id = "globalPageAlert";
      container.insertBefore(alertDiv, container.firstChild);
      showAlert("You are not logged in. Please log in to see your details.", "warning", alertDiv);
      return;
    }

    const res = await fetch("/api/user/details/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
        const errorData = await res.text(); // Use text() in case response is not JSON
        console.error("Failed to load user details:", res.status, errorData);
        const container = document.querySelector('.container.py-5') || document.body;
        const alertDiv = document.getElementById('globalPageAlert') || document.createElement('div');
        if(!document.getElementById('globalPageAlert')) {
            alertDiv.id = "globalPageAlert";
            container.insertBefore(alertDiv, container.firstChild);
        }
        showAlert(`Failed to load your details (Error: ${res.status}). Please try refreshing.`, "danger", alertDiv);
        return;
    }

    const data = await res.json();

    // Populate form fields
    if (sections.profile && sections.profile.populate) sections.profile.populate(data);
    if (sections.address && sections.address.populate) sections.address.populate(data);
    if (sections.bank && sections.bank.populate) sections.bank.populate(data);
    if (sections.wallet && sections.wallet.populate) sections.wallet.populate(data);
    
    // For KYC, you might display names of already uploaded files if your API provides them
    // e.g., if data.addressProofFilename exists, show it next to the addressProof input.
    // This requires adding elements in your HTML to display such info.
    // Example:
    // if (data.kyc && data.kyc.addressProofFilename) {
    //   const infoEl = document.getElementById('addressProofCurrentFile');
    //   if(infoEl) infoEl.textContent = `Current: ${data.kyc.addressProofFilename}`;
    // }

  } catch (error) {
    console.error("Error loading user details:", error);
    const container = document.querySelector('.container.py-5') || document.body;
    const alertDiv = document.getElementById('globalPageAlert') || document.createElement('div');
    if(!document.getElementById('globalPageAlert')) {
        alertDiv.id = "globalPageAlert";
        container.insertBefore(alertDiv, container.firstChild);
    }
    showAlert("An unexpected error occurred while loading your information. Please refresh the page.", "danger", alertDiv);
  }
});