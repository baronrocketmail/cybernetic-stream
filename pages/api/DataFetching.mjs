import { initializeApp } from "firebase/app";
import {getFirestore, query, where, collection, getDocs , addDoc, serverTimestamp, doc, updateDoc, setDoc} from "firebase/firestore";

/// INITIALIZE fire FIREBASE and FIRESTORE
const firebaseConfig = {
    apiKey: "AIzaSyDPGmgTxlAsVkakZrGbs8NTF2r0RcWu_ig",
    authDomain: "luminous-lambda-364207.firebaseapp.com",
    projectId: "luminous-lambda-364207",
    storageBucket: "luminous-lambda-364207.appspot.com",
    messagingSenderId: "518969290682",
    appId: "1:518969290682:web:d7be744cb378ec83d4f783"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore()
///  INITIALIZE FIREBASE and FIRESTORE
/// FETCHING FUNCTIONS

const allUnitsCollection = collection(firestore, "/units/")

export async function fetchAllUnits() {
    return new Promise(function(resolve, reject) {
        getDocs(allUnitsCollection).then(snapshot => {
            let array = [];
            snapshot.forEach(elem => array.push(elem.id))
            resolve(fetchAllUnitsDataObj(array))
        })
    })
}

export async function fetchAllUnitsDataObj(idArray) {
    let returnObj = {};
    for (let elem in idArray) {
        let JSONstring = await getAllDataSpecificProperty(idArray[elem]).then(x=> JSON.stringify(x))
        returnObj[idArray[elem]] = JSON.parse(JSONstring)
    }
    return new Promise(function(resolve, reject) {
        resolve(returnObj)
    })
}

export async function getAllDataSpecificProperty(propertyID){
    let info = await getCollection(propertyID, "info").then((x)=> JSON.stringify(x))
    let payments = await getCollection(propertyID, "payments").then((x)=> JSON.stringify(x))

    return new Promise(function(resolve, reject){
        let returnObj = {info: JSON.parse(info) , payments: JSON.parse(payments) }
        resolve(returnObj)
    })
}

async function getCollection(propertyID, collectionID) {
    let returnObj = {}
    const querySnapshot = await getDocs(collection(firestore,'/units/' + propertyID+"/"+collectionID+"/"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        returnObj[doc.id] = doc.data()
    });
    return new Promise(function(resolve, reject){
        resolve(returnObj)
    })

}

export async function uploadStateChange(gridState){
    gridState.detailPanel.contentCache = {}
    await addDoc(collection(firestore, "websites/cybernetic stream/states"), {
        createdAt: serverTimestamp(),
        gridState: JSON.stringify(gridState),
    })
    console.log("SAVED")
    return new Promise(function (resolve, reject){
        resolve("saved")
    })
}

export async function uploadNewCellState(newCellState, oldCellState){
    for(let key in newCellState){
        if (newCellState[key] !== oldCellState[key]) {
            console.log(key)
            const docRef = doc(firestore, "units/"+newCellState.id+"/info/info");
            let update = { }
            update[key] = newCellState[key]
            console.log(update)
            await updateDoc(docRef, update)
        }
    }
}


