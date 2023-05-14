import firebase from "firebase/compat";
import {Book} from "../types/book";

export const collectionRefs = async (firestore: firebase.firestore.Firestore) => {
    const refs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[] = []
    const currentYear = new Date().getFullYear()

    const fetchPromises = []
    for (let year = currentYear; year >= 1800; year--) {
        const collectionRef = firestore.collection(year.toString())
        fetchPromises.push(collectionRef.get())
    }

    const booksWithoutYearCollectionRef = firestore.collection("Books without a year")
    fetchPromises.push(booksWithoutYearCollectionRef.get())

    const snapshots = await Promise.all(fetchPromises)

    snapshots.forEach((snapshot, index) => {
        const year = currentYear - index
        if (!snapshot.empty && year >= 1800) {
            const collectionRef = firestore.collection(year.toString())
            refs.push(collectionRef)
        }
    });

    refs.push(booksWithoutYearCollectionRef)

    return refs
}

export async function fetchBooks(collectionRefs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>[]) {
    try {
        const fetchedData = await Promise.all(collectionRefs.map((ref) =>
            ref.get().then((snapshot: { docs: any[] }) => snapshot.docs.map((doc) => doc.data() as Book))
        ));
        return fetchedData.flat()
    } catch (error) {
        console.error(error)
        return []
    }
}