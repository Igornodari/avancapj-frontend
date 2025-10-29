import { inject, Injectable } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { deleteToken, getMessaging, getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { Router } from '@angular/router';
import { onBackgroundMessage } from 'firebase/messaging/sw';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	messaging: Messaging = inject(Messaging);
	firestore: Firestore = inject(Firestore);
	router: Router = inject(Router);
	vapidKey =
		'BDP9UQa4YlR9NyXyBQC3TDz5uPAA8tVnYLS2MMWiAmjcTh5jlffHKxe6B_9XH2WL0fT06c-_gibI9uUWPtNP7sU';

	requestNotificationsPermissions = async () => {
		Notification.requestPermission().then(permission => {
			if (permission === 'granted') {
				console.log('Notification permissions granted.');
			}
		});
	};

	saveMessagingDeviceToken = async (uid: string) => {
		try {
			const dashboardToken = await getToken(this.messaging, {
				vapidKey: environment.push.vapidKey,
			});

			if (dashboardToken) {
				const tokenRef = doc(this.firestore, 'fcmTokens', uid);
				await setDoc(tokenRef, {
					dashboardToken,
				});
			} else {
				this.requestNotificationsPermissions();
			}
		} catch (error) {
			console.error('Unable to get messaging token.', error);
		}
	};

	async disableNotification() {
		return deleteToken(this.messaging).then();
	}
}
