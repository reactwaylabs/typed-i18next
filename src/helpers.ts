import fs from "fs-extra";
import path from "upath";

export async function getListFilesRecursively(dirLocation: string): Promise<string[]> {
    let fileList: string[] = [];
    const promises: Array<Promise<string[]>> = [];
    const list = await fs.readdir(dirLocation);

    for (const item of list) {
        const itemPath = path.join(dirLocation, item);
        const stat = await fs.stat(itemPath);

        if (stat.isDirectory()) {
            promises.push(getListFilesRecursively(itemPath));
        } else {
            fileList.push(itemPath);
        }
    }

    const resolvedLists = await Promise.all(promises);

    for (const listItem of resolvedLists) {
        fileList = fileList.concat(listItem);
    }

    return fileList;
}

export async function getListOfDirectories(dirLocation: string): Promise<string[]> {
    const list = await fs.readdir(dirLocation);

    const directoryListPromise = list.map(async file => {
        const fullPath = path.resolve(dirLocation, file);
        const fileStats = await fs.stat(fullPath);

        if (fileStats.isDirectory()) {
            return file;
        } else {
            return undefined;
        }
    });

    const resolvedPromises = await Promise.all(directoryListPromise);
    const result: string[] = resolvedPromises.filter((x: string | undefined): x is string => x != null);

    return result;
}
