import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { uid } from 'uid';
import {
	doc,
	DocumentReference,
	Firestore,
	getDoc,
	setDoc,
	collection,
	addDoc,
	collectionData,
	query,
	orderBy,
	limit,
	DocumentData,
	where,
	CollectionReference,
	getDocs,
	WhereFilterOp,
	startAfter,
	endBefore,
	getCountFromServer,
	onSnapshot,
	QueryConstraint,
	QuerySnapshot,
	deleteDoc,
} from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { Notifications } from '../layouts/full/header/header.data';

export type QueryOptions = {
	orderBy?: [string, 'asc' | 'desc'] | [string, 'asc' | 'desc'][];
	endAt?: any;
	startAfter?: any;
	limit?: number;
	where?: [string, WhereFilterOp, any | any[]] | [string, WhereFilterOp, any | any[]][];
};

export class FirestoreService {
	public firestore: Firestore = inject(Firestore);
	public auth: Auth = inject(Auth);
	public storage: Storage = inject(Storage);
	public document: CollectionReference<any>;
	public collectionName = '';
	constructor(config: { collectionName: string }) {
		this.collectionName = config.collectionName;
		this.document = collection(this.firestore, config.collectionName);
	}

	user$ = user(this.auth);

	getCollection(collectionName: string) {
		this.document = collection(this.firestore, collectionName);
		return this;
	}

	onSnapshotWithCondition(
		conditions: QueryConstraint[],
		callback: (snapshot: QuerySnapshot<DocumentData>) => void
	) {
		const q = query(this.document, ...conditions);
		return onSnapshot(q, callback);
	}

	async save(object: any, id?: any) {
		if (id) {
			const docRef = doc(this.firestore, this.collectionName, id);
			await setDoc(docRef, object);
			return { id };
		}

		return await addDoc(this.document, {
			...object,
			createdAt: new Date(),
			uid: uid(),
		});
	}

	async updateNotification(id: string, data: Partial<Notifications>) {
		const docRef = this.getDoc(id);
		await setDoc(docRef, data, { merge: true });
	}

	async markAsRead(id: string): Promise<void> {
		const docRef = this.getDoc(id);
		await setDoc(docRef, { isOpened: true }, { merge: true });
	}

	listemCollection = <T>(options?: any) => {
		const resultQuery = query<T, any>(this.document, orderBy('createdAt', 'asc'), limit(12));
		return collectionData<T>(resultQuery);
	};

	query<T>(options?: QueryOptions) {
		const queryParans = [];

		if (options?.orderBy) {
			if (Array.isArray(options.orderBy[0])) {
				options.orderBy.forEach(o => queryParans.push(orderBy(o[0], o[1] as 'asc' | 'desc')));
			} else {
				queryParans.push(orderBy(options.orderBy[0], options.orderBy[1] as 'asc' | 'desc'));
			}
		}
		if (options?.limit) {
			queryParans.push(limit(options.limit));
		}

		if (options?.where) {
			if (Array.isArray(options.where[0])) {
				options.where.forEach(w => queryParans.push(where(w[0], w[1] as WhereFilterOp, w[2])));
			} else {
				queryParans.push(
					where(options.where[0], options.where[1] as WhereFilterOp, options.where[2])
				);
			}
		}
		if (options?.startAfter) {
			queryParans.push(startAfter(options.startAfter));
		}

		if (options?.endAt) {
			queryParans.push(endBefore(options.endAt));
		}

		return query<T, any>(this.document, ...queryParans);
	}

	async getDocs<T>(options?: QueryOptions) {
		return getDocs(this.query<T>(options));
	}

	getDoc(id: string): DocumentReference<DocumentData> {
		return doc(this.firestore, this.collectionName, id);
	}

	async count(conditions: [string, WhereFilterOp, string | boolean][]) {
		const queryRoles = conditions.map(condition => where(...condition));
		const q = query(this.document, ...queryRoles);
		const snapshot = await getCountFromServer(q);
		return snapshot.data().count;
	}
	async deleteNotification(id: string): Promise<void> {
		const docRef = this.getDoc(id);
		await deleteDoc(docRef);
	}

	async getOne<T>(id: string): Promise<T | null> {
		const docRef = doc(this.firestore, this.collectionName, id);
		const docSnap = await getDoc(docRef);
		return docSnap.exists() ? ({ ...docSnap.data(), id } as T) : null;
	}

	async setDoc(id: any, data: any) {
		await setDoc(doc(this.firestore, this.collectionName, id), data);
	}

	async onSnapshot(callback: (snapshot: any) => void) {
		return onSnapshot(this.document, callback);
	}
}
