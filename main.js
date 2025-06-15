import { Renderer } from "./renderer.js";

const reasonsData = {
  Accounts: {
    subCategories: {
      "Billing Issues/Enquiry": {
        options: {
          "Payment Plan": {
            notes: "-----\nPayment Plan",
            img: "img/PP-flow.png",
            steps: [
              {
                id: "ppReason",
                type: "input",
                placeholder: "Input reason for PP here",
                noteTemplate: "PP Reason: {input}",
              },
              {
                id: "eligibilityCheck",
                type: "conditional",
                questions: [
                  {
                    id: "q1",
                    type: "radio",
                    label: "Is PP outside of billing cycle?",
                    options: ["Yes", "No"],
                  },
                  {
                    id: "q2",
                    type: "radio",
                    label: "Is there a restriction active?",
                    options: ["Yes", "No"],
                  },
                  {
                    id: "q3",
                    type: "radio",
                    label: "Is there a PP already active?",
                    options: ["Yes", "No"],
                  },
                ],
                conditions: [
                  {
                    if: [{ q1: "Yes" }, { q3: "Yes" }],
                    logic: "OR",
                    show: [
                      {
                        id: "warningApproval",
                        type: "warning",
                        text: "** [L2] AE/TL approval required **",
                      },
                      {
                        id: "approval",
                        type: "input",
                        placeholder: "Input AE/TL Approver Name Here",
                        noteTemplate: "Approved by: {input}",
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
                placeholder: "Paste/Input PP details here",
                buttonLabel: "Add",
                noteTemplate: "PP details:\n{input}\n-x-\n",
              },
              {
                id: "restrictionResult",
                type: "conditional",
                conditions: [
                  {
                    if: [{ q3: "Yes" }],
                    show: [
                      {
                        id: "header1",
                        type: "header",
                        class: "subheader",
                        header: "Actioning Restriction?",
                      },
                      {
                        id: "checkbox-1",
                        type: "checkbox",
                        label: "Restriction removed.",
                        note: "Restriction removed. Adv eu to pc CPE if required",
                         exclusiveWith: ["checkbox-2"]
                      },
                      {
                        id: "checkbox-2",
                        type: "checkbox",
                        label: "Restriction NOT removed.",
                        note: "Restriction NOT removed",
                        exclusiveWith: ["checkbox-1"]
                      },
                      {
                        id: "restrictionReason",
                        type: "input",
                        placeholder: "Input reason (for non removal)",
                        noteTemplate: "Reason: {input}",
                      },
                    ],
                  },
                ],
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

const defaultNotes = `Customer: \nID: N\n2FA: N\nCall: \n-----\nNotes\n`; // default notes

// Lower panel
const optionsContainer = document.getElementById("option-buttons");
const stepsContent = document.getElementById("steps-content");
const decisionTreeContainer = document.getElementById("decisionTree");
const reasonsTabs = document.getElementById("reasons-tabs");
const stepsContainer = document.getElementById("steps-container");

// TOP-LEFT panel
if (radioGroupCMS) {
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
}

// shows outbound MUST do steps.
radioGroupCallType.addEventListener("sl-change", (event) => {
  const selectedValue = event.target.value;
  if (selectedValue === "2") {
    callPrompt.classList.remove("hidden");
    if (!tfaCheckbox.checked) {
      tfaCheckboxText.innerHTML = "DO IT! DO IT!";
    }
    setTimeout(() => {
      callPrompt.classList.add("hidden");
    }, 10000); // 7secs
  } else {
    callPrompt.classList.add("hidden");
    tfaCheckboxText.innerHTML = "";
  }
});

// gets the notes header and populates it with current data from top-left panel
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

  return `Customer: ${customerName}\nID: ${idConfirmed}\n2FA: ${tfaConfirmed}\nCall: ${callTypeValue}\n-----\nNotes`;
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

// --------------------------------------------------------------
// ---------------RIGHT PANEL - NOTES ---------------------------

resetNotes();

function resetNotes() {
  notes.value = defaultNotes;
}

// updates only the header - this is when user interacts with top-left panel
function updateNotesHeaderOnly() {
  const current = notes.value.split("\n");
  const newHeader = getDynamicHeader().split("\n");
  let userNotes = "";

  if (current.length >= 6) {
    userNotes = current.slice(6).join("\n").trim();
  }
  notes.value = [...newHeader, userNotes].join("\n");
}

function updateNotes(text) {
  const prefix = text.split(":")[0] + ":";

  // takes each line and filters out "" or any line that doesn't start with prefix
  const lines = notes.value
    .split("\n")
    .filter((line) => line && !line.startsWith(prefix));

  // Only push the new text if it's more than just the prefix
  if (text.trim() !== prefix) {
    lines.push(text);
  }

  notes.value = lines.join("\n") + "\n";
}

// copy notes button - pops up dialog with refresh button
copyNotesBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(notes.value);
    copyDialog.show();
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
});

// reloads page
refreshBtn.addEventListener("click", () => {
  location.reload();
});

function resetLowerContent() {
  stepsContent.innerHTML = "";
  decisionTreeContainer.innerHTML = "";
}

// render the tabs
renderTabs(reasonsData);

/*
  this creates the shoelace tab in the bottom half of top left section
  user selects on of these tabs -> renders the options (sub categories as buttons)
*/
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
          button.size = "small";
          button.variant = "default"; // inactive state

          button.addEventListener("click", () => {
            // Reset previous
            resetLowerContent();
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

const tabGroup = document.querySelector("#reasons-tabs");

tabGroup.addEventListener("sl-tab-show", (event) => {
  // Clear any previously selected options
  optionsContainer.innerHTML = "";
  stepsContent.innerHTML = "";
  decisionTreeContainer.innerHTML = "";
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

/* 
  renders the button options at the top of the bottom half (steps container)
  selecting an option will load data into the bottom half
*/
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

// ----------------------------------------------------------
// ---------- Render Steps ----------------------------------

function renderSteps(label, data) {
  resetLowerContent();

  const header = document.createElement("h3");
  header.innerText = label;
  stepsContent.appendChild(header);

  if (data.notes) {
    const existing = notes.value.trim();
    const noteToAdd = data.notes.trim();
    notes.value =
      existing + (existing.endsWith("\n") ? "" : "\n") + noteToAdd + "\n";
  }

  if (data.img) {
    const imgEl = document.createElement("img");
    imgEl.src = data.img;
    imgEl.alt = label + " Decision Tree";
    imgEl.style.maxWidth = "100%";
    imgEl.style.marginBottom = "1rem";

    decisionTreeContainer.appendChild(imgEl);
  }

  (data.steps || []).forEach((step) => {
    const stepEl = document.createElement("div");
    stepEl.classList.add("step");

    let renderedStep = createByType(step);

    stepEl.appendChild(renderedStep);

    stepsContent.appendChild(stepEl);
  });
}

/*
    Data type functions
    see datatypes spreadsheet for reqs
*/

function createInfoAction(data) {
  const content = document.createElement("sl-details");
  content.disabled = data.type === "action" ? true : false;
  content.className = data.type;
  content.summary = data.text || "Update Text info for step";
  return content;
}

function createWarning(data) {
  const alert = document.createElement("sl-alert");
  alert.open = true;
  alert.variant = "warning";
  alert.innerText = data.text || "Instruction";
  return alert;
}

function createInput(data) {
  const block = document.createElement("sl-input");
  block.placeholder = data.placeholder;

  if (data.noteTemplate) {
    block.addEventListener("input", () => {
      const inputVal = block.value.trim();

      if (inputVal) {
        const note = data.noteTemplate.replace("{input}", inputVal);
        updateNotes(note);
      } else {
        // Input is empty: remove the note entirely
        const prefix = data.noteTemplate.split(":")[0] + ":";
        updateNotes(prefix);
      }
    });
  }

  return block;
}

// Conditional fuction
let conditionalAnswers = {};
const conditionRenderers = [];

function createConditional(data) {
  const block = document.createElement("div");
  block.id = data.id;

  //conditionalAnswers = {};

  if (data.questions) {
    data.questions.forEach((question) => {
      block.appendChild(createByType(question));
    });
  }

  const showContainer = document.createElement("div");
  showContainer.classList.add("conditional-show");
  showContainer.id = data.id;
  block.appendChild(showContainer); // placeholder for conditional results

  // Define render function
  function checkAndRender() {
    // Clear previous
    showContainer.innerHTML = "";

    data.conditions.forEach((cond) => {
      if (shouldShow(cond, conditionalAnswers)) {
        cond.show.forEach((item) => {
          console.log(cond);
          console.log(conditionalAnswers);
          console.log(shouldShow(cond, conditionalAnswers));
          const element = createByType(item);
          showContainer.appendChild(element);
        });
      }
    });
  }

  // Register this render function
  conditionRenderers.push(checkAndRender);
  // // Make the render function accessible from outside
  // window._triggerConditionRender = checkAndRender;

  return block;
}

function shouldShow(condition, answers) {
  // For each condition, check if the user's answer matches the expected value.
  // Returns an array of true/false results for each condition.
  const checks = condition.if.map((cond) => {
    const key = Object.keys(cond)[0];
    return answers[key] === cond[key];
  });

  if (condition.logic === "OR") {
    return checks.some(Boolean);
  } else {
    // Default to AND
    return checks.every(Boolean);
  }
}

function createRadio(data) {
  const flexWrapper = document.createElement("div");
  flexWrapper.style.display = "flex";
  flexWrapper.style.justifyContent = "space-between";
  flexWrapper.style.alignItems = "center";
  flexWrapper.style.marginBottom = "0.5rem";

  // Question label
  const questionLabel = document.createElement("label");
  //questionLabel.style.minWidth = "150px"; // optional fixed width or adjust as needed
  //questionLabel.style.margin = "0"; // remove default margin
  questionLabel.innerText = data.label;

  // Radio group
  const radioGroup = document.createElement("sl-radio-group");
  radioGroup.setAttribute("name", data.id);
  radioGroup.setAttribute("size", "small");

  data.options.forEach((opt) => {
    const radioBtn = document.createElement("sl-radio-button");
    radioBtn.setAttribute("value", opt);
    radioBtn.innerText = opt;
    radioGroup.appendChild(radioBtn);
  });

  // Add event listener to capture selection
  radioGroup.addEventListener("sl-change", (event) => {
    conditionalAnswers[data.id] = event.target.value;
    //console.log(conditionalAnswers); // optional debug

    // Trigger ALL conditional renders
    conditionRenderers.forEach((fn) => fn());
    // // Trigger render check
    // if (typeof window._triggerConditionRender === "function") {
    //   window._triggerConditionRender();
    // }
  });

  // Append label and radio group to flex container
  flexWrapper.appendChild(questionLabel);
  flexWrapper.appendChild(radioGroup);

  return flexWrapper;
}

// checkbox
function createCheckbox(data) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "space-between";
  wrapper.style.alignItems = "center";
  wrapper.style.paddingRight = "5rem";

  const label = document.createElement("label");
  label.innerText = data.label;
  label.style.flexGrow = "1"; // <-- this makes label take remaining space
  label.style.marginRight = "1rem"; // spacing between label and checkbox
  label.style.userSelect = "none"; // optional: prevent label text selection on checkbox click
  const checkbox = document.createElement("sl-checkbox");
  checkbox.id = data.id;

  let conditionalInput;
  if (data.conditionalInput) {
    conditionalInput = document.createElement("sl-input");
    conditionalInput.placeholder = data.conditionalInput.placeholder;
    conditionalInput.classList.add("hidden");
    conditionalInput.style.marginLeft = "1rem";
  }

  checkbox.addEventListener("sl-change", (e) => {
    const checked = e.target.checked;
    const noteText = data.note;

    // Add/remove main note
    if (checked && noteText && !notes.value.includes(noteText)) {
      notes.value += (notes.value.endsWith("\n") ? "" : "\n") + noteText + "\n";
    } else if (!checked && noteText) {
      notes.value =
        notes.value
          .split("\n")
          .filter((line) => line !== noteText)
          .join("\n")
          .trim() + "\n";
    }

    // Handle conditional input toggle
    if (conditionalInput) {
      conditionalInput.classList.toggle("hidden", !checked);
      conditionalInput.addEventListener("input", () => {
        const inputVal = conditionalInput.value.trim();
        const template = data.conditionalInput.noteTemplate;
        const finalNote = template.replace("{input}", inputVal);

        // Remove previous approval-style notes
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

    // 🚫 Mutual Exclusivity Logic
    if (checked && Array.isArray(data.exclusiveWith)) {
      data.exclusiveWith.forEach((id) => {
        const other = document.querySelector(`#${id}`);
        if (other && other.checked) {
          other.checked = false;
          other.dispatchEvent(new CustomEvent("sl-change")); // Force update
        }
      });
    }
  });

  wrapper.appendChild(label);
  wrapper.appendChild(checkbox);
  return wrapper;
}

function createInputConfirm(data) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.gap = "0.5rem";

  // Label if present
  if (data.label) {
    const labelEl = document.createElement("label");
    labelEl.innerText = data.label;
    wrapper.appendChild(labelEl);
  }

  // Textarea
  const textarea = document.createElement("sl-textarea");
  textarea.placeholder = data.placeholder || "Type something...";
  textarea.rows = 4;
  wrapper.appendChild(textarea);

  // Button
  const addBtn = document.createElement("sl-button");
  addBtn.innerText = data.buttonLabel || "Add";
  addBtn.style.width = "fit-content";
  addBtn.style.margin = "0 auto";
  addBtn.variant = "success";
  addBtn.size = "small";
  wrapper.appendChild(addBtn);

  // Button click event
  addBtn.addEventListener("click", () => {
    const inputVal = textarea.value.trim();
    if (inputVal) {
      // Prepare final note with template, replacing {input}
      const finalNote = data.noteTemplate
        ? data.noteTemplate.replace("{input}", inputVal)
        : inputVal;

      // Use delimiters from your noteTemplate to build regex:
      // Extract prefix and suffix for the block from template
      // Here, your template is like:
      // "PP details:\n{input}\n-x-\n"
      // so prefix = "PP details:"
      // suffix = "-x-"

      // Extract prefix and suffix around {input}
      const parts = data.noteTemplate.split("{input}");
      const prefix = parts[0].trim().replace(/\n$/, ""); // "PP details:"
      const suffix = parts[1].trim().replace(/^\n/, ""); // "-x-"

      // Regex to match entire PP details block
      // Matches from prefix line to suffix line, including everything in between (including newlines)
      const regex = new RegExp(
        `${escapeRegExp(prefix)}[\\s\\S]*?${escapeRegExp(suffix)}\\n?`,
        "m"
      );

      let currentNotes = notes.value;

      if (regex.test(currentNotes)) {
        // Replace existing block
        currentNotes = currentNotes.replace(regex, finalNote + "\n");
      } else {
        // Append new block if none exists
        if (currentNotes && !currentNotes.endsWith("\n")) {
          currentNotes += "\n";
        }
        currentNotes += finalNote + "\n";
      }

      notes.value = currentNotes;
    }
  });

  return wrapper;
}

// Helper to escape regex special characters in prefix/suffix
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createByType(data) {
  switch (data.type) {
    case "header": {
      const headerBlock = document.createElement("div");
      const header = document.createElement("h2");
      header.innerHTML = data.header;
      header.classList.add(data.class);

      headerBlock.appendChild(document.createElement("hr"));
      headerBlock.appendChild(header);
      return headerBlock;
    }

    case "info":
    case "action": {
      return createInfoAction(data);
    }

    case "warning": {
      return createWarning(data);
    }

    case "input": {
      return createInput(data);
    }

    case "input-confirm": {
      return createInputConfirm(data);
    }

    case "checkbox": {
      return createCheckbox(data);
    }

    case "radio": {
      return createRadio(data);
    }

    case "conditional": {
      return createConditional(data);
    }

    default:
      console.warn("Unsupported step type:", data.type);
  }
}
