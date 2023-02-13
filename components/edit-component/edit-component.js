class EditComponent extends HTMLElement {
    #clickHandler;
    #action;
    #data;
    #recordIDHandler;
    #id;
    #title;
    #note;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        await this.load();
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        document.removeEventListener("recordID", this.#recordIDHandler);
        this.#clickHandler = null;
        this.#recordIDHandler = null;
        this.#action = null;
        this.#data = null;
        this.#id = null;
        this.#title = null;
        this.#note = null
    }

    async load() {
        this.worker = new Worker("./workers/database-worker.js");

        this.#clickHandler = this.#click.bind(this);
        this.shadowRoot.addEventListener("click", this.#clickHandler);

        this.#recordIDHandler = this.#get_record_id.bind(this);
        document.addEventListener("recordID", this.#recordIDHandler);

        this.#title = this.shadowRoot.querySelector("#title");
        this.#note = this.shadowRoot.querySelector("#note");
    }

    /**
     * @method When the user clicks on an element with a data-action attribute, call the function with the same name as the value
     * of the data-action attribute
     * @param event - The event object that was triggered.
     */
    async #click(event) {
        if (event.target.dataset.action) {
            await this[`${event.target.dataset.action}_record`](event);
        }
    }

    /**
     * @function get_record_id - The function gets the id of the record that was clicked on
     * @param event - The event object that was passed to the event handler.
     */
    async #get_record_id(event) {
        this.#id = event.detail;
    }

    /**
     * @function create_record -The function sends a message to the worker thread to create a new record in the database
     * @param event - The event object that was triggered.
     */
    async create_record(event) {
        this.#action = event.target.dataset.action;
        this.#data = {title: this.#title.value, note: this.#note.value};
        await this.requestAction();
    }

    /**
     * @function update_record - The function sends a message to the worker thread to update the record in the database
     */
    async update_record() {
        const data = {
            id: parseInt(this.#id),
            title: this.#title.value,
            note: this.#note.value
        }
        this.worker.postMessage({action: "update", data});
    }

    /**
     * @function delete_record - Send a message to the worker to delete the record with the id of this.#id.
     *
     */
    async delete_record() {
        this.worker.postMessage({action: "delete", data: this.#id});
    }

    /**
     * @function requestAction - The function sends a message to the worker, and when the worker responds, it dispatches a custom event
     */
    async requestAction() {
        const action = this.#action;
        const data = this.#data;
        this.worker.postMessage({action, data});
        this.worker.onmessage = function (event) {
            document.dispatchEvent(new CustomEvent('record', {detail: event.data, bubbles: true}));
        };
    }
}

customElements.define('edit-component', EditComponent);