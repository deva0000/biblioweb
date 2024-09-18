// Replace with your actual Firestore API key
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    databaseURL: `https://your-project-id.firebaseio.com` // Optional, but recommended
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get a reference to the Firestore database
  const db = firebase.firestore();
  
  // Function to read entries from Firestore
  function readEntries() {
    db.collection('entries').get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          // Display the data on your page
        });
      })
      .catch(error => {
        console.error("Error getting documents: ", error);
      });
  }
  
  // Function to create a new entry in Firestore
  function createEntry(entryData) {
    db.collection('entries').add(entryData)
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  }
  
  // Example usage:
  readEntries();
  
  // Add an event listener to a button or form to create new entries
  // ...
  