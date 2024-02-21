// vi: ft=html
import { proxify } from '../lib/proxy.js';

 //   <style>
const getStyles = () => (`
    :host {
    }

    .container {
        max-width: 400px;
        margin: 0 auto;
    }
`);
//    </style>

const getTemplate = (values) => (`
    <section class="container">
        <example-form form:='${JSON.stringify(values.form)}' onformsubmit="onSubmit">
            <h2 slot="header">Example Form</h2>
        </example-form>
        <slot name="results-header"></slot>
        <pre>${values.formatted}</pre>
    </section>
`)


// <script>
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(getStyles());

export class FormPage extends HTMLElement {
    #values = {
        form: {},
        formatted: '',
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#values = proxify(this, this.#values);
    }

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = getTemplate(this.#values);
    }

    onSubmit(event) {
        this.#values.form = event.detail;
        this.#values.formatted = JSON.stringify(event.detail, null, 2);
    }
}

// </script>
