// vi: ft=html
import { updateDom } from '../lib/dom.js';
import { proxify } from '../lib/proxy.js';

 //   <style>
const getStyles = () => (`
    :host {
    }

    .container {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }

    form {
        display: flex;
        flex-direction: column;
        padding: 20px;
        min-height: 20px;
        border-radius: var(--border-radius);
        border: 2px solid var(--fg-col);
    }
`);
//    </style>

const getTemplate = (values) => (`
    <section class="container">
        <slot name="header"></slot>
        <form>
            <label for="test">Test</label>
            <input type="text" id="test" name="test" value="${values.test}">
        </form>
    </section>
`);

// <script>
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(getStyles());

export class ExampleForm extends HTMLElement {
    static observedAttributes = ['test:'];

    #values = {
        test: 'test',
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#values = proxify(this, this.#values);
    }

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
        this.render();
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this.#values[attr] = newValue;
    }

    render() {
        updateDom(this.shadowRoot, getTemplate(this.#values));
    }
}

if (!customElements.get('example-form')) {
    customElements.define('example-form', ExampleForm);
}
// </script>
