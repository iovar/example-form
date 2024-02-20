// vi: ft=html
import { updateDom } from '../lib/dom.js';
import { proxify } from '../lib/proxy.js';

 //   <style>
const getStyles = () => (`
    :host {
    }

    .container { width: 100%; }

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
        <form onsubmit="this.getRootNode().host.submit(event, this)">
            <label>
                Test
                <input type="text" name="test" value="${values.form.test}">
            </label>
            <label>
                nested A
                <input type="text" name="nested.a">
            </label>
            <label>
                nested B
                <input type="text" name="nested.b">
            </label>

            <label>
                Array [0]
                <input type="text" name="array[0]">
            </label>

            <label>
                Array [1]
                <input type="text" name="array[1]">
            </label>

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

const addKeyMutate = (obj, key, value) => {
    const isArray = key.match(/\[[0-9]+\]$/);
    const isObject = key.match(/\.[a-z]+$/);

    if (isArray) {
        const arrayKey = key.replace(/\[[0-9]+\]$/, '');
        const arrayIndex = key.match(/\[([0-9]+)\]$/)[1];
        if (!obj[arrayKey]) {
            obj[arrayKey] = [];
        }
        obj[arrayKey][arrayIndex] = value;
    } else if (isObject) {
        const objectKey = key.replace(/\.[a-z]+$/, '');
        const objectSubKey = key.match(/\.[a-z]+$/)[0].replace(/^\./, '');
        if (!obj[objectKey]) {
            obj[objectKey] = {};
        }
        obj[objectKey][objectSubKey] = value;
    } else {
        obj[key] = value;
    }
};

export class ExampleForm extends HTMLElement {
    static observedAttributes = ['test:', 'onsubmit'];

    #values = {
        form: { test: 'test' },
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

    submit(event, form) {
        event.preventDefault();
        const elements= event.currentTarget.elements;
        const values = {};
        for (let i = 0; i < elements.length; i++) {
            const isMultiSelect = elements[i].tagName === 'SELECT' && elements[i].multiple;

            let currentValue = isMultiSelect
                ? Array.from(elements[i].selectedOptions).map((v) => v.value)
                : elements[i].value;

            addKeyMutate(values, elements[i].name, currentValue);
        }

        this.dispatchEvent(new CustomEvent('submit', { detail: values }));
    }
}

// </script>
