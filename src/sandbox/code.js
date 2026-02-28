import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

async function createPageImpl(base64Image, narrative, mimeType, sceneType) {
    const insertionParent = editor.context.insertionParent;
    const safeMime = mimeType && String(mimeType).startsWith("image/") ? mimeType : "image/png";
    const isImage = sceneType !== "VIDEO";
    const width = 400;
    const height = 300;

    try {
        if (isImage && base64Image) {
            const isUrl = typeof base64Image === "string" && base64Image.startsWith("http");
            const res = await fetch(isUrl ? base64Image : `data:${safeMime};base64,${base64Image}`);
            const blob = await res.blob();
            const bitmapImage = await editor.loadBitmapImage(blob);
            // Edits after async must run inside queueAsyncEdit (per Adobe document sandbox sample)
            await editor.queueAsyncEdit(() => {
                const mediaContainerNode = editor.createImageContainer(bitmapImage, {
                    initialSize: { width, height }
                });
                mediaContainerNode.translation = { x: 50, y: 50 };
                insertionParent.children.append(mediaContainerNode);

                const text = editor.createText();
                text.text = narrative || "";
                text.translation = { x: 50, y: 50 + height + 20 };
                if (text.styles) {
                    try {
                        text.styles.fill = editor.makeColorFill({ red: 0, green: 0, blue: 0, alpha: 1 });
                    } catch (_) {}
                }
                insertionParent.children.append(text);
            });
            return;
        }

        if (!isImage) {
            const placeholder = editor.createText();
            placeholder.text = "[Video]\n\n" + (narrative || "");
            placeholder.translation = { x: 50, y: 50 };
            if (placeholder.styles) {
                try {
                    placeholder.styles.fill = editor.makeColorFill({ red: 0.2, green: 0.2, blue: 0.2, alpha: 1 });
                } catch (_) {}
            }
            insertionParent.children.append(placeholder);
            return;
        }

        // Image type but no image data: add narrative only
        const text = editor.createText();
        text.text = narrative || "";
        text.translation = { x: 50, y: 50 };
        if (text.styles) {
            try {
                text.styles.fill = editor.makeColorFill({ red: 0, green: 0, blue: 0, alpha: 1 });
            } catch (_) {}
        }
        insertionParent.children.append(text);
    } catch (e) {
        console.error("Error in createPage:", e);
        await editor.queueAsyncEdit(() => {
            const insertionParent2 = editor.context.insertionParent;
            const text = editor.createText();
            text.text = "Error adding content: " + (e.message || e) + "\n\n" + (narrative || "");
            text.translation = { x: 50, y: 50 };
            if (text.styles) {
                try {
                    text.styles.fill = editor.makeColorFill({ red: 0.5, green: 0, blue: 0, alpha: 1 });
                } catch (_) {}
            }
            insertionParent2.children.append(text);
        });
    }
}

async function start() {
    const sandboxApi = {
        addPage: function (size = { width: 400, height: 600 }) {
            if (editor.documentRoot && editor.documentRoot.pages && editor.documentRoot.pages.addPage) {
                editor.documentRoot.pages.addPage(size);
            }
        },
        createRectangle: function () {
            const rectangle = editor.createRectangle();
            rectangle.width = 240;
            rectangle.height = 180;
            rectangle.translation = { x: 10, y: 10 };
            const color = { red: 0.32, green: 0.34, blue: 0.89, alpha: 1 };
            const rectangleFill = editor.makeColorFill(color);
            rectangle.fill = rectangleFill;
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rectangle);
        },
        invoke: function (methodName, base64Image, narrative, mimeType, sceneType) {
            if (methodName === "createPage") {
                return createPageImpl(
                    base64Image,
                    narrative,
                    mimeType,
                    sceneType
                );
            }
            return Promise.resolve();
        }
    };

    runtime.exposeApi(sandboxApi);
}

start().then(() => {
    console.log("Sandbox: API exposed.");
}).catch((e) => {
    console.error("Failed to start sandbox:", e);
});
