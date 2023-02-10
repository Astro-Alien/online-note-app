class NoteComponent extends HTMLElement {
    #eventHandler;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        this.#eventHandler = this.get_id.bind(this);
        document.addEventListener("id", this.#eventHandler);
    }

    async disconnectedCallback() {

    }

    async get_id(event) {
        console.log(event.detail);
    }
}
customElements.define('note-component', NoteComponent);