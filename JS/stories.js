import { readStories, writeStory } from './firebase.js';

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
    const stories = Object.values(data || {}).sort((a, b) => b.timestamp - a.timestamp);
    stories.forEach(function (story, index) {
      addStoryToPage(story, index);
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
    content.textContent = storyObj.content;
    storyBox.appendChild(content);

    const author = document.createElement("h3");
    author.textContent = storyObj.name;
    storyBox.appendChild(author);

    // לא מציג כפתורי עריכה כי זה סיפור קבוע מה-DB
    storyList.appendChild(storyBox);
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

  // טוען את הסיפורים מה-Database ומציג אותם
  readStories(displayStories);
});
