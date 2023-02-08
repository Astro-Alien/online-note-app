class EditComponent extends HTMLElement {
    #clickHandler;
    #action;
    #dispatchHandler;

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
        this.#clickHandler = null;
        this.#action = null;
    }

    async load() {
        this.#dispatchHandler = this.requestAction.bind(this);
        this.#clickHandler = this.#click.bind(this);
        this.shadowRoot.addEventListener("click", this.#clickHandler);
    }

    /**
     * @method When the user clicks on an element with a data-action attribute, call the function with the same name as the value
     * of the data-action attribute
     * @param event - The event object that was triggered.
     */
    async #click(event) {
        if (event.target.dataset.action) {
            await this[event.target.dataset.action]();
        }
    }

    /**
     * The create function calls the requestAction method and request a record to be created.
     */
    async create() {
        this.#action = "create";
        await this.requestAction();
    }

    /**
     * The retrieve() function calls the requestAction method and request a record to be read.
     */
    async read() {
        this.#action = "read";
        await this.requestAction();
    }

    /**
     * The update function calls the requestAction method and request a record to be updated.
     */
    async update() {
        this.#action = "update";
        await this.requestAction();
    }

    /**
     * The delete method calls the requestAction method and request a record to be deleted.
     */
    async delete() {
        this.#action = "delete";
        await this.requestAction();
    }

    /**
     * the requestAction method creates a new postMessage object and sends it to the database-worker.
     */
    async requestAction() {
        const worker = new Worker("./workers/database-worker.js");
        const action= this.#action;
        const data = {
            title: "test title",
            note: "test note"
        }
        //self.parent.postMessage({action,data});
        worker.postMessage({action,data});
    }
}
customElements.define('edit-component', EditComponent);