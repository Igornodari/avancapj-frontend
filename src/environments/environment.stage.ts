// Environment para STAGE/TESTES
export const environment = {
	production: false,
	version: '0.0.1',
	envName: 'stage',

	// API Backend Stage (substitua pela URL do seu servidor de stage)
	API: 'https://api-stage.avancapj.com.br/',

	SHARED: '',
	wa: { phoneNumber: 0 },
	push: { vapidKey: 'YOUR_WEB_PUSH_VAPID_KEY_STAGE' },
	bucketUrl: '',

	// Firebase Stage (use projeto Firebase separado para stage se possível)
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
