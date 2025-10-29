export const environment = {
	production: true,
	version: '0.0.1',
	API: 'http://localhost:3001/', // <- your backend base URL
	SHARED: '',
	wa: { phoneNumber: 0 },
	push: { vapidKey: 'YOUR_WEB_PUSH_VAPID_KEY' },
	bucketUrl: '',
	firebase: {
		apiKey: 'AIzaSyBh9BFagm01LAQbRy3UStG7BKOxQqAD5Ms',
		authDomain: 'avancapj-d2395.firebaseapp.com',
		projectId: 'avancapj-d2395',
		storageBucket: 'avancapj-d2395.firebasestorage.app',
		messagingSenderId: '936844226111',
		appId: '1:936844226111:web:380e14a6701949336a128a',
		measurementId: 'G-S09XWGG17S',
	},
};
