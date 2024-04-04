export const getFormValue = (form, name, defaultValue) => {
    const path = name.split('.');

    if (path.length > 1) {
        const value = path.reduce((acc, key) => acc?.[key], form);
        return value ?? defaultValue;
    }

    return form[name] ?? defaultValue;
};

const deepSet = (obj, key, value) => {
    const path = key.split(/(\[[^\]]+\])|\./g).filter(s => !!s);

    if (path.length === 1) {
        obj[path] = value;
    } else if (path.length > 1 && path[1].startsWith('[') && path[1].endsWith(']')) {
        obj[path[0]] = obj[path[0]] ?? [];
        obj[path[0]][path[1].slice(1, -1)] = value;
        return;
    } else if (path.length > 1) {
        obj[path[0]] = obj[path[0]] ?? {};
        deepSet(obj[path[0]], path.slice(1).join('.'), value);
    }
}

export const formToObject = (form) => {
    const formData = new FormData(form);
    const values = {};

    for (const [key, value] of formData.entries()) {
        if (values[key]) {
            if (Array.isArray(values[key])) {
                values[key].push(value);
            } else {
                values[key] = [values[key], value];
            }
        } else {
            deepSet(values, key, value);
        }
    }

    return values;
}

export const updateForm = (form, formData) => {
    const formElements = Array.from(form.elements);

    // TODO fix for multi select, array values, initial undefined
    formElements.forEach((element) => {
        if (element.name) {
            const value = getFormValue(formData, element.name);
            console.log({ value, name: element.name }, formData);
            element.value = value ?? '';
        }
    });
}
