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
                  {
                    id: "q3",
                    question: "Is there a restriction in place?",
                    options: ["Yes", "No"],
                  },
                ],
                conditions: [
                  {
                    if: { q1: "Yes", q3: "Yes" },
                    show: [
                      {
                        id: "warnApproval",
                        type: "warning",
                        text: "** [L2] AE/TL approval required **",
                      },
                      {
                        id: "approvalInput",
                        type: "input",
                        label: "Enter AE/TL Approver >>",
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
                noteTemplate: "PP details:\n{input}\n",
              },
              {
                id: "header1",
                type: "header",
                class: "subheader",
                restriction: "checkbox-restriction",
                header: "Actioning Restriction?",
              },
              {
                id: "restriction1",
                type: "checkbox-conditional",
                label: "Restriction removed",
                note: "restriction removed - adv eu to pc cpe",
              },
              {
                id: "restriction2",
                type: "checkbox-conditional",
                label: "Restriction NOT removed due to unpaid debt",
                note: "adv eu restriction remains until further payment is made - eu to call back once payment made",
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
      Complaint: {},
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

// Lower panel
const optionsContainer = document.getElementById("option-buttons");

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
  reasonsTabs.innerHTML = "";

  Object.entries(data).forEach(([tabName, tabContent], index) => {
    const tab = document.createElement("sl-tab");
    tab.slot = "nav";
    tab.panel = `panel-${index}`;
    tab.innerText = tabName;

    const panel = document.createElement("sl-tab-panel");
    panel.name = `panel-${index}`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("two-column-grid");

    let activeButton = null;

    if (tabContent.subCategories) {
      Object.entries(tabContent.subCategories).forEach(
        ([subCatName, subCatData]) => {
          const button = document.createElement("sl-button");
          button.innerText = subCatName;
          button.size = "medium";
          button.variant = "default"; // inactive state

          button.addEventListener("click", () => {
            // Reset previous
            if (activeButton && activeButton !== button) {
              activeButton.variant = "default";
            }

            // Set current
            button.variant = "primary"; // visually stands out
            activeButton = button;

            renderOptions(subCatData.options || {});
          });

          buttonContainer.appendChild(button);
        }
      );
    }

    panel.appendChild(buttonContainer);
    reasonsTabs.appendChild(tab);
    reasonsTabs.appendChild(panel);
  });
}

function renderOptions(optionsObj) {
  optionsContainer.innerHTML = ""; // Clear previous options

  if (Object.keys(optionsObj).length === 0) {
    const noneText = document.createElement("p");
    noneText.innerText = "No options available.";
    optionsContainer.appendChild(noneText);
    return;
  }

  const flexContainer = document.createElement("div");
  flexContainer.classList.add("option-buttons-row");

  let activeOptionBtn = null;

  Object.entries(optionsObj).forEach(([optionKey, optionData]) => {
    const btn = document.createElement("sl-button");
    btn.innerText = optionKey;
    btn.variant = "default";
    btn.size = "small";
    btn.className = "options-btn";

    btn.addEventListener("click", () => {
      // Reset previous active button
      if (activeOptionBtn && activeOptionBtn !== btn) {
        activeOptionBtn.variant = "default";
      }

      // Set current active button
      btn.variant = "primary";
      activeOptionBtn = btn;

      console.log(`Selected option: ${optionKey}`);
      // Future: Load steps or details into steps-content
      renderSteps(optionKey, optionData);
    });

    flexContainer.appendChild(btn);
  });

  optionsContainer.appendChild(flexContainer);
}

renderTabs(reasonsData);

const tabGroup = document.querySelector("#reasons-tabs");

tabGroup.addEventListener("sl-tab-show", (event) => {
  // Clear any previously selected options
  const optionsContainer = document.getElementById("option-buttons");
  optionsContainer.innerHTML = "";

  // Also reset all subcategory button variants inside the new panel
  const newPanelName = event.detail.name;
  const newPanel = tabGroup.querySelector(
    `sl-tab-panel[name="${newPanelName}"]`
  );

  if (newPanel) {
    const buttons = newPanel.querySelectorAll("sl-button");
    buttons.forEach((btn) => {
      btn.variant = "default";
    });
  }
});

function renderSteps(label, data) {
  const stepsContent = document.getElementById("steps-content");
  stepsContent.innerHTML = "";

  if (stepsContent.dataset.renderedFor === label) return;

  const header = document.createElement("h3");
  header.innerText = label;
  stepsContent.appendChild(header);

  if (data.notes) {
    const existing = notes.value.trim();
    const noteToAdd = data.notes.trim();
    notes.value =
      existing + (existing.endsWith("\n") ? "" : "\n") + noteToAdd + "\n";
  }

  (data.steps || []).forEach((step) => {
    const stepEl = document.createElement("div");
    stepEl.classList.add("step");

    //const qAnswers = {}; // stores selected answers

    switch (step.type) {
      case "header": {
        const header = document.createElement("h2");
        header.innerHTML = step.header;
        header.className = step.class;
        if (step.restriction) {
          header.classList.add(step.restriction);
          header.classList.add("hidden");
        }

        stepEl.appendChild(document.createElement("hr"));
        stepEl.appendChild(header);
        break;
      }
      case "info":
      case "action": {
        const content = document.createElement("sl-details");
        content.disabled = step.type === "action" ? true : false;
        content.className = step.type;
        content.summary = step.text || "Update Text info for step";
        stepEl.appendChild(content);
        break;
      }

      case "warning": {
        const alert = document.createElement("sl-alert");
        alert.open = true;
        alert.variant = step.type === "info" ? "primary" : "warning";
        alert.innerText = step.text || "Instruction";
        stepEl.appendChild(alert);

        // Add note if present
        if (step.note) {
          notes.value +=
            (notes.value.endsWith("\n") ? "" : "\n") + step.note + "\n";
        }
        break;
      }

      case "input": {
        const textarea = document.createElement("sl-textarea");
        textarea.placeholder = step.placeholder || "Enter details...";
        textarea.rows = 4;

        const addBtn = document.createElement("sl-button");
        addBtn.innerText = "Add";
        addBtn.variant = "primary";

        addBtn.addEventListener("click", () => {
          const inputVal = textarea.value.trim();
          if (inputVal) {
            const finalNote = step.noteTemplate
              ? step.noteTemplate.replace("{input}", inputVal)
              : inputVal;

            notes.value +=
              (notes.value.endsWith("\n") ? "" : "\n") + finalNote + "\n";
          }
        });

        stepEl.appendChild(textarea);
        stepEl.appendChild(addBtn);
        break;
      }

      case "input-confirm": {
        // Create wrapper for vertical layout
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.gap = "0.5rem"; // spacing between textarea and button

        // Create multiline textarea
        const textarea = document.createElement("sl-textarea");
        textarea.placeholder = step.placeholder || "Type something...";
        textarea.rows = 4;

        // Create Add button
        const addBtn = document.createElement("sl-button");
        addBtn.innerText = "Add PP Details";
        addBtn.style.width = "fit-content";
        addBtn.style.margin = "0 auto";
        addBtn.variant = "success";
        addBtn.size = "small";

        // Add click handler
        addBtn.addEventListener("click", () => {
          const inputVal = textarea.value.trim();
          if (inputVal) {
            const finalNote = step.noteTemplate
              ? step.noteTemplate.replace("{input}", inputVal)
              : inputVal;

            notes.value +=
              (notes.value.endsWith("\n") ? "" : "\n") + finalNote + "\n";
          }
        });

        // Append elements in vertical order
        wrapper.appendChild(textarea);
        wrapper.appendChild(addBtn);
        stepEl.appendChild(wrapper);
        break;
      }

      case "checkbox-conditional":
      case "checkbox": {
        // const checkbox = document.createElement("sl-checkbox");
        // checkbox.innerText = step.label;

        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "space-between";
        wrapper.style.alignItems = "center";
        wrapper.style.paddingRight = "5rem";
        if (step.type === "checkbox-conditional") {
          wrapper.classList.add("checkbox-restriction");
          wrapper.classList.add("hidden");
        }

        const label = document.createElement("label");
        label.innerText = step.label;
        label.style.flexGrow = "1"; // <-- this makes label take remaining space
        label.style.marginRight = "1rem"; // spacing between label and checkbox
        label.style.userSelect = "none"; // optional: prevent label text selection on checkbox click
        const checkbox = document.createElement("sl-checkbox");

        let conditionalInput;
        if (step.conditionalInput) {
          conditionalInput = document.createElement("sl-input");
          conditionalInput.placeholder = step.conditionalInput.placeholder;
          conditionalInput.classList.add("hidden");
          conditionalInput.style.marginLeft = "1rem";
        }

        checkbox.addEventListener("sl-change", (e) => {
          const checked = e.target.checked;
          const noteText = step.note;

          if (checked && noteText && !notes.value.includes(noteText)) {
            notes.value +=
              (notes.value.endsWith("\n") ? "" : "\n") + noteText + "\n";
          } else if (!checked && noteText) {
            notes.value =
              notes.value
                .split("\n")
                .filter((line) => line !== noteText)
                .join("\n")
                .trim() + "\n";
          }

          if (conditionalInput) {
            conditionalInput.classList.toggle("hidden", !checked);

            conditionalInput.addEventListener("input", () => {
              const inputVal = conditionalInput.value.trim();
              const template = step.conditionalInput.noteTemplate;
              const finalNote = template.replace("{input}", inputVal);

              // Replace any existing approval lines
              notes.value = notes.value
                .split("\n")
                .filter((line) => !line.includes("approved."))
                .join("\n")
                .trim();

              if (inputVal) {
                notes.value += "\n" + finalNote + "\n";
              }
            });
          }
        });

        wrapper.appendChild(label);
        wrapper.appendChild(checkbox);
        stepEl.appendChild(wrapper);

        //stepEl.appendChild(checkbox);
        if (conditionalInput) stepEl.appendChild(conditionalInput);
        break;
      }

      case "radio-group": {
        const groupWrapper = document.createElement("div");

        const qAnswers = {}; // stores selected answers

        step.questions.forEach((q) => {
          // Create a flex container for question + radios
          const flexWrapper = document.createElement("div");
          flexWrapper.style.display = "flex";
          flexWrapper.style.justifyContent = "space-between";
          flexWrapper.style.alignItems = "center";
          flexWrapper.style.marginBottom = "1rem";

          // Question label
          const questionLabel = document.createElement("label");
          //questionLabel.style.minWidth = "150px"; // optional fixed width or adjust as needed
          //questionLabel.style.margin = "0"; // remove default margin
          questionLabel.innerText = q.question;

          // Radio group
          const radioGroup = document.createElement("sl-radio-group");
          radioGroup.setAttribute("name", q.id);
          radioGroup.setAttribute("size", "small");

          q.options.forEach((opt) => {
            const radioBtn = document.createElement("sl-radio-button");
            radioBtn.setAttribute("value", opt);
            radioBtn.innerText = opt;
            radioGroup.appendChild(radioBtn);
          });

          // Append label and radio group to flex container
          flexWrapper.appendChild(questionLabel);
          flexWrapper.appendChild(radioGroup);

          // Append flex container to the main groupWrapper
          groupWrapper.appendChild(flexWrapper);

          // Add event listener
          radioGroup.addEventListener("sl-change", (e) => {
            qAnswers[q.id] = e.target.value;
            evaluateConditions();
          });
        });

        const dynamicContainer = document.createElement("div");
        groupWrapper.appendChild(dynamicContainer);

        function evaluateConditions() {
          dynamicContainer.innerHTML = "";
          step.conditions?.forEach((cond) => {
            // const allMatch = Object.entries(cond.if).every(
            //   ([qid, val]) => qAnswers[qid] === val
            // );
            const allMatch =
              qAnswers.q1 === "Yes" ||
              (qAnswers.q2 === "Yes" && qAnswers.q3 === "Yes");

            if (allMatch) {
              cond.show.forEach((showStep) => {
                const container = document.createElement("div");

                if (showStep.type === "warning") {
                  const alert = document.createElement("sl-alert");
                  alert.open = true;
                  alert.variant = "warning";
                  alert.innerText = showStep.text;
                  container.appendChild(alert);
                }

                if (showStep.type === "input") {
                  // Create a wrapper div for label + input, styled as flex row
                  const row = document.createElement("div");
                  row.style.display = "flex";
                  row.style.alignItems = "center";
                  row.style.gap = "0.5rem"; // spacing between label and input
                  row.style.justifyContent= "flex-end";

                  // Create the label
                  const label = document.createElement("label");
                  label.innerText = showStep.label || "";
                  label.style.minWidth = "150px"; // fixed width for alignment, adjust as needed
                  label.style.display = "inline-block";

                  // Create the input
                  const input = document.createElement("sl-input");
                  input.placeholder = showStep.placeholder || "";

                  input.addEventListener("input", () => {
                    const inputVal = input.value.trim();
                    const finalNote = showStep.noteTemplate.replace(
                      "{input}",
                      inputVal
                    );

                    notes.value = notes.value
                      .split("\n")
                      .filter((line) => !line.includes("approved."))
                      .join("\n")
                      .trim();

                    if (inputVal) {
                      notes.value += "\n" + finalNote + "\n";
                    }
                  });

                  // Append label and input side by side inside row
                  row.appendChild(label);
                  row.appendChild(input);

                  // Append the row to the container
                  container.appendChild(row);
                }

                dynamicContainer.appendChild(container);
              });
            }

            const checkBoxRestriction = document.querySelectorAll(
              ".checkbox-restriction"
            );

            if (qAnswers.q3 === "Yes") {
              checkBoxRestriction.forEach((el) => {
                el.classList.remove("hidden");
              });
            } else {
              {
                checkBoxRestriction.forEach((el) => {
                  el.classList.add("hidden");
                });
              }
            }
          });
        }

        stepEl.appendChild(groupWrapper);
        break;
      }

      default:
        console.warn("Unsupported step type:", step.type);
    }

    stepsContent.appendChild(stepEl);
  });
}
