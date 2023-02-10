class EditComponent extends HTMLElement {
    #clickHandler;
    #action;
    #dispatchHandler;
    #data;

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
        this.#data = null;
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
            const title = this.shadowRoot.querySelector("#title").value;
            const note = this.shadowRoot.querySelector("#note").value;
            this.#action = event.target.dataset.action;
            this.#data = {title, note};
            await this.requestAction();
        }
    }

    async requestAction() {
        const worker = new Worker("./workers/database-worker.js");
        const action = this.#action;
        const data = this.#data;
        worker.postMessage({action, data});
        worker.onmessage = function (message) {
            this.dispatchEvent(new CustomEvent("recordID", {detail: message.data?.id, composed: true, bubbles: true}))
        }
    }
}

customElements.define('edit-component', EditComponent);