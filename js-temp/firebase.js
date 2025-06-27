import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// הגדרות Firebase שלך
const firebaseConfig = {
  apiKey: "AIzaSyDvU6FD8BPqQ2VWPM-Z2JB2eNgJa1Cpc6U",
  authDomain: "arnon-memorial.firebaseapp.com",
  projectId: "arnon-memorial",
  storageBucket: "arnon-memorial.appspot.com",
  messagingSenderId: "1062552891836",
  appId: "1:1062552891836:web:d27b4da58b07891cc2fbb9",
  measurementId: "G-4WGC7FTCHJ",
  databaseURL: "https://arnon-memorial-default-rtdb.firebaseio.com/"
};

// אתחול Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// פונקציה להוספת סיפור למסד הנתונים
export function writeStory(title, content, name) {
  const storiesRef = ref(database, 'stories');
  const newStoryRef = push(storiesRef);
  set(newStoryRef, {
    title: title,
    content: content,
    name: name,
    timestamp: Date.now()
  });
}

// פונקציה לשליפת כל הסיפורים
export function readStories(callback) {
  const storiesRef = ref(database, 'stories');
  onValue(storiesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}
// מחיקת סיפור
export function deleteStory(id) {
  const storyRef = ref(database, `stories/${id}`);
  set(storyRef, null); // מחיקה = קביעה לערך null
}

// עדכון סיפור
export function updateStory(id, updatedData) {
  const storyRef = ref(database, `stories/${id}`);
  set(storyRef, updatedData);
}
