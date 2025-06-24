const EDIT_PASSWORD = "arnon2011";

// בדיקה אם במצב עריכה
function isEditMode() {
  return sessionStorage.getItem("editMode") === "true";
}

// הפעלת מצב עריכה
function enableEditMode() {
  sessionStorage.setItem("editMode", "true");
  document.body.classList.add("edit-mode");
  showEditButtons();
  toggleExitButton();
}

// יציאה ממצב עריכה
function disableEditMode() {
  sessionStorage.removeItem("editMode");
  location.reload();
}

// הצגת כפתורי עריכה
function showEditButtons() {
  const controls = document.querySelectorAll(".edit-controls");
  controls.forEach((el) => {
    el.style.display = "inline";
  });
}

// הצגת/הסתרת כפתור יציאה
function toggleExitButton() {
  const btn = document.querySelector(".exit-edit-btn");
  if (!btn) return;

  if (isEditMode()) {
    btn.style.display = "inline";
  } else {
    btn.style.display = "none";
  }

  if (!btn.dataset.bound) {
    btn.addEventListener("click", disableEditMode);
    btn.dataset.bound = "true";
  }
}

// זיהוי לחיצה על "ארנון"
document.addEventListener("DOMContentLoaded", function () {
  const footer = document.querySelector("footer");
  if (!footer) return;

  const match = footer.innerHTML.match(/(ארנון)/);
  if (match) {
    footer.innerHTML = footer.innerHTML.replace(
      match[1],
      `<span class="edit-trigger" style="cursor:pointer;">${match[1]}</span>`
    );
  }

  const trigger = document.querySelector(".edit-trigger");
  if (trigger) {
    trigger.addEventListener("click", function () {
      const pass = prompt("הכנסי סיסמה כדי להיכנס למצב עריכה:");
      if (pass === EDIT_PASSWORD) {
        enableEditMode();
      } else {
        alert("סיסמה שגויה");
      }
    });
  }

  toggleExitButton();

  if (isEditMode()) {
    enableEditMode();
  }
});
