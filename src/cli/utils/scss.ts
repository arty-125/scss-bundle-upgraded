import path from "path";
import nodeSass from "sass";
import { CompilationError } from "../errors/compilation-error";

function sassImporter(projectPath: string) {
    return (url: any, _prev: any, done: any) => {
        if (url[0] === "~") {
            const filePath = path.resolve(projectPath, "node_modules", url.substring(1));
            done({
                file: filePath
            });
        } else {
            done({ file: url });
        }
    };
}

export async function renderScss(projectPath: string | undefined, includePaths: string[] | undefined, content: string): Promise<any> {
    return new Promise((resolve, reject) => {
        nodeSass.render(
            {
                data: content,
                importer: projectPath != null ? sassImporter(projectPath) : undefined,
                includePaths: includePaths
            },
            (error: any, result: any) => {
                if (error != null) {
                    reject(new CompilationError(`${error.message} on line (${error.line}, ${error.column})`));
                }
                resolve(result);
            }
        );
    });
}
