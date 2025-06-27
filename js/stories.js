import { readStories, writeStory, deleteStoryFromDB, updateStoryInDB } from './firebase.js';

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("storyForm");
  const storyList = document.getElementById("storyList");
  const formSection = document.getElementById("storyFormSection");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const text = document.getElementById("story").value.trim();
    const name = document.getElementById("name").value.trim();

    if (name && text) {
      writeStory(title, text, name); // שולח ל-Firebase
      form.reset();
      hideStoryForm();
    }
  });

  function displayStories(data) {
    storyList.innerHTML = "";
    const entries = Object.entries(data || {}).sort((a, b) => b[1].timestamp - a[1].timestamp);
    entries.forEach(([id, story]) => {
      story.id = id; // מוסיף מזהה לכל סיפור
      addStoryToPage(story);
    });
  }

  function addStoryToPage(storyObj) {
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
      const controlsDiv = document.createElement("div");
      controlsDiv.className = "edit-controls";
      controlsDiv.style.display = "inline";

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.innerText = "✏️";
      editBtn.title = "ערכי סיפור";
      editBtn.onclick = function () {
        openEditForm(storyObj, storyBox);
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerText = "🗑️";
      deleteBtn.title = "מחקי סיפור";
      deleteBtn.onclick = function () {
        deleteStory(storyObj.id);
      };

      controlsDiv.appendChild(editBtn);
      controlsDiv.appendChild(deleteBtn);
      storyBox.appendChild(controlsDiv);
    }

    storyList.appendChild(storyBox);
  }

  function openEditForm(storyObj, storyBox) {
    storyBox.innerHTML = ''; // נקה את התצוגה

    const editForm = document.createElement("div");
    editForm.className = "inner-edit-form";

    const titleInput = document.createElement("input");
    titleInput.value = storyObj.title || '';
    editForm.appendChild(titleInput);

    const contentTextarea = document.createElement("textarea");
    contentTextarea.rows = 4;
    contentTextarea.value = storyObj.content || '';
    editForm.appendChild(contentTextarea);

    const nameInput = document.createElement("input");
    nameInput.value = storyObj.name || '';
    editForm.appendChild(nameInput);

    const buttons = document.createElement("div");
    buttons.className = "inner-edit-form-buttons";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "ביטול";
    cancelBtn.onclick = function () {
      addStoryToPage(storyObj); // טען מחדש
    };

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "שמירה";
    saveBtn.onclick = function () {
      const updatedStory = {
        title: titleInput.value.trim(),
        content: contentTextarea.value.trim(),
        name: nameInput.value.trim(),
        timestamp: Date.now(),
      };
      updateStoryInDB(storyObj.id, updatedStory);
    };

    buttons.appendChild(cancelBtn);
    buttons.appendChild(saveBtn);
    editForm.appendChild(buttons);
    storyBox.appendChild(editForm);
  }

  function deleteStory(storyId) {
    if (confirm("את בטוחה שאת רוצה למחוק את הסיפור הזה?")) {
      deleteStoryFromDB(storyId);
    }
  }

  window.toggleStoryForm = function () {
    formSection.style.display = formSection.style.display === "none" ? "block" : "none";
  };

  window.hideStoryForm = function () {
    formSection.style.display = "none";
  };

  readStories(displayStories);
});
