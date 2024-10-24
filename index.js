// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import express from "express";
import path from "path";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr3V4xwWEP0yTdYRcvt4vzuKNdUAEB5bI",
  authDomain: "kapallawd-40b01.firebaseapp.com",
  projectId: "kapallawd-40b01",
  storageBucket: "kapallawd-40b01.appspot.com",
  messagingSenderId: "383307595328",
  appId: "1:383307595328:web:e3cf259d7c707e9de629a5",
};
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const web = express();
const storage = getStorage();

const listRef = ref(storage, "files/uid");

web.use(express.static(path.join(".")));
web.get("/gambar-misi", async (req, res) => {
  try {
    // Helper function to get the most recent image URL from a specified folder
    async function getMostRecentImageUrl(folder) {
      const listRef = ref(storage, folder);
      const files = await listAll(listRef);

      if (files.items.length === 0) {
        return null;
      }

      // Sort items based on their names or other criteria (Firebase Storage client SDK doesn't support timeCreated directly)
      const sortedItems = files.items.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Get the most recent file (adjust sorting as needed)
      const recentFileRef = sortedItems[sortedItems.length - 1]; // Assuming the last item is the most recent

      // Get the download URL for the most recent file
      const url = await getDownloadURL(recentFileRef);

      return url;
    }

    // Get the recent images from both folders
    const overwaterImageUrl = await getMostRecentImageUrl("Atas");
    const underwaterImageUrl = await getMostRecentImageUrl("Bawah");

    // Construct the response
    const response = {
      overwater: overwaterImageUrl,
      underwater: underwaterImageUrl,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching recent images:", error);
    res.status(500).json({ error: "Failed to retrieve images" });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
web.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
