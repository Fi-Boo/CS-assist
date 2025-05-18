const reasonsData = {
  "Accounts": {
    suboptions: {
      "Late Payment": {
        notes: "Customer reported late payment.",
        steps: [
          {
            id: "step1",
            type: "checkbox",
            label: "Confirm due date",
            note: "Due date confirmed.",
          },
          {
            id: "step2",
            type: "checkbox",
            label: "Offer payment extension",
            note: "Payment extension offered.",
          },
          {
            id: "step3",
            type: "radio",
            label: "Payment method",
            options: [
              {
                label: "Credit Card",
                value: "cc",
                note: "Customer pays by credit card.",
              },
              {
                label: "Bank Transfer",
                value: "bt",
                note: "Customer pays by bank transfer.",
              },
            ],
          },
          {
            id: "info1",
            type: "info",
            label: "Credit Card processing may take 2 days.",
            dependsOn: { stepId: "step3", value: "cc" },
          },
          {
            id: "info2",
            type: "info",
            label: "Bank transfers must include reference number.",
            dependsOn: { stepId: "step3", value: "bt" },
          },
        ],
      },
      "Missing Payment": {
        notes: "Customer claims payment not received.",
        steps: [
          {
            id: "step4",
            type: "checkbox",
            label: "Verify payment receipt",
            note: "Payment receipt verified.",
          },
          {
            id: "step5",
            type: "checkbox",
            label: "Check bank statement",
            note: "Bank statement checked.",
          },
        ],
      },
    },
  },
  "Technical Support": {
    suboptions: {
      "Internet Down": {
        notes: "Customer reports no internet connection.",
        steps: [
          {
            id: "step6",
            type: "checkbox",
            label: "Restart modem",
            note: "Modem restarted.",
          },
          {
            id: "step7",
            type: "checkbox",
            label: "Check line status",
            note: "Line status checked.",
          },
        ],
      },
      "Slow Speed": {
        notes: "Customer complains about slow internet speed.",
        steps: [
          {
            id: "step8",
            type: "checkbox",
            label: "Run speed test",
            note: "Speed test results recorded.",
          },
          {
            id: "step9",
            type: "checkbox",
            label: "Check for outages",
            note: "No outages found.",
          },
        ],
      },
    },
  },
};

const accountYesRadio = document.getElementById("accountYes");
const accountNoRadio = document.getElementById("accountNo");
const extraInfoDiv = document.getElementById("extraInfo");
const customerNameInput = document.getElementById("customerName");
const idCustomerCheckbox = document.getElementById("idCustomer");
const accountTypeRadios = document.querySelectorAll('input[name="accountType"]');
const reasonButtonsDiv = document.getElementById("reasonButtons");
const subOptionsDiv = document.getElementById("subOptions");
const notesArea = document.getElementById("notesArea");
const workflowDiv = document.getElementById("workflowSteps");
const copyNotesBtn = document.getElementById("copyNotes");

let selectedReason = null;
let selectedSuboption = null;
let suboptionState = {};

// Show/hide extra info based on account found radios
function toggleExtraInfo() {
  if (accountNoRadio.checked) {
    extraInfoDiv.classList.remove("hidden");
  } else {
    extraInfoDiv.classList.add("hidden");
  }
}

// Render reason buttons
function renderReasonButtons() {
  reasonButtonsDiv.innerHTML = "";
  Object.keys(reasonsData).forEach((reason) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = reason;
    btn.classList.add("reason-btn");
    btn.dataset.reason = reason;
    reasonButtonsDiv.appendChild(btn);
  });
}

// Render suboption buttons for selected reason
function renderSuboptions(reason) {
  subOptionsDiv.innerHTML = "";
  selectedSuboption = null;
  if (!reason) return;
  const suboptions = reasonsData[reason].suboptions;
  Object.keys(suboptions).forEach((suboptName) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = suboptName;
    btn.classList.add("suboption-btn");
    btn.dataset.suboption = suboptName;
    subOptionsDiv.appendChild(btn);
  });
}

// Render workflow steps for selected reason and suboption
function renderWorkflowSteps(reason, suboption) {
  workflowDiv.innerHTML = "";
  suboptionState = {};
  if (!reason || !suboption) return;

  const steps = reasonsData[reason].suboptions[suboption].steps;
  if (!steps || steps.length === 0) return;

  const heading = document.createElement("h3");
  heading.textContent = `Steps for "${suboption}"`;
  workflowDiv.appendChild(heading);

  steps.forEach((step) => {
    const stepDiv = document.createElement("div");
    stepDiv.className = "workflow-step";

    if (step.type === "checkbox") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = step.id;

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) addNoteLine(step.note);
        else removeNoteLine(step.note);
        suboptionState[step.id] = checkbox.checked;
        updateConditionalInfo();
        updateNotes();
      });

      stepDiv.appendChild(checkbox);

      const label = document.createElement("label");
      label.htmlFor = step.id;
      label.textContent = step.label;
      stepDiv.appendChild(label);

      workflowDiv.appendChild(stepDiv);

      suboptionState[step.id] = false;
    } else if (step.type === "radio") {
      const groupDiv = document.createElement("div");
      groupDiv.className = "radio-group";

      const groupLabel = document.createElement("div");
      groupLabel.textContent = step.label;
      groupLabel.className = "radio-group-label";
      groupDiv.appendChild(groupLabel);

      step.options.forEach((opt) => {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = step.id;
        radio.value = opt.value;
        radio.id = `${step.id}_${opt.value}`;

        radio.addEventListener("change", () => {
          if (radio.checked) {
            // Remove all notes from this step's options first
            step.options.forEach((o) => removeNoteLine(o.note));
            addNoteLine(opt.note);
            suboptionState[step.id] = opt.value;
            updateConditionalInfo();
            updateNotes();
          }
        });

        const radioLabel = document.createElement("label");
        radioLabel.htmlFor = radio.id;
        radioLabel.textContent = opt.label;
        radioLabel.className = "radio-label";

        groupDiv.appendChild(radio);
        groupDiv.appendChild(radioLabel);
      });

      stepDiv.appendChild(groupDiv);
      workflowDiv.appendChild(stepDiv);

      suboptionState[step.id] = null;
    } else if (step.type === "info") {
      const infoP = document.createElement("p");
      infoP.id = step.id;
      infoP.textContent = step.label;
      infoP.className = "info-text";
      infoP.style.display = "none";
      workflowDiv.appendChild(infoP);
    }
  });
}

// Show/hide info steps based on radio selections
function updateConditionalInfo() {
  if (!selectedReason || !selectedSuboption) return;
  const steps = reasonsData[selectedReason].suboptions[selectedSuboption].steps;

  steps.forEach((step) => {
    if (step.type === "info" && step.dependsOn) {
      const { stepId, value } = step.dependsOn;
      const infoElem = document.getElementById(step.id);
      if (suboptionState[stepId] === value) {
        infoElem.style.display = "block";
      } else {
        infoElem.style.display = "none";
      }
    }
  });
}

// Add note line if not already in textarea
function addNoteLine(line) {
  if (!line) return;
  const lines = notesArea.value.split("\n").map((l) => l.trim());
  if (!lines.includes(line)) {
    if (notesArea.value.trim() !== "") notesArea.value += "\n" + line;
    else notesArea.value = line;
  }
}

// Remove note line if present
function removeNoteLine(line) {
  if (!line) return;
  const lines = notesArea.value.split("\n").map((l) => l.trim());
  const filtered = lines.filter((l) => l !== line);
  notesArea.value = filtered.join("\n");
}

// Update the notes area with base info plus reason/suboption notes
function updateNotes() {
  let notesLines = [];

  const customerName = customerNameInput.value.trim();
  const idChecked = idCustomerCheckbox.checked;

  if (customerName) notesLines.push(`Customer Name: ${customerName}`);
  if (idChecked) notesLines.push("ID Confirmed");
  if (selectedReason && selectedSuboption) {
    const reasonNote =
      reasonsData[selectedReason]?.suboptions[selectedSuboption]?.notes;
    if (reasonNote) notesLines.push(reasonNote);
  }

  // Add checked workflow step notes
  Object.entries(suboptionState).forEach(([key, value]) => {
    if (typeof value === "boolean" && value === true) {
      const steps =
        reasonsData[selectedReason]?.suboptions[selectedSuboption]?.steps || [];
      const stepInfo = steps.find((s) => s.id === key);
      if (stepInfo && stepInfo.note) notesLines.push(stepInfo.note);
    } else if (typeof value === "string") {
      // handled by radio change event's addNoteLine
    }
  });

  notesArea.value = notesLines.join("\n");
}

// Clear workflow container and reset state
function clearWorkflow() {
  workflowDiv.innerHTML = "";
  suboptionState = {};
}

// Event bindings
function bindEvents() {
  accountYesRadio.addEventListener("change", () => {
    toggleExtraInfo();
    updateNotes();
  });
  accountNoRadio.addEventListener("change", () => {
    toggleExtraInfo();
    updateNotes();
  });

  customerNameInput.addEventListener("input", updateNotes);
  idCustomerCheckbox.addEventListener("change", updateNotes);

  accountTypeRadios.forEach((radio) =>
    radio.addEventListener("change", updateNotes)
  );

  reasonButtonsDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("reason-btn")) {
      const reason = e.target.dataset.reason;
      if (reason !== selectedReason) {
        selectedReason = reason;
        selectedSuboption = null;
        clearWorkflow();

        // enable all buttons and highlight selected
        document.querySelectorAll(".reason-btn").forEach((btn) => {
          btn.disabled = false;
          btn.style.opacity = "1";
        });
        e.target.disabled = true;
        e.target.style.opacity = "0.6";

        renderSuboptions(reason);
      }
    }
  });

  subOptionsDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("suboption-btn")) {
      const subopt = e.target.dataset.suboption;
      if (subopt !== selectedSuboption) {
        selectedSuboption = subopt;
        clearWorkflow();

        // enable all buttons and highlight selected
        document.querySelectorAll(".suboption-btn").forEach((btn) => {
          btn.disabled = false;
          btn.style.opacity = "1";
        });
        e.target.disabled = true;
        e.target.style.opacity = "0.6";

        renderWorkflowSteps(selectedReason, selectedSuboption);
        updateNotes();
      }
    }
  });

  copyNotesBtn.addEventListener("click", () => {
    notesArea.select();
    document.execCommand("copy");
    alert("Notes copied to clipboard.");
  });
}

// Initialize app
function init() {
  renderReasonButtons();
  toggleExtraInfo();
  clearWorkflow();
  bindEvents();
  updateNotes();
}

init();
