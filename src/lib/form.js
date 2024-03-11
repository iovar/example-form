export const getFormValue = (form, name, defaultValue) => {
    const path = name.split('.');

    if (path.length > 1) {
        const value = path.reduce((acc, key) => acc?.[key], form);
        return value ?? defaultValue;
    }

    return form[name] ?? defaultValue;
};

const arrayRegex = /\[([0-9]+)\]/;
const objectRegex = /\.[a-z]+$/;

export const addKeyMutate = (obj, key, value) => {
    const isArray = key.match(arrayRegex);
    const isObject = key.match(objectRegex);

    if (isArray) {
        const arrayKey = key.replace(arrayRegex, '');
        const arrayIndex = key.match(arrayRegex)[1];
        obj[arrayKey] = obj[arrayKey] ?? [];
        obj[arrayKey][arrayIndex] = value;
    } else if (isObject) {
        const objectKey = key.replace(objectRegex, '');
        const objectSubKey = key.match(objectRegex)[0].replace(/^\./, '');
        obj[objectKey] = obj[objectKey] ?? {};
        obj[objectKey][objectSubKey] = value;
    } else {
        obj[key] = value;
    }
};

export const formToObject = (form) => {
    const formData = new FormData(form);
    const values = {};

    for (const [key, value] of formData.entries()) {
        if (values[key] === undefined) {
            addKeyMutate(values, key, value);
        } else if (Array.isArray(values[key])) {
            values[key].push(value);
        } else {
            values[key] = [values[key], value];
        }
    }

    return values;
}
