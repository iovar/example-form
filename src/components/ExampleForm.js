// vi: ft=html
import { updateDom } from 'lib/dom.js';
import { formToObject, getFormValue } from 'lib/form.js';
import { proxify } from 'lib/proxy.js';

 //   <style>
const getStyles = () => (`
    :host {
    }

    .container { width: 100%; }

    form, fieldset {
        display: flex;
        flex-direction: column;
        padding: 20px;
        min-height: 20px;
        border-radius: var(--border-radius);
        border: 2px solid var(--fg-col);
    }

    :invalid {
        border-color: red;
    }

    :valid {
        border-color: green;
    }
`);
//    </style>

const getTemplate = (values) => (`
    <section class="container">
        <slot name="header"></slot>
        <form onsubmit="this.getRootNode().host.submit(event, this)">
            <label>
                Test
                <input type="text" name="test" value="${getFormValue(values.form, 'test', '')}">
            </label>
            <fieldset >
                <legend>Nested</legend>
                <label>
                    nested A
                    <input type="text" name="nested.a" value="${getFormValue(values.form, 'nested.a', '')}">
                </label>
                <label>
                    nested B
                    <input disabled required type="text" minlength="4" name="nested.b" value="${getFormValue(values.form, 'nested.b', '')}">
                </label>
                <label>
                    nested C
                    <input type="email" name="nested.c" value="${getFormValue(values.form, 'nested.c', '')}">
                </label>
                <label>
                    nested D
                    <input type="url" name="nested.d">
                </label>
            </fieldset>

            <fieldset>
                <legend>Array element</legend>
                <label>
                    Array [0]
                    <input disabled type="text" pattern="ab[cd]" name="array[0]">
                </label>

                <label>
                    Array [1]
                    <input type="text" name="array[1]">
                </label>

                <label>
                    Array [2]
                    <input type="number" step="3" min="10" max="20" name="array[2]">
                </label>
            </fieldset>

            <label>
                Multi Select
                <select name="multi" multiple>
                    <optgroup label="Group 1">
                        <option value="a">A</option>
                        <option value="b">B</option>
                    </optgroup>
                    <optgroup label="Group 2">
                        <option value="c">C</option>
                        <option value="d">D</option>
                    </optgroup>
                </select>
            </label>
            <br />

            <button type="submit">Submit</button>
        </form>
    </section>
`);

// <script>
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(getStyles());

export class ExampleForm extends HTMLElement {
    static observedAttributes = ['form:', 'onformsubmit'];

    #values = { form: {} }

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

    submit(event, form) {
        event.preventDefault();
        const values = formToObject(form);
        this.dispatchEvent(new CustomEvent('formsubmit', { detail: values }));
    }
}

// </script>
