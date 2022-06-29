importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyDHXdjVllGxZ_nTbzV4guj3DmnUoZlDGNU",
    authDomain: "spotlight-f6663.firebaseapp.com",
    projectId: "spotlight-f6663",
    storageBucket: "spotlight-f6663.appspot.com",
    messagingSenderId: "825975225494",
    appId: "1:825975225494:web:4c37260f2e5f2496fc16b7",
    measurementId: "G-L0L8JRZ4EK",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log("Message received.", payload);
    const title = "Hello world is awesome";
    const options = {
        body: "Your notificaiton message .",
        icon: "/images/logo.png",
    };
    return self.registration.showNotification(title, options);
});

// [END messaging_on_background_message]
