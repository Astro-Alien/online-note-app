import Database from "./resources/database/database.js";
class ViewModel{
        constructor() {
            const db = new Database();
            db.connectToDB().then(database => globalThis.database = database);
        }
}
globalThis.viewModel = new ViewModel();