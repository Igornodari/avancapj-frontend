// Environment para DESENVOLVIMENTO LOCAL
export const environment = {
	production: false,
	version: '0.0.1',
	envName: 'development',

	API: 'http://localhost:3000/api/',

	SHARED: '',
	wa: { phoneNumber: 0 },
	push: { vapidKey: 'YOUR_WEB_PUSH_VAPID_KEY' },
	bucketUrl: '',

	firebase: {
		apiKey: 'AIzaSyCnXn2b0LLcU_TfnhSct8LipDyqd7CudEo',
		authDomain: 'avan-8da0a.firebaseapp.com',
		projectId: 'avan-8da0a',
		storageBucket: 'avan-8da0a.firebasestorage.app',
		messagingSenderId: '403015638200',
		appId: '1:403015638200:web:79645e6739d0f8adcde84d',
		measurementId: 'G-LHEJEJFNDN',
	},
};
