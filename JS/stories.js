document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("storyForm");
  var storyList = document.getElementById("storyList");

  // טען סיפורים מהאחסון
  var stories = JSON.parse(localStorage.getItem("stories") || "[]");
  stories.forEach(function (story, i) {
    addStoryToPage(story, i);
  });

  // שליחת סיפור חדש
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("name").value.trim();
    var story = document.getElementById("story").value.trim();

    if (name && story) {
      var newStory = { name: name, text: story };
      stories.unshift(newStory);
      localStorage.setItem("stories", JSON.stringify(stories));
      displayStories();
      form.reset();
    }
  });

  // הצגת כל הסיפורים מחדש
  function displayStories() {
    storyList.innerHTML = "";
    stories.forEach(function (story, i) {
      addStoryToPage(story, i);
    });
  }

  // פונקציה שמוסיפה סיפור ל־DOM
  function addStoryToPage(storyObj, index) {
    var storyBox = document.createElement("div");
    storyBox.className = "story-box";

    var title = document.createElement("h3");
    title.textContent = storyObj.name;

    var content = document.createElement("p");
    content.textContent = storyObj.text;

    // כפתור מחיקה – יוצג רק במצב עריכה
    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", function () {
      const confirmDelete = confirm("האם את בטוחה שברצונך למחוק את הסיפור?");
      if (!confirmDelete) return;

      stories.splice(index, 1);
      localStorage.setItem("stories", JSON.stringify(stories));
      displayStories();
    });

    var controlWrapper = document.createElement("span");
    controlWrapper.className = "edit-controls";
    controlWrapper.style.display = isEditMode() ? "inline" : "none";
    controlWrapper.appendChild(deleteBtn);

    storyBox.appendChild(controlWrapper);
    storyBox.appendChild(title);
    storyBox.appendChild(content);

    storyList.appendChild(storyBox);
  }
});
