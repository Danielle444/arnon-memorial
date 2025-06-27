// stories.js (עם Firebase כולל מחיקה ועריכה)
import { writeStory, readStories, updateStory, deleteStory } from './firebase.js';

const form = document.getElementById("storyForm");
const storyList = document.getElementById("storyList");
const formSection = document.getElementById("storyFormSection");

let stories = {}; // שומר את הסיפורים לפי מפתח ה־Firebase שלהם

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const text = document.getElementById("story").value.trim();
  const name = document.getElementById("name").value.trim();

  if (name && text) {
    writeStory(title, text, name);
    form.reset();
    hideStoryForm();
  }
});

readStories(function (data) {
  stories = data || {};
  displayStories();
});

function displayStories() {
  storyList.innerHTML = "";
  for (const [id, story] of Object.entries(stories)) {
    addStoryToPage(story, id);
  }
}

function addStoryToPage(storyObj, id) {
  const storyBox = document.createElement("div");
  storyBox.className = "story-box";

  if (storyObj.title) {
    const storyTitle = document.createElement("h4");
    storyTitle.textContent = storyObj.title;
    storyBox.appendChild(storyTitle);
  }

  const content = document.createElement("p");
  content.textContent = storyObj.content;
  storyBox.appendChild(content);

  const author = document.createElement("h3");
  author.textContent = storyObj.name;
  storyBox.appendChild(author);

  if (isEditMode()) {
    const controls = document.createElement("div");
    controls.className = "edit-controls-container";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.className = "edit-controls delete-btn";
    deleteBtn.title = "מחק סיפור";
    deleteBtn.addEventListener("click", function () {
      if (confirm("האם את בטוחה שברצונך למחוק את הסיפור?")) {
        deleteStory(id);
      }
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏";
    editBtn.className = "edit-controls edit-btn";
    editBtn.title = "ערוך סיפור";
    editBtn.addEventListener("click", function () {
      showEditFormInside(storyBox, storyObj, id);
    });

    controls.appendChild(editBtn);
    controls.appendChild(deleteBtn);
    storyBox.appendChild(controls);
  }

  storyList.appendChild(storyBox);
}

function showEditFormInside(container, storyObj, id) {
  container.innerHTML = "";

  const form = document.createElement("form");
  form.className = "inner-edit-form";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = storyObj.title || "";

  const storyInput = document.createElement("textarea");
  storyInput.rows = 5;
  storyInput.value = storyObj.content;

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = storyObj.name;

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "inner-edit-form-buttons";

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.textContent = "שמירה";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "ביטול";
  cancelBtn.addEventListener("click", function () {
    displayStories();
  });

  buttonsWrapper.appendChild(cancelBtn);
  buttonsWrapper.appendChild(saveBtn);

  form.appendChild(titleInput);
  form.appendChild(storyInput);
  form.appendChild(nameInput);
  form.appendChild(buttonsWrapper);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    updateStory(id, {
      title: titleInput.value.trim(),
      content: storyInput.value.trim(),
      name: nameInput.value.trim(),
      timestamp: Date.now()
    });
  });

  container.appendChild(form);
}

window.toggleStoryForm = function () {
  formSection.style.display =
    formSection.style.display === "none" || formSection.style.display === ""
      ? "block"
      : "none";
};

window.hideStoryForm = function () {
  formSection.style.display = "none";
};