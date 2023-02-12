class NoteComponent extends HTMLElement {
    #eventHandler;
    #id;
    #content;

    get content() {
        return this.#content;
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.#eventHandler = this.#set_id.bind(this);
        document.addEventListener("recordID", this.#eventHandler);
        this.worker = new Worker("./workers/database-worker.js");

        this.worker.postMessage({action: "getAll"});
        this.worker.onmessage = this.#get_all_data.bind(this);
    }

    async disconnectedCallback() {
        document.removeEventListener("recordID", this.#eventHandler);
        this.#id = null
        this.#content = null;
        this.#eventHandler = null;
    }

    async #set_id(event) {
        this.#id = event.detail;
        await this.#get_record();
    }

    async #get_record() {
        this.worker.postMessage({action: "read", data: this.#id});
        this.worker.onmessage = this.#get_data.bind(this);
    }

    async #get_data(event) {
        this.#content = [event.data];
        await this.#render_all_data();
    }

    async #get_all_data(event) {
        this.#content = event.data;
        if (this.content.length > 0) {
            await this.#render_all_data();
        }
    }

    async #render_all_data() {
        const template = this.shadowRoot.querySelector("#note");
        const container = this.shadowRoot.querySelector("#note-list");

        this.content.forEach(function (item) {
            const clone = template.content.cloneNode(true);
            clone.querySelector("summary").textContent = item.title;
            clone.querySelector("p").textContent = item.note;
            clone.querySelector("#details").setAttribute("data-id", item.id);
            container.appendChild(clone);
        });
    }

}

customElements.define('note-component', NoteComponent);