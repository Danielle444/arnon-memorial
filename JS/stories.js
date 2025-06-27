document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("storyForm");
  const storyList = document.getElementById("storyList");
  const formSection = document.getElementById("storyFormSection");

  let stories = JSON.parse(localStorage.getItem("stories") || "[]");

  displayStories();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const text = document.getElementById("story").value.trim();
    const name = document.getElementById("name").value.trim();

    if (name && text) {
      const newStory = { name, text };
      if (title) newStory.title = title;

      stories.unshift(newStory);
      localStorage.setItem("stories", JSON.stringify(stories));
      displayStories();
      form.reset();
      hideStoryForm();
    }
  });

  function displayStories() {
    storyList.innerHTML = "";
    stories.forEach(function (story, i) {
      addStoryToPage(story, i);
    });
  }

  function addStoryToPage(storyObj, index) {
    const storyBox = document.createElement("div");
    storyBox.className = "story-box";

    if (storyObj.title) {
      const storyTitle = document.createElement("h4");
      storyTitle.textContent = storyObj.title;
      storyBox.appendChild(storyTitle);
    }

    const content = document.createElement("p");
    content.textContent = storyObj.text;
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
          stories.splice(index, 1);
          localStorage.setItem("stories", JSON.stringify(stories));
          displayStories();
        }
      });

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏";
      editBtn.className = "edit-controls edit-btn";
      editBtn.title = "ערוך סיפור";

      editBtn.addEventListener("click", function () {
        showEditFormInside(storyBox, storyObj, index);
      });

      controls.appendChild(editBtn);
      controls.appendChild(deleteBtn);
      storyBox.appendChild(controls);
    }

    storyList.appendChild(storyBox);
  }

  function showEditFormInside(container, storyObj, index) {
    container.innerHTML = "";

    const form = document.createElement("form");
    form.className = "inner-edit-form";

    // כותרת
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "כותרת:";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = storyObj.title || "";

    // סיפור
    const storyLabel = document.createElement("label");
    storyLabel.textContent = "סיפור:";
    const storyInput = document.createElement("textarea");
    storyInput.rows = 5;
    storyInput.value = storyObj.text;

    // שם
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "שם:";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = storyObj.name || "";

    // כפתורים
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

    // סדר נכון של רכיבים
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(storyLabel);
    form.appendChild(storyInput);
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(buttonsWrapper);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const newName = nameInput.value.trim();
      const newText = storyInput.value.trim();
      const newTitle = titleInput.value.trim();

      if (!newName || !newText) {
        alert("שם וסיפור לא יכולים להיות ריקים.");
        return;
      }

      stories[index].name = newName;
      stories[index].text = newText;
      stories[index].title = newTitle || undefined;

      localStorage.setItem("stories", JSON.stringify(stories));
      displayStories();
    });

    container.appendChild(form);
  }

  window.toggleStoryForm = function () {
    if (
      formSection.style.display === "none" ||
      formSection.style.display === ""
    ) {
      formSection.style.display = "block";
    } else {
      formSection.style.display = "none";
    }
  };

  window.hideStoryForm = function () {
    formSection.style.display = "none";
  };

  window.refreshStories = displayStories;
});
