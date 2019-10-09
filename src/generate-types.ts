import { Project, StructureKind, Writers } from "ts-morph";

import { NAMESPACE_SEPARATOR } from "./constants";

function resolveTypes(namespaceDictionary: { [key: string]: string[] }, keyWithNS: boolean = false): { [key: string]: string } {
    const result: { [key: string]: string } = {};

    for (const ns of Object.keys(namespaceDictionary)) {
        const keys = namespaceDictionary[ns];

        let keyPrefix: string;
        if (keyWithNS) {
            keyPrefix = `${ns}${NAMESPACE_SEPARATOR}`;
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
        const [namespace, key] = fullKey.split(NAMESPACE_SEPARATOR);

        if (namespaceDictionary[namespace] == null) {
            namespaceDictionary[namespace] = [];
        }

        namespaceDictionary[namespace].push(key);
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
