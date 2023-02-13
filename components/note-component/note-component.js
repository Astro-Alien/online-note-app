class NoteComponent extends HTMLElement {
    #eventHandler;
    #clickHandler;
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

        this.worker = new Worker("./workers/database-worker.js");

        this.worker.postMessage({action: "getAll"});
        this.worker.onmessage = this.#get_all_data.bind(this);

        this.#eventHandler = this.#get_record.bind(this);
        document.addEventListener("record", this.#eventHandler);

        this.#clickHandler = this.#get_id.bind(this);
        this.shadowRoot.querySelector("#note-list").addEventListener("click", this.#clickHandler);
    }

    async disconnectedCallback() {
        document.removeEventListener("record", this.#eventHandler);
        this.shadowRoot.querySelector("#note-list").removeEventListener("click", this.#clickHandler);
        this.#content = null;
        this.#eventHandler = null;
        this.#clickHandler = null;
        this.#id = null;
    }

    async #get_id(event) {
        if(event.target.dataset.id){
            this.#id = event.target.dataset.id;
            document.dispatchEvent(new CustomEvent('recordID', {detail: this.#id, bubbles: true}));
        }
    }

    async #get_record(event) {
        this.#content = [event.detail];
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
            clone.querySelector("summary").setAttribute("data-id", item.id);
            container.appendChild(clone);
        });
    }

}

customElements.define('note-component', NoteComponent);