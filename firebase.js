import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

// Add Firebase products that you want to use
import {
  getFirestore,
  getDocs,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr3V4xwWEP0yTdYRcvt4vzuKNdUAEB5bI",

  authDomain: "kapallawd-40b01.firebaseapp.com",

  projectId: "kapallawd-40b01",

  storageBucket: "kapallawd-40b01.appspot.com",

  messagingSenderId: "383307595328",

  appId: "1:383307595328:web:e3cf259d7c707e9de629a5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gpsRef = collection(db, "gps");

function addTrajectory() {
  const docs = getDocs(collection(db, "gps"));

  const loc = [];
  docs.then((q) => {
    q.forEach((doc) => {
      loc.push([doc.data().loc._lat, doc.data().loc._long]);
    });
    for (let i = 0; i < loc.length - 1; i++) {
      const offset = cor_to_px(
        loc[i][0],
        loc[i][1],
        loc[i + 1][0],
        loc[i + 1][1]
      );
      addNewPoint(offset[0], offset[1]);
    }
  });
}

async function updateRecentLoc() {
  const q = query(gpsRef, orderBy("timestamp", "desc"), limit(2));

  const unsubscribe = onSnapshot(q, (data) => {
    let result = [];
    data.forEach((doc) => {
      console.log(doc.data());
      result.push(doc.data());
    });
    updateLocData(
      result[1].loc._lat,
      result[1].loc._long,
      result[0].loc._lat,
      result[0].loc._long,
      result[0].speed
    );
    addTrajectory();
  });

  // const data = await getDocs(q);
}

updateRecentLoc();
