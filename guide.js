const reasonsData = {
  Accounts: {
    subCategories: {
      "Billing Issues/Enquiry": {
        options: {
          "Payment Plan": {
            notes: "-----\nPayment Plan",
            steps: [
              {
                id: "eligibilityCheck",
                type: "radio-group",
                label: "Payment Plan Eligibility Check",
                questions: [
                  {
                    id: "q1",
                    question: "Is Payment Plan Rqst after Billing Cycle?",
                    options: ["Yes", "No"],
                  },
                  {
                    id: "q2",
                    question: "Is there an existing Payment Plan in place?",
                    options: ["Yes", "No"],
                  },
                ],
                conditions: [
                  {
                    if: { q1: "Yes", q2: "Yes" },
                    show: [
                      {
                        id: "warnApproval",
                        type: "warning",
                        text: "AE/TL approval required if PP rqst is after next billing cycle or PP already exists",
                      },
                      {
                        id: "approvalInput",
                        type: "input",
                        label: "Enter AE/TL Approver Name",
                        placeholder: "AE name | TL name",
                        noteTemplate: "{input} approved.",
                      },
                    ],
                  },
                ],
              },
              {
                id: "action1",
                type: "action",
                text: "Create PP via Function > Payment Plan",
                note: "PP created in system.",
              },
              {
                id: "vp1",
                type: "checkbox",
                label: "User acknowledged Voice Print",
                note: "eu ack vp",
              },
              {
                id: "ppSummary",
                type: "input-confirm",
                label: "Payment Plan Summary",
                placeholder: "Paste/Input PP details here",
                buttonLabel: "Add",
                noteTemplate: "{input}",
              },
            ],
          },
          "Immediate Payment": {
            notes: "-----\nImmediate Plan",
            steps: [],
          },
          "Once Off Payment": {},
        },
      },
      "Transfer of Ownership (ToO)": {},
      "Edit/Update Details": {},
      "Service Closure": {},
      "Add Secondary Contact": {},
      "Complaint": {},
      "Plan Speed Change": {},
    },
  },
  Technical: {
    subCategories: {
      NBN: {
        options: {
          FTTP: {},
          "FTTN/B": {},
          FTTC: {},
          HFC: {},
          "F/W": {},
        },
      },
      Opticomm: {},
      VOIP: {},
      Mobile: {},
      Fetch: {},
      Email: {},
      "Router/WiFi Config": {},
    },
  },
  Provisioning: {
    subCategories: {
      "Coming soon to a": {},
      "Cinema near YOU!": {},
    },
  },
};

// Left-panel
const notes = document.querySelector("#notes-area"); // right side notes area
const radioGroupCMS = document.querySelector('sl-radio-group[name="CMSfound"]'); // caller CMS selector => yes/no
const CMSnote = document.getElementById("CMSmissing"); // caller CMS info for NO selector
const radioGroupCallType = document.querySelector(
  'sl-radio-group[name="callType"]'
); // caller Type => in/out
const callPrompt = document.getElementById("callPrompt"); // caller Type prompt
const customerInput = document.querySelector("#customerName-input"); // input field for customer name
const idCheckbox = document.querySelector("#ID-checkbox"); // ID checkbox
const tfaCheckbox = document.querySelector("#TFA-checkbox"); // 2FA checkbox
const tfaCheckboxText = document.querySelector("#TFA-checkbox"); // text area next to 2FA checkbox
const callerType = document.querySelector("#caller-class"); // caller class => Primary/Secondary

// Right-panel
const copyNotesBtn = document.querySelector("#copy-notes-btn"); // copy to notes btn
const copyDialog = document.querySelector("#clipboard-dialog");
const refreshBtn = document.querySelector("#refresh-btn");

const defaultNotes = `Customer: \nID: N\n2FA: N\nCall: Inbound\n-----\nNotes\n`; // default notes

resetNotes();

function resetNotes() {
  notes.value = defaultNotes;
}

// shows CMS id steps if no Caller CMS found.
radioGroupCMS.addEventListener("sl-change", (event) => {
  const selectedValue = event.target.value;
  if (selectedValue === "2") {
    CMSnote.classList.remove("hidden");

    setTimeout(() => {
      CMSnote.classList.add("hidden");
    }, 5000); //5secs
  } else {
    CMSnote.classList.add("hidden");
  }
});

// shows outbound MUST do steps.
radioGroupCallType.addEventListener("sl-change", (event) => {
  const selectedValue = event.target.value;
  if (selectedValue === "2") {
    callPrompt.classList.remove("hidden");
    tfaCheckboxText.innerHTML = "DO IT! DO IT!";

    setTimeout(() => {
      callPrompt.classList.add("hidden");
    }, 10000); // 7secs
  } else {
    callPrompt.classList.add("hidden");
    tfaCheckboxText.innerHTML = "";
  }
});

function getDynamicHeader() {
  const customerName = customerInput.value.trim();
  const idConfirmed = idCheckbox.checked ? "Y" : "N";
  const tfaConfirmed = tfaCheckbox.checked ? "Y" : "N";

  let callTypeValue = "";
  const selectedValue = radioGroupCallType.value;

  if (selectedValue === "1") {
    callTypeValue = "In";
  } else if (selectedValue === "2") {
    callTypeValue = "Out (adv eu of recording)";
  }

  return `Customer: ${customerName}\nID: ${idConfirmed}\n2FA: ${tfaConfirmed}\nCall: ${callTypeValue}\n------\nNotes\n`;
}

function updateNotesHeaderOnly() {
  const current = notes.value.split("\n");
  const newHeader = getDynamicHeader().split("\n");
  let userNotes = "";

  if (current.length > 6) {
    userNotes = current.slice(6).join("\n").trim();
  }
  notes.value = [...newHeader, userNotes].join("\n");
}

customerInput.addEventListener("input", updateNotesHeaderOnly);
idCheckbox.addEventListener("sl-change", updateNotesHeaderOnly);
radioGroupCallType.addEventListener("sl-change", updateNotesHeaderOnly);
tfaCheckbox.addEventListener("sl-change", () => {
  updateNotesHeaderOnly();

  if (tfaCheckbox.checked) {
    tfaCheckboxText.innerHTML = "";
    callPrompt.classList.add("hidden");
    //tfaCheckbox.disabled = true;
  }
});

copyNotesBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(notes.value);
    copyDialog.show();
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
});

refreshBtn.addEventListener("click", () => {
  location.reload();
});

const reasonsTabs = document.getElementById("reasons-tabs");
const stepsContainer = document.getElementById("steps-container");

function createButton(label, category, callback) {
  const button = document.createElement("sl-button");
  button.innerText = label;
  button.variant = "default";
  button.classList.add("reason-btn");

  button.addEventListener("click", () => {
    if (callback) callback(category, label);
  });

  return button;
}

function renderTabs(data) {
  reasonsTabs.innerHTML = ""; // Clear any existing tabs first

  Object.entries(data).forEach(([tabName, tabContent], index) => {
    // Create the tab button
    const tab = document.createElement("sl-tab");
    tab.slot = "nav";
    tab.panel = `panel-${index}`;
    tab.innerText = tabName;

    // Create the tab panel container
    const panel = document.createElement("sl-tab-panel");
    panel.name = `panel-${index}`;

    // Create container for buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("two-column-grid");

    // Create buttons for immediate suboptions only
    if (tabContent.subCategories) {
      Object.keys(tabContent.subCategories).forEach((label) => {
        const button = document.createElement("sl-button");
        button.innerText = label;
        button.variant = "default";
        // Just log on click for now
        button.addEventListener("click", () => {
          console.log(`Clicked button: ${label} in tab: ${tabName}`);
        });

        buttonContainer.appendChild(button);
      });
    }

    panel.appendChild(buttonContainer);
    reasonsTabs.appendChild(tab);
    reasonsTabs.appendChild(panel);
  });
}

renderTabs(reasonsData);



// function renderTabs(data, onOptionSelect) {
//   Object.entries(data).forEach(([tabName, tabContent], index) => {
//     const tab = document.createElement("sl-tab");
//     tab.slot = "nav";
//     tab.panel = `panel-${index}`;
//     tab.innerText = tabName;

//     const panel = document.createElement("sl-tab-panel");
//     panel.name = `panel-${index}`;

//     const buttonContainer = document.createElement("div");
//     buttonContainer.classList.add("vertical-stack");

//     if (tabContent.suboptions) {
//       Object.entries(tabContent.suboptions).forEach(([label, suboption]) => {
//         const button = createButton(label, tabName, (cat, lbl) => {
//           if (suboption.suboptions) {
//             renderSuboptions(suboption.suboptions, lbl);
//           } else {
//             onOptionSelect(cat, lbl);
//           }
//         });
//         buttonContainer.appendChild(button);
//       });
//     }

//     panel.appendChild(buttonContainer);
//     reasonsTabs.appendChild(tab);
//     reasonsTabs.appendChild(panel);
//   });
// }

// function renderSuboptions(suboptions, parentLabel) {
//   let subBtnContainer = document.getElementById("suboption-buttons");
//   let stepsContent = document.getElementById("steps-content");

//   if (!subBtnContainer || !stepsContent) {
//     stepsContainer.innerHTML = `
//       <div id="suboption-buttons" class="horizontal-button-bar"></div>
//       <div id="steps-content"></div>
//     `;
//     subBtnContainer = document.getElementById("suboption-buttons");
//     stepsContent = document.getElementById("steps-content");
//   }

//   subBtnContainer.innerHTML = ""; // Clear previous buttons
//   stepsContent.innerHTML = ""; // Clear previous steps (optional)

//   Object.entries(suboptions).forEach(([subLabel, subData]) => {
//     const subBtn = document.createElement("sl-button");
//     subBtn.innerText = subLabel;
//     subBtn.variant = "primary";
//     subBtn.addEventListener("click", () => {
//       renderSteps(subLabel, subData);
//     });
//     subBtnContainer.appendChild(subBtn);
//   });
// }

// function renderSteps(label, data) {
//   const stepsContent = document.getElementById("steps-content");
//   // 🛡️ Prevent double render of the same section
//   stepsContent.dataset.renderedFor = label;
//   stepsContent.innerHTML = "";
  
//   const header = document.createElement("h3");
//   header.innerText = label;
//   stepsContent.appendChild(header);

//   if (data.notes) {
//     const existing = notes.value.trim();
//     const noteToAdd = data.notes.trim();
//     notes.value =
//       existing + (existing.endsWith("\n") ? "" : "\n") + noteToAdd + "\n";
//   }

//   (data.steps || []).forEach((step) => {
//     const stepEl = document.createElement("div");
//     stepEl.classList.add("step");

//     switch (step.type) {
//       case "action":
//       case "info":
//       case "warning": {
//         const alert = document.createElement("sl-alert");
//         alert.open = true;
//         alert.variant = step.type === "action" ? "primary" : "warning";
//         alert.innerText = step.text || "Instruction";
//         stepEl.appendChild(alert);

//         // Add note if present
//         if (step.note) {
//           notes.value +=
//             (notes.value.endsWith("\n") ? "" : "\n") + step.note + "\n";
//         }
//         break;
//       }

//       case "input": {
//         const textarea = document.createElement("sl-textarea");
//         textarea.placeholder = step.placeholder || "Enter details...";
//         textarea.rows = 4;

//         const addBtn = document.createElement("sl-button");
//         addBtn.innerText = "Add";
//         addBtn.variant = "primary";

//         addBtn.addEventListener("click", () => {
//           const inputVal = textarea.value.trim();
//           if (inputVal) {
//             const finalNote = step.noteTemplate
//               ? step.noteTemplate.replace("{input}", inputVal)
//               : inputVal;

//             notes.value +=
//               (notes.value.endsWith("\n") ? "" : "\n") + finalNote + "\n";
//           }
//         });

//         stepEl.appendChild(textarea);
//         stepEl.appendChild(addBtn);
//         break;
//       }

//       case "input-confirm": {
//         const input = document.createElement("sl-input");
//         input.placeholder = step.placeholder || "Type something...";
//         input.style.marginRight = "0.5rem";

//         const addBtn = document.createElement("sl-button");
//         addBtn.innerText = step.buttonLabel || "Add";
//         addBtn.variant = "success";

//         addBtn.addEventListener("click", () => {
//           const inputVal = input.value.trim();
//           if (inputVal) {
//             const finalNote = step.noteTemplate
//               ? step.noteTemplate.replace("{input}", inputVal)
//               : inputVal;

//             notes.value +=
//               (notes.value.endsWith("\n") ? "" : "\n") + finalNote + "\n";
//           }
//         });

//         stepEl.appendChild(input);
//         stepEl.appendChild(addBtn);
//         break;
//       }

//       case "checkbox": {
//         const checkbox = document.createElement("sl-checkbox");
//         checkbox.innerText = step.label;

//         let conditionalInput;
//         if (step.conditionalInput) {
//           conditionalInput = document.createElement("sl-input");
//           conditionalInput.placeholder = step.conditionalInput.placeholder;
//           conditionalInput.classList.add("hidden");
//           conditionalInput.style.marginLeft = "1rem";
//         }

//         checkbox.addEventListener("sl-change", (e) => {
//           const checked = e.target.checked;
//           const noteText = step.note;

//           if (checked && noteText && !notes.value.includes(noteText)) {
//             notes.value +=
//               (notes.value.endsWith("\n") ? "" : "\n") + noteText + "\n";
//           } else if (!checked && noteText) {
//             notes.value =
//               notes.value
//                 .split("\n")
//                 .filter((line) => line !== noteText)
//                 .join("\n")
//                 .trim() + "\n";
//           }

//           if (conditionalInput) {
//             conditionalInput.classList.toggle("hidden", !checked);

//             conditionalInput.addEventListener("input", () => {
//               const inputVal = conditionalInput.value.trim();
//               const template = step.conditionalInput.noteTemplate;
//               const finalNote = template.replace("{input}", inputVal);

//               // Replace any existing approval lines
//               notes.value = notes.value
//                 .split("\n")
//                 .filter((line) => !line.includes("approved."))
//                 .join("\n")
//                 .trim();

//               if (inputVal) {
//                 notes.value += "\n" + finalNote + "\n";
//               }
//             });
//           }
//         });

//         stepEl.appendChild(checkbox);
//         if (conditionalInput) stepEl.appendChild(conditionalInput);
//         break;
//       }

//       case "radio-group": {
//         const groupWrapper = document.createElement("div");

//         const groupLabel = document.createElement("label");
//         groupLabel.innerText = step.label;
//         groupWrapper.appendChild(groupLabel);

//         const qAnswers = {};
//         step.questions.forEach((q) => {
//           const questionLabel = document.createElement("label");
//           questionLabel.innerText = q.question;
//           questionLabel.style.display = "block";
//           if (groupWrapper.querySelector(`sl-radio-group[name="${q.id}"]`))
//             return;
//           groupWrapper.appendChild(questionLabel);

//           const radioGroup = document.createElement("sl-radio-group");
//           radioGroup.setAttribute("label", q.question);
//           radioGroup.setAttribute("name", q.id); // <-- ensures isolation

//           q.options.forEach((opt) => {
//             const radio = document.createElement("sl-radio");
//             radio.value = opt;
//             radio.innerText = opt;
//             radioGroup.appendChild(radio);
//           });

//           groupWrapper.appendChild(radioGroup);

//           radioGroup.addEventListener("sl-change", (e) => {
//             qAnswers[q.id] = e.target.value;
//             evaluateConditions();
//           });
//         });

//         const dynamicContainer = document.createElement("div");
//         groupWrapper.appendChild(dynamicContainer);

//         function evaluateConditions() {
//           dynamicContainer.innerHTML = "";
//           step.conditions?.forEach((cond) => {
//             const allMatch = Object.entries(cond.if).every(
//               ([qid, val]) => qAnswers[qid] === val
//             );

//             if (allMatch) {
//               cond.show.forEach((showStep) => {
//                 const container = document.createElement("div");

//                 if (showStep.type === "warning") {
//                   const alert = document.createElement("sl-alert");
//                   alert.open = true;
//                   alert.variant = "warning";
//                   alert.innerText = showStep.text;
//                   container.appendChild(alert);
//                 }

//                 if (showStep.type === "input") {
//                   const input = document.createElement("sl-input");
//                   input.placeholder = showStep.placeholder || "";
//                   input.addEventListener("input", () => {
//                     const inputVal = input.value.trim();
//                     const finalNote = showStep.noteTemplate.replace(
//                       "{input}",
//                       inputVal
//                     );
//                     notes.value = notes.value
//                       .split("\n")
//                       .filter((line) => !line.includes("approved."))
//                       .join("\n")
//                       .trim();

//                     if (inputVal) {
//                       notes.value += "\n" + finalNote + "\n";
//                     }
//                   });
//                   container.appendChild(input);
//                 }

//                 dynamicContainer.appendChild(container);
//               });
//             }
//           });
//         }

//         stepEl.appendChild(groupWrapper);
//         break;
//       }

//       default:
//         console.warn("Unsupported step type:", step.type);
//     }

//     stepsContent.appendChild(stepEl);
//   });
// }

//renderTabs(reasonsData, renderSteps);
