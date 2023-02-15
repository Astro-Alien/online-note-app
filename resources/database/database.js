/**
 * @class Database
 * @description Database class that is responsible for connecting to the database and wraps indexDB operations for CRUD operations,
 * and filtering
 *
 * Fields required in the store are:
 * id - the id of the record
 * title - the title of the record
 * note - the note of the record
 *
 * Methods required:
 * connectToDB - class that can be called from outside to connect to the database
 * connect() - creates a database if it doesn't exist and connects to the store for further operations
 * disconnect() - disconnects from the data store
 * create() - creates a record in the store
 * read() - reads a record from the store based on the id
 * update() - updates a record in the store based on the id
 * delete() - deletes a record from the store based on the id
 * filter() - filters records from the store based on the filter object
 * */
class Database {
    #databaseName = "notes";
    #storeName = "notes";
    #database = null;

    hello() {
        console.log("hello")
    }
    /**
     * > This function creates a new instance of the Database class, connects to the database, and returns the instance
     * @returns The database instance.
     */
    async connectToDB() {
        const databaseInstance = new Database();
        await databaseInstance.#connect();
        return databaseInstance;
    }

    async dispose() {
        this.#databaseName = "notes";
        this.#storeName = "notes";
        this.#database = null;
    }

    /**
     * creates a database if it doesn't exist or opens one if it does and
     * connects to the store for further operations
     */
    #connect() {
        return new Promise((resolve, reject) => {
            const indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
            const request = indexedDB.open(this.#databaseName, 1);

            request.onerror = (event) => {
                console.error("An error has occurred while trying to connect to the database: ", event);
                reject(event);
            };

            request.onsuccess = (event) => {
                this.#database = event.target.result;
                resolve(event);
                console.log("Successfully connected to the database...");
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const store = db.createObjectStore(this.#storeName, {keyPath: "id", autoIncrement: true});

                store.createIndex("title", "title", {unique: false});
                store.createIndex("note", "note", {unique: false});
            };
        });
    }

    /**
     * disconnects from the data store
     */
    #disconnect() {
        if (this.#database) {
            this.#database.close();
            this.#database = null;
        }
    }

    /**
     * > This function is asynchronous and performs a database operation and can be called by the CRUD methods
     */
    async #transactionsOperation(callback) {
        return new Promise((resolve, reject) => {
            const transaction = this.#database.transaction([this.#storeName], "readwrite");
            const store = transaction.objectStore(this.#storeName);

            const request = callback(store);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    /**
     * creates a record in the store
     */
    create(record) {
        return this.#transactionsOperation((store) => {
            return store.add(record);
        });
    }

    /**
     * reads a record from the store based on the id
     */
    read(id) {
        return this.#transactionsOperation((store) => {
            return store.get(id);
        });
    }

    /**
     * updates a record in the store based on the id
     */
    update(record) {
        return this.#transactionsOperation((store) => {
            return store.put(record);
        });
    }

    /**
     * deletes a record from the store based on the id
     */
    deleteRecord(id) {
        return this.#transactionsOperation((store) => {
            return store.delete(id);
        });
    }

    /**
     * get all records from the store
     */
    getAll() {
        return this.#transactionsOperation((store) => {
            return store.getAll();
        });
    }
}
globalThis.viewModel =  new Database();
