// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// קונפיג פרויקט
const firebaseConfig = {
  apiKey: "AIzaSyDvU6FD8BPqQ2VWPM-Z2JB2eNgJa1Cpc6U",
  authDomain: "arnon-memorial.firebaseapp.com",
  databaseURL: "https://arnon-memorial-default-rtdb.firebaseio.com",
  projectId: "arnon-memorial",
  storageBucket: "arnon-memorial.appspot.com",
  messagingSenderId: "1062552891836",
  appId: "1:1062552891836:web:d27b4da58b07891cc2fbb9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// התחברות אנונימית ברגע שהאתר נטען
signInAnonymously(auth).catch((error) => {
  console.error("שגיאה בהתחברות אנונימית:", error);
});

// פונקציות
function writeStory(title, content, name) {
  const storiesRef = ref(db, "stories");
  const newStoryRef = push(storiesRef);
  set(newStoryRef, {
    title,
    content,
    name
  });
}

function readStories(callback) {
  const storiesRef = ref(db, "stories");
  onValue(storiesRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data);
  });
}

function deleteStory(storyId) {
  const storyRef = ref(db, `stories/${storyId}`);
  remove(storyRef);
}

function updateStory(storyId, updatedData) {
  const storyRef = ref(db, `stories/${storyId}`);
  update(storyRef, updatedData);
}

export { auth, writeStory, readStories, deleteStory, updateStory };
