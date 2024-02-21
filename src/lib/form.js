export const getFormValue = (form, name, defaultValue) => {
    const path = name.split('.');

    if (path.length > 1) {
        const value = path.reduce((acc, key) => acc?.[key], form);
        return value ?? defaultValue;
    }

    return form[name] ?? defaultValue;
};

export const addKeyMutate = (obj, key, value) => {
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
