importScripts("./resources/database/database.js");
/**
 * @class DatabaseWorker - Worker for database wrapper class
 *
 * feature: class database is a wrapper class for IndexedDB
 *
 * @method #create {object} - creates a record in the store by calling the globalThis.database.create method
 * @method #read {string/integer}- reads a record from the store by calling the globalThis.database.read method
 * @method #update {object}- updates a record in the store by calling the globalThis.database.update method
 * @method #deleteRecord {string/integer}- deletes a record from the store by calling the globalThis.database.deleteRecord method

 */
class DatabaseWorker {
    /**
     * @method It creates a record
     * @param record - The record to be created.
     * @returns The return value of the create method of the database object.
     */
    async #create(record) {
        return globalThis.database.create(record);
    }

    /**
     * "Read a record from the database."
     *
     * The first line of the function is a comment. Comments are ignored by the JavaScript interpreter. They are used to
     * explain what the code is doing
     * @param id - The id of the record to read.
     * @returns The read method is being returned.
     */
    async #read(id) {
        return globalThis.database.read(id);
    }

    /**
     * @method It updates a record in the database.
     * @param record - The record to update.
     * @returns The return value of the update() method of the database object.
     */
    async #update(record) {
        return globalThis.database.update(record);
    }

    /**
     * @method This function deletes a record from the database
     * @param id - The id of the record to delete.
     * @returns The result of the deleteRecord function.
     */
    async #deleteRecord(id) {
        return globalThis.database.deleteRecord(id);
    }

    /**
     * @method This function creates a new postMessage object and sends it to the main thread.
     * @param data - The message to send
     */
    async createPosting(data) {
        console.log("I have reached the create postMessage method");
    }

    /**
     * @method This function filters records from the database. and creates a new postMessage object and sends it to the main thread.
     * @param data - The data that is being read.
     */
    async readPosting(data) {
        console.log("I have reached the read postMessage method");
    }

    /**
     * @method This function updates a record in the database and creates a new postMessage object and sends it to the main thread.
     * @param data - The data to be updated.
     */
    async updatePosting(data) {
        console.log("I have reached the update postMessage method");
    }

    /**
     * @method This function deletes a posting from the database and creates a new postMessage object and sends it to the main thread.
     * @param data - {
     */
    async deletePosting(data) {
        console.log("I have reached the delete postMessage method");
    }
}

self.onmessage = async (event) => {
    console.log("I heard you from the web worker")
    const dbWorker = new DatabaseWorker();
    const {action, data} = event.data;

    if (action) {
        await dbWorker[`${action}Posting`](data);
    }
}