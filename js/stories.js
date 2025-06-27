import { writeStory, readStories, deleteStory, updateStory } from "./firebase.js";

const storyForm = document.getElementById("storyForm");
const storyList = document.getElementById("storyList");
const storyFormSection = document.getElementById("storyFormSection");
const toggleFormBtn = document.querySelector(".toggle-form-btn");

// פתיחת טופס כתיבת סיפור
toggleFormBtn.addEventListener("click", function () {
  storyFormSection.style.display = "block";
});

// שליחת טופס
storyForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const story = document.getElementById("story").value;
  const name = document.getElementById("name").value;

  writeStory(title, story, name);
  storyForm.reset();
  storyFormSection.style.display = "none";
});

// קריאת סיפורים מה-DB והצגתם
readStories((stories) => {
  storyList.innerHTML = "";

  const storyEntries = Object.entries(stories).reverse(); // חדש קודם

  for (let [id, storyData] of storyEntries) {
    const { title, content, name } = storyData;

    const card = document.createElement("div");
    card.className = "story-box";

    const titleElem = document.createElement("h4");
    titleElem.textContent = title || "סיפור ללא כותרת";

    const contentElem = document.createElement("p");
    contentElem.textContent = content;

    const nameElem = document.createElement("h3");
    nameElem.textContent = `נכתב על ידי: ${name}`;

    card.appendChild(titleElem);
    card.appendChild(contentElem);
    card.appendChild(nameElem);

    // אם במצב עריכה – הוספת כפתורים
    if (isEditMode()) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "🗑️";
      deleteBtn.onclick = () => {
        if (confirm("האם למחוק את הסיפור?")) {
          deleteStory(id);
        }
      };

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "✎";
      editBtn.onclick = () => {
        openEditForm(card, id, title, content, name);
      };

      card.appendChild(deleteBtn);
      card.appendChild(editBtn);
    }

    storyList.appendChild(card);
  }
});

// טופס עריכה בתוך כרטיס
function openEditForm(card, id, oldTitle, oldContent, oldName) {
  card.innerHTML = "";

  const form = document.createElement("div");
  form.className = "inner-edit-form";

  const titleInput = document.createElement("input");
  titleInput.value = oldTitle || "";

  const contentTextarea = document.createElement("textarea");
  contentTextarea.rows = 5;
  contentTextarea.value = oldContent;

  const nameInput = document.createElement("input");
  nameInput.value = oldName || "";

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "inner-edit-form-buttons";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "שמור";
  saveBtn.onclick = () => {
    updateStory(id, {
      title: titleInput.value,
      content: contentTextarea.value,
      name: nameInput.value
    });
    location.reload();
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "ביטול";
  cancelBtn.onclick = () => {
    location.reload();
  };

  buttonWrapper.appendChild(saveBtn);
  buttonWrapper.appendChild(cancelBtn);

  form.appendChild(titleInput);
  form.appendChild(contentTextarea);
  form.appendChild(nameInput);
  form.appendChild(buttonWrapper);
  card.appendChild(form);
}
