const customerNameInput = document.getElementById("customerName");
const idCustomerCheckbox = document.getElementById("idCustomer");
const notesBox = document.getElementById("notes");

const reasonButtons = document.querySelectorAll(".reason-button");
const reasonDetails = document.querySelectorAll(".reason-details");

let selectedReason = "";

function updateNotes() {
  const name = customerNameInput.value.trim();
  const idVerified = idCustomerCheckbox.checked ? "Y" : "N";

  notesBox.textContent =
    `Customer Name: ${name || "[Not entered]"}\n` +
    `ID Verified: ${idVerified}\n` +
    `Reason for Call: ${selectedReason || "[None selected]"}`;
}

customerNameInput.addEventListener("input", updateNotes);
idCustomerCheckbox.addEventListener("change", updateNotes);

reasonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Collapse all details
    reasonDetails.forEach((d) => d.classList.remove("active"));

    // Expand the clicked reason
    const targetId = button.getAttribute("data-target");
    const detailBox = document.getElementById(targetId);
    if (detailBox) {
      detailBox.classList.add("active");
      selectedReason = button.textContent;
      updateNotes();
    }
  });
});

const toggleBtn = document.getElementById("toggleNoteBtn");
const noteContent = document.getElementById("noteContent");

toggleBtn.addEventListener("click", () => {
  const isVisible = noteContent.style.display !== "none";
  noteContent.style.display = isVisible ? "none" : "block";
  toggleBtn.textContent = isVisible ? "Show Note" : "Hide Note";
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const notesContent = document.getElementById("notes").innerText;
  navigator.clipboard
    .writeText(notesContent)
    .then(() => {
      alert("Notes copied to clipboard!");
    })
    .catch((err) => {
      alert("Failed to copy notes.");
      console.error(err);
    });
});
