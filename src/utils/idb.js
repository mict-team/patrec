import { openDB } from "idb";

const dbPromise = _ => {
  if (!("indexedDB" in window)) {
    throw new Error("Browser does not support IndexedDB");
  }
  //console.log(openDB)

  return openDB("hosp_rev", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("outlet")) {
        db.createObjectStore("outlet").createIndex('outlet', 'outlet');
      }
      
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products").createIndex('revenue', 'revenue');
      }

      if (!db.objectStoreNames.contains("paymentMethods")) {
        db.createObjectStore("paymentMethods");
      }

      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users").createIndex('email', 'email');
      }

      if (!db.objectStoreNames.contains("billings")) {
        db.createObjectStore("billings").createIndex('code', 'code', { unique: true });
      }
    }
  });
};

const checkStorage = async storeName => {
  try {
    const db = await dbPromise();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);

    return store.get(storeName);
  } catch (error) {
    return error;
  }
};

const saveToStorage = async (storeName, tasks) => {
  try {
    //console.log(tasks)
    const db = await dbPromise();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    store.put(tasks, storeName);//

    return tx.complete;
  } catch (error) {
    return error;
  }
};

const updateSorage = async (storeName, indices, search, value)=> {
  try{
    const db = await dbPromise()
    
    const tx = db.transaction(storeName, 'readwrite')
    const index = tx.store.index('code');
    
    for await (const cursor of index.iterate(search)) {
      console(cursor.value)
      const found = { ...cursor.value };
      found=value;
      cursor.update(found);
    }
    await tx.done;
  }catch(error){
    return error
  }
}
export default {
  checkStorage,
  saveToStorage,
  updateSorage
};
