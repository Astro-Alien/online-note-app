import Database from "./resources/database/database.js";
import "./components/edit-component/edit-component.js";
import "./components/note-component/note-component.js";
class ViewModel{
        constructor() {
            const db = new Database();
            db.connectToDB().then(database => globalThis.database = database);
        }
}
globalThis.viewModel = new ViewModel();