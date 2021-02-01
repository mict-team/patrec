import { openDB } from "idb";

const dbPromise = _ => {
  if (!("indexedDB" in window)) {
    throw new Error("Browser does not support IndexedDB");
  }
  //console.log(openDB)

  return openDB("patrec", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("outlet")) {
        db.createObjectStore("outlet").createIndex('outlet', 'outlet', { unique: true });
      }
      
      if (!db.objectStoreNames.contains("departments")) {
        db.createObjectStore("departments").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("chats")) {
        db.createObjectStore("chats").createIndex('id', 'id', { unique: true });
      }
      
      if (!db.objectStoreNames.contains("platforms")) {
        db.createObjectStore("platforms").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("transactions")) {
        db.createObjectStore("transactions").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("drugs")) {
        db.createObjectStore("drugs").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("paymentMethods")) {
        db.createObjectStore("paymentMethods").createIndex('id', 'id', { unique: true });
      }

      if (!db.objectStoreNames.contains("carts")) {
        db.createObjectStore("carts").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("patients")) {
        db.createObjectStore("patients").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users").createIndex('id', 'id', { unique: true });
      }

      if (!db.objectStoreNames.contains("roles")) {
        db.createObjectStore("roles").createIndex('id', 'id', { unique: true });
      }

      if (!db.objectStoreNames.contains("group")) {
        db.createObjectStore("group").createIndex('id', 'id', { unique: true });
      }

      if (!db.objectStoreNames.contains("schemes")) {
        db.createObjectStore("schemes").createIndex('id', 'id', { unique: true });
      }

      if (!db.objectStoreNames.contains("register")) {
        db.createObjectStore("register").createIndex('id', 'id', { unique: true });
      }

      if (!db.objectStoreNames.contains("schedules")) {
        db.createObjectStore("schedules").createIndex('code', 'code', { unique: true });
      }
      
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("returned")) {
        db.createObjectStore("returned").createIndex('code', 'code', { unique: true });
      }

      if (!db.objectStoreNames.contains("requisition")) {
        db.createObjectStore("requisition").createIndex('code', 'code', { unique: true });
      }

      if(!db.objectStoreNames.contains("packeditems")){
        db.createObjectStore("packeditems").createIndex('code', 'code', { unique: true });
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
