importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

firebase.initializeApp({
	apiKey: 'AIzaSyBh9BFagm01LAQbRy3UStG7BKOxQqAD5Ms',
	authDomain: 'avancapj-d2395.firebaseapp.com',
	projectId: 'avancapj-d2395',
	messagingSenderId: '936844226111',
	appId: '1:936844226111:web:380e14a6701949336a128a',
	measurementId: 'G-S09XWGG17S',
});

const messaging = firebase.messaging();
