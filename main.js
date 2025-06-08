const reasonsData = {
  Accounts: {
    suboptions: {
      "Edit Contact Details": {
        notes: "eu rqst to edit contact details.",
        steps: [
          {
            id: "step1",
            type: "checkbox",
            label: "2FA",
            note: "2FA.",
          },
          {
            id: "step2",
            type: "checkbox",
            label:
              "Edit user details via clicking on their name or Edit in the top right corner",
            note: "eu details updated",
          },
          {
            id: "infoAlways1",
            type: "info",
            label: "ONLY primary users can edit account details",
          },
        ],
      },
      "Edit Payment Details": {
        notes: "eu rqst to edit payment details.",
        steps: [
          {
            id: "step1",
            type: "checkbox",
            label: "2FA",
            note: "2FA.",
          },
          {
            id: "infoAlways1",
            type: "info",
            label: "Go to Function > Update Payment Details"
          },
          {
            id: "step2",
            type: "radio",
            label: "Payment method",
            options: [
              {
                label: "Credit Card",
                value: "cc"
                
              },
              {
                label: "Debit Account",
                value: "da"
              },
            ],
          },
          {
            id: "info1",
            type: "info",
            label: "SMS message sent to eu with link they access to update CC details",
            dependsOn: { stepId: "step2", value: "cc" },
          },
          {
            id: "info2",
            type: "info",
            label: "Acquire Debit Account Name/BSB/Number from eu",
            dependsOn: { stepId: "step2", value: "da" },
          },
          {
            id: "step3",
            type: "checkbox",
            label: "Complete Payment Detail Updating",
            note: "eu payment details updated",
          }
        ],
      },
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
const accountTypeRadios = document.querySelectorAll(
  'input[name="accountType"]'
);
const reasonButtonsDiv = document.getElementById("reasonButtons");
const subOptionsDiv = document.getElementById("subOptions");
const notesArea = document.getElementById("notesArea");
const workflowDiv = document.getElementById("workflowSteps");
const copyNotesBtn = document.getElementById("copyNotes");
const customerInput = document.getElementById("customerNameInput");
const idCheckbox = document.getElementById("idConfirmedCheckbox");
const callTypeRadios = document.querySelectorAll('input[name="callType"]');
const callPrompt = document.getElementById("callPrompt");

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

// Outbound Show disclaimer
document.addEventListener("DOMContentLoaded", () => {
  const callTypeRadios = document.querySelectorAll('input[name="callType"]');
  const callPrompt = document.getElementById("callPrompt");

  callTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "outbound") {
        callPrompt.classList.remove("hidden");
      } else {
        callPrompt.classList.add("hidden");
      }
    });
  });
});

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

function removeNoteLine(note) {
  if (!note) return; // exit early if note is undefined, null, empty, or falsey

  const lines = notesArea.value.split("\n");
  const trimmedNote = note.trim();

  const newLines = lines.filter(line => line.trim() !== trimmedNote);

  if (newLines.length !== lines.length) {
    notesArea.value = newLines.join("\n");
  }
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

      // Show immediately if no dependsOn condition
      infoP.style.display = step.dependsOn ? "none" : "block";

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

// right side notes header

function getDynamicHeader() {
  const customerName = customerInput.value.trim();
  const idConfirmed = idCheckbox.checked ? "confirmed" : "";

  let callTypeValue = "";
  callTypeRadios.forEach((radio) => {
    if (radio.checked) {
      if (radio.value === "inbound") callTypeValue = "In";
      else if (radio.value === "outbound") callTypeValue = "Out (disclaimer)";
    }
  });

  return `Customer: ${customerName}\nID: ${idConfirmed}\nCall: ${callTypeValue}\n\nNotes\n`;
}

function updateNotesHeaderOnly() {
  const current = notesArea.value.split("\n");

  // Get the new header
  const newHeader = getDynamicHeader().split("\n");

  // Preserve everything after the 5th line (index 5 onward)
  const userNotes = current.slice(5).join("\n");

  // Rebuild with header and preserved notes
  notesArea.value = [...newHeader, userNotes].join("\n");
}

// Listeners
customerInput.addEventListener("input", updateNotesHeaderOnly);
idCheckbox.addEventListener("change", updateNotesHeaderOnly);


function updateNotes() {
  const lines = notesArea.value.split("\n");

  // Step 1: Get top 5 header lines
  const headerLines = lines.slice(0, 5);

  // Step 2: Get existing body (everything after header), clean blanks
  let bodyLines = lines.slice(5);

  // Clean leading blank lines
  while (bodyLines.length > 0 && bodyLines[0].trim() === "") {
    bodyLines.shift();
  }

  // Clean trailing blank lines
  while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === "") {
    bodyLines.pop();
  }

  // Step 3: Generate workflow notes (but only if not already in bodyLines)
  const existingBodySet = new Set(bodyLines.map(line => line.trim()));
  let newNotes = [];

  if (selectedReason && selectedSuboption) {
    const reasonNote = reasonsData[selectedReason]?.suboptions[selectedSuboption]?.notes;
    if (reasonNote && !existingBodySet.has(reasonNote.trim())) {
      newNotes.push(reasonNote);
    }
  }

  const steps = reasonsData[selectedReason]?.suboptions[selectedSuboption]?.steps || [];
  Object.entries(suboptionState).forEach(([key, value]) => {
    const step = steps.find(s => s.id === key);
    if (!step) return;

    if (step.type === "checkbox" && value === true && step.note && !existingBodySet.has(step.note.trim())) {
      newNotes.push(step.note);
    }

    if (step.type === "radio" && typeof value === "string") {
      const selectedOption = step.options.find(opt => opt.value === value);
      if (selectedOption?.note && !existingBodySet.has(selectedOption.note.trim())) {
        newNotes.push(selectedOption.note);
      }
    }
  });

  // Step 4: Assemble the final result
  const result = [
    ...headerLines,
    ...bodyLines,
    ...newNotes
  ];

  notesArea.value = result.join("\n").trimEnd();
}


function addNoteLine(note) {
  if (!note || !note.trim()) return;

  const currentText = notesArea.value.trim();
  const newNote = note.trim();

  // If there's existing content, append with a newline
  notesArea.value = currentText ? `${currentText}\n${newNote}` : newNote;
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

  callTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateNotesHeaderOnly();
      if (radio.value === "outbound") {
        callPrompt.classList.remove("hidden");
      } else {
        callPrompt.classList.add("hidden");
      }
    });
  });

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
