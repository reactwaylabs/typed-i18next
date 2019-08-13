import { Project, StructureKind, Writers } from "ts-morph";

import { KEY_SEPARATOR } from "./constants";

function resolveTypes(namespaceDictionary: { [key: string]: string[] }, keyWithNS: boolean = false): { [key: string]: string } {
    const result: { [key: string]: string } = {};

    for (const ns of Object.keys(namespaceDictionary)) {
        const keys = namespaceDictionary[ns];

        let keyPrefix: string;
        if (keyWithNS) {
            keyPrefix = `${ns}${KEY_SEPARATOR}`;
        } else {
            keyPrefix = "";
        }

        result[`"${ns}"`] = keys.map(key => `"${keyPrefix}${key}"`).join(" | ");
    }

    return result;
}

export function generateTypes(keys: string[]): string {
    const project = new Project();
    const file = project.createSourceFile("translations.ts");

    const namespaceDictionary: { [key: string]: string[] } = {};

    for (const fullKey of keys) {
        // TODO: Optimize.
        const namespaceAndKey = fullKey.split(KEY_SEPARATOR);
        const key = namespaceAndKey[namespaceAndKey.length - 1];
        const namespaces = namespaceAndKey.slice(0, namespaceAndKey.length - 1).join(KEY_SEPARATOR);

        if (namespaceDictionary[namespaces] == null) {
            namespaceDictionary[namespaces] = [];
        }

        namespaceDictionary[namespaces].push(key);
    }

    const $interface = file.addInterface({
        name: "Translations",
        isExported: true
    });

    $interface.addMember({
        name: "keys",
        kind: StructureKind.PropertySignature,
        type: Writers.object(resolveTypes(namespaceDictionary, false))
    });

    $interface.addMember({
        name: "keysWithNS",
        kind: StructureKind.PropertySignature,
        type: Writers.object(resolveTypes(namespaceDictionary, true))
    });

    file.formatText({
        ensureNewLineAtEndOfFile: true
    });
    return file.getText();
}
