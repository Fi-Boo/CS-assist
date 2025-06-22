const reasonsData = {
  id: "reasons-tab",
  type: "tabs",
  target: "#reasons-tabs",
  categories: {
    Accounts: {
      id: "accounts",
      type: "btn-selection",
      target: "#option-buttons",
      subCategories: {
        "Billing Issues/Enquiry": {
          type: "options",
          options: {
            "Payment Plan": {
              note: "-----\nPayment Plan",
              type: "steps",
              steps: [
                {
                  id: "ppHeader",
                  type: "header",
                  header: "Payment Plan",
                  class: "primHeader",
                  link: {
                    url: "https://aussiebroadband.sharepoint.com/sites/CustomerService/SitePages/Billing-Hub.aspx?from=SendByEmail&e=APMcLauJhUeist5une3-Kw&at=121&CT=1744015659473&OR=OWA-NT-Mail&CID=337e4d01-af16-a968-6d3d-2be34420f342#payment-plans-and-self-sufficiency",
                    title: "Billing Hub - Payment plans and self sufficiency",
                  },
                },
                {
                  id: "PP-workflow",
                  type: "image",
                  url: "img/PP-flow.png",
                  target: "#decisionTree",
                },
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
                      if: [{ q1: "Yes" }, { q2: "Yes" }],
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
                  placeholder: "Input any conditions here. i.e. immediate payment of XX actioned",
                  buttonLabel: "Add",
                  noteTemplate: "Conditions:\n{input}\n-x-\n",
                },
                {
                  id: "restrictionResult",
                  type: "conditional",
                  conditions: [
                    {
                      if: [{ q2: "Yes" }],
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
                          exclusiveWith: ["checkbox-2"],
                        },
                        {
                          id: "checkbox-2",
                          type: "checkbox",
                          label: "Restriction NOT removed.",
                          note: "Restriction NOT removed",
                          exclusiveWith: ["checkbox-1"],
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
              note: "-----\nImmediate Plan",
              steps: [],
            },
            "Once Off Payment": {},
          },
        },
        "Transfer of Ownership (ToO)": {
          type: "steps",
          note: "-----\nTransfer of Ownership",
          steps: [
            {
              id: "TooHeader",
              type: "header",
              header: "Transfer of Ownership",
              class: "primHeader",
              link: {
                url: "https://aussiebroadband.sharepoint.com/sites/CustomerService/SitePages/Transfer-of-ownership-process-(Residential).aspx",
                title: "Transfer of Ownership Process",
              },
            },
          ],
        },
        "Edit/Update Details": {},
        "Service Closure": {},
        "Add Secondary Contact": {},
        Complaint: {},
        "Plan Speed Change": {},
      },
    },

    Technical: {
      id: "technical",
      type: "btn-selection",
      target: "#option-buttons",
      subCategories: {
        NBN: {
          options: {
            FTTP: {
              id: "FTTP",
              type: "steps",
              steps: [
                {
                  id: "FTTPHeader",
                  type: "header",
                  header: "Fibre to the Premises",
                  class: "primHeader",
                  link: {
                    url: "https://aussiebroadband.sharepoint.com/sites/CustomerService/SitePages/FTTP.aspx",
                    title: "FTTP Hub",
                  },
                },
                {
                  id: "FTTPTabs",
                  type: "tabs",
                  //target: "#steps-content",
                  categories: {
                    "No Connection": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttpNoconSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTP no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    Dropouts: {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttpDropSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTP no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    "Slow Speeds": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttpSlowSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTP no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                  },
                },
              ],
            },
            "FTTN/B": {
              id: "FTTN",
              type: "steps",
              steps: [
                {
                  id: "FTTNHeader",
                  type: "header",
                  header: "Fibre to the Node/Building",
                  class: "primHeader",
                  link: {
                    url: "https://aussiebroadband.sharepoint.com/sites/CustomerService/SitePages/FTTN-FTTB.aspx",
                    title: "FTTN/B Hub",
                  },
                },
                {
                  id: "FTTNTabs",
                  type: "tabs",
                  //target: "#steps-content",
                  categories: {
                    "No Connection": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttnNoconSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTN/B no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    Dropouts: {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttnDropSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTN/B no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    "Slow Speeds": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttnSlowSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTN/B no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                  },
                },
              ],
            },
            FTTC: {
              id: "FTTC",
              type: "steps",
              steps: [
                {
                  id: "FTTCHeader",
                  type: "header",
                  header: "Fibre to the Curb",
                  class: "primHeader",
                  link: {
                    url: "https://aussiebroadband.sharepoint.com/sites/CustomerService/SitePages/FTTC-Tr.aspx",
                    title: "FTTC Hub",
                  },
                },
                {
                  id: "FTTCTabs",
                  type: "tabs",
                  //target: "#steps-content",
                  categories: {
                    "No Connection": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttcNoconSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTC no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    Dropouts: {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttcDropSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTC no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    "Slow Speeds": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fttcSlowSummary",
                          type: "input-confirm",
                          placeholder: "Input FTTC no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                  },
                },
              ],
            },
            HFC: {
              id: "HFC",
              type: "steps",
              steps: [
                {
                  id: "HFCHeader",
                  type: "header",
                  header: "Hybrid Fibre Coaxial",
                  class: "primHeader",
                  link: {
                    url: "https://aussiebroadband.sharepoint.com/sites/CustomerService/SitePages/HFC-Hub.aspx",
                    title: "HFC Hub",
                  },
                },
                {
                  id: "HFCTabs",
                  type: "tabs",
                  //target: "#steps-content",
                  categories: {
                    "No Connection": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "hfcNoconSummary",
                          type: "input-confirm",
                          placeholder: "Input HFC no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    Dropouts: {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "hfcDropSummary",
                          type: "input-confirm",
                          placeholder: "Input HFC no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    "Slow Speeds": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "hfcSlowSummary",
                          type: "input-confirm",
                          placeholder: "Input HFC no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                  },
                },
              ],
            },
            "F/W": {
              id: "FW",
              type: "steps",
              steps: [
                {
                  id: "FWHeader",
                  type: "header",
                  header: "Fixed Wireless",
                  class: "primHeader",
                  link: {
                    url: "https://aussiebroadband.sharepoint.com/sites/CustomerService/SitePages/Fixed-Wireless.aspx",
                    title: "Fixed Wireless Hub",
                  },
                },
                {
                  id: "FWTabs",
                  type: "tabs",
                  //target: "#steps-content",
                  categories: {
                    "No Connection": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fwNoconSummary",
                          type: "input-confirm",
                          placeholder: "Input FW no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    Dropouts: {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fwDropSummary",
                          type: "input-confirm",
                          placeholder: "Input FW no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                    "Slow Speeds": {
                      type: "steps",
                      image: {
                        url: "img/PP-flow.png",
                        target: "#decisionTree",
                      },
                      steps: [
                        {
                          id: "step1",
                          type: "info",
                          text: "step guide coming soon",
                          info: "stuff",
                        },
                        {
                          id: "fwSlowSummary",
                          type: "input-confirm",
                          placeholder: "Input FW no connection steps",
                          buttonLabel: "Add",
                          noteTemplate: "T/S details:\n{input}\n-x-\n",
                        },
                      ],
                    },
                  },
                },
              ],
            },
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
      type: "btn-selection",
      target: "#option-buttons",
      subCategories: {
        "Coming soon to a": {},
        "Cinema near YOU!": {},
      },
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

// starter
createByType(reasonsData);

/*
  this creates the shoelace tab in the bottom half of top left section
  user selects on of these tabs -> renders the options (sub categories as buttons)
*/
function createTabs(data) {
  const target = data.target
    ? Object.assign(document.querySelector(data.target), { innerHTML: "" })
    : document.createElement("div");

  const tabGroup = document.createElement("sl-tab-group");
  tabGroup.id = data.id.replace("#", ""); // e.g., "reasons-tabs"

  Object.entries(data.categories).forEach(([tabName, tabContent], index) => {
    const tab = document.createElement("sl-tab");
    tab.slot = "nav";
    tab.panel = `panel-${index}`;
    tab.innerText = tabName;

    const panel = document.createElement("sl-tab-panel");
    panel.name = `panel-${index}`;

    panel.dataset.imageUrl = tabContent.image?.url || "";
    panel.dataset.imageTarget = tabContent.image?.target || "";

    const block = tabContent.type
      ? createByType(tabContent)
      : document.createElement("div");
    panel.appendChild(block);

    tabGroup.appendChild(tab);
    tabGroup.appendChild(panel);
  });

  target.appendChild(tabGroup);

  // Event listener for tab changes
  tabGroup.addEventListener("sl-tab-show", (event) => {
    handleTabShow(tabGroup, event.detail.name);
  });

  // --- Trigger the tab-show logic for the initially selected tab ---

  // Wait a tick to ensure tabGroup has rendered and set default active tab
  setTimeout(() => {
    const selectedPanel =
      tabGroup.querySelector(
        "sl-tab-panel[active], sl-tab-panel[aria-hidden='false']"
      ) || tabGroup.querySelector("sl-tab-panel"); // fallback first panel

    if (selectedPanel) {
      handleTabShow(tabGroup, selectedPanel.name);
    }
  }, 0);

  return target;
}

// Shared logic for handling tab showing
function handleTabShow(tabGroup, newPanelName) {
  if (tabGroup.id === "reasons-tabs") {
    optionsContainer.innerHTML = "";
    stepsContent.innerHTML = "";
    decisionTreeContainer.innerHTML = "";
  } else if (tabGroup.id === "steps-content") {
    decisionTreeContainer.innerHTML = "";
  }

  const newPanel = tabGroup.querySelector(
    `sl-tab-panel[name="${newPanelName}"]`
  );
  if (newPanel) {
    const buttons = newPanel.querySelectorAll("sl-button");
    buttons.forEach((btn) => (btn.variant = "default"));

    const imgUrl = newPanel.dataset.imageUrl;
    const imgTarget = newPanel.dataset.imageTarget;
    if (imgUrl && imgTarget) {
      const targetEl = document.querySelector(imgTarget);
      if (targetEl) {
        targetEl.innerHTML = "";
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = "Decision Tree";
        img.style.maxWidth = "100%";
        img.style.marginBottom = "1rem";
        targetEl.appendChild(img);
      }
    }
  }
}

function createBtnSelection(tabContent) {
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
          optionsContainer.innerHTML = "";
          resetLowerContent();
          if (activeButton && activeButton !== button) {
            activeButton.variant = "default";
          }
          // Highlight this one
          button.variant = "primary";
          activeButton = button;

          // Handle both "options" object and direct "type"
          if (subCatData.options) {
            createOptions(subCatData.options);
          } else if (subCatData.type) {
            // Directly render steps, tabs, etc.
            stepsContent.innerHTML = "";
            console.log("here?");
            const rendered = createByType(subCatData);

            if (rendered) stepsContent.appendChild(rendered);
          } else {
            stepsContent.innerHTML = "";
            const fallback = document.createElement("p");
            fallback.textContent = "No content available.";
            stepsContent.appendChild(fallback);
          }
        });

        buttonContainer.appendChild(button);
      }
    );
  }
  return buttonContainer;
}

/* 
  renders the button options at the top of the bottom half (steps container)
  selecting an option will load data into the bottom half
*/
function createOptions(optionsObj) {
  optionsContainer.innerHTML = "";
  stepsContent.innerHTML = "";

  if (!optionsObj || Object.keys(optionsObj).length === 0) {
    const none = document.createElement("p");
    none.textContent = "No options available.";
    optionsContainer.appendChild(none);
    return;
  }

  const container = document.createElement("div");
  container.classList.add("option-buttons-row");

  let activeOptionBtn = null;

  Object.entries(optionsObj).forEach(([optionKey, optionData]) => {
    const btn = document.createElement("sl-button");
    btn.innerText = optionKey;
    btn.variant = "default";
    btn.size = "small";
    btn.classList.add("option-button");

    btn.addEventListener("click", () => {
      if (activeOptionBtn && activeOptionBtn !== btn) {
        activeOptionBtn.variant = "default";
      }
      btn.variant = "primary";
      activeOptionBtn = btn;

      stepsContent.innerHTML = "";
      const rendered = createByType(optionData);
      if (rendered) stepsContent.appendChild(rendered);
    });

    container.appendChild(btn);
  });

  optionsContainer.appendChild(container);
}

// ----------------------------------------------------------
// ---------- Render Steps ----------------------------------

function createSteps(data) {
  resetLowerContent();

  const wrapper = document.createElement("div"); // This becomes the block

  if (data.note) {
    const existing = notes.value.trim();
    const noteToAdd = data.note.trim();
    notes.value =
      existing + (existing.endsWith("\n") ? "" : "\n") + noteToAdd + "\n";
  }

  (data.steps || []).forEach((step) => {
    const renderedStep = createByType(step);

    if (renderedStep) {
      const stepEl = document.createElement("div");
      stepEl.classList.add("step");
      stepEl.appendChild(renderedStep);
      wrapper.appendChild(stepEl);
    }
    // else: Step was targeted elsewhere (e.g. image in #decision-tree), skip appending
  });

  return wrapper;
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
const conditionCreator = [];

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
  function checkAndCreate() {
    // Clear previous
    showContainer.innerHTML = "";

    data.conditions.forEach((cond) => {
      if (shouldShow(cond, conditionalAnswers)) {
        cond.show.forEach((item) => {
          const element = createByType(item);
          showContainer.appendChild(element);
        });
      }
    });
  }

  // Register this render function
  conditionCreator.push(checkAndCreate);
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

    // Trigger ALL conditional renders
    conditionCreator.forEach((fn) => fn());
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

function createImage(data) {
  let target;

  if (data.target && document.querySelector(data.target)) {
    // Use the existing target in the DOM
    target = document.querySelector(data.target);
    target.innerHTML = ""; // Optional: clear previous content if needed
  } else {
    // No valid target found, create a new container to return
    target = document.createElement("div");
  }

  const imgEl = document.createElement("img");
  imgEl.src = data.url;
  imgEl.alt = "Decision Tree";
  imgEl.style.maxWidth = "100%";
  imgEl.style.marginBottom = "1rem";

  target.appendChild(imgEl);
  console.log("Rendering image to", data.target, "URL:", data.url);
  // Only return the container if it was not targeted elsewhere
  return data.target ? null : target;
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

      if (data.link) {
        const headerLink = document.createElement("a");
        headerLink.href = data.link.url;
        headerLink.target = "_blank";
        headerLink.rel = "noopener noreferrer";

        const linkIcon = document.createElement("sl-icon-button");
        linkIcon.name = "link-45deg";
        linkIcon.title = data.link.title;

        headerLink.appendChild(linkIcon);
        header.appendChild(headerLink);
      }

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

    case "tabs": {
      return createTabs(data);
    }

    case "btn-selection": {
      return createBtnSelection(data);
    }

    case "steps": {
      return createSteps(data);
    }

    case "image": {
      return createImage(data);
    }

    default:
      console.warn("Unsupported step type:", data.type);
      return document.createElement("div"); // fallback safe return
  }
}
