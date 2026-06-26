import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { constants, editor, viewport } from "express-document-sdk";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

/**
 * Create a page in the document using either:
 * - a Blob supplied from the UI, or
 * - a string (URL or base64) that will be fetched/decoded inside the sandbox.
 *
 * @param {Blob|string|null} imageInput - Blob or string (URL/base64) or null.
 * @param {string} narrative - Text narrative to place below the media/content.
 * @param {string} [sceneType] - "IMAGE" (default) or "VIDEO".
 * @param {{width:number,height:number}} [pageSize] - Optional size for the new page.
 * @param {object} [options] - Album layout options, including backgroundInput/title/location/audio.
 */
async function createPageImpl(imageInput, narrative, sceneType = "IMAGE", pageSize, options = {}) {
    const isImage = sceneType !== "VIDEO";
    const defaultPageSize = { width: 400, height: 600 };
    const pageGeometry = {
        width: Number(pageSize?.width) || defaultPageSize.width,
        height: Number(pageSize?.height) || defaultPageSize.height
    };
    const margin = 40;
    const textGap = 20;

    const createTextNode = (textContent, parent, x, y, width, style = {}) => {
        const text = editor.createText(textContent || "");
        text.setPositionInParent({ x, y }, { x: 0, y: 0 });
        try {
            text.layout = {
                type: constants.TextLayout.autoHeight,
                width
            };
        } catch (_) {}
        try {
            const color = style.color || { red: 0, green: 0, blue: 0, alpha: 1 };
            text.fullContent.applyCharacterStyles(
                { fontSize: style.fontSize || 14, color },
                { start: 0, length: text.fullContent.text.length }
            );
        } catch (_) {}
        parent.children.append(text);
        return text;
    };

    const getTargetParent = (page) => page?.artboards?.first || editor.context.insertionParent;

    const createPage = () => editor.documentRoot.pages.addPage(pageGeometry);

    const createRect = (parent, x, y, width, height, color) => {
        const rect = editor.createRectangle();
        rect.width = width;
        rect.height = height;
        rect.fill = editor.makeColorFill(color);
        rect.setPositionInParent({ x, y }, { x: 0, y: 0 });
        parent.children.append(rect);
        return rect;
    };

    const base64ToUint8Array = (base64) => {
        const cleanBase64 = String(base64 || "").replace(/\s/g, "");
        const lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        const padding = cleanBase64.endsWith("==") ? 2 : cleanBase64.endsWith("=") ? 1 : 0;
        const outputLength = Math.floor((cleanBase64.length * 3) / 4) - padding;
        const bytes = new Uint8Array(outputLength);
        let byteIndex = 0;

        for (let i = 0; i < cleanBase64.length; i += 4) {
            const chunk =
                (lookup.indexOf(cleanBase64[i]) << 18) |
                (lookup.indexOf(cleanBase64[i + 1]) << 12) |
                ((cleanBase64[i + 2] === "=" ? 0 : lookup.indexOf(cleanBase64[i + 2])) << 6) |
                (cleanBase64[i + 3] === "=" ? 0 : lookup.indexOf(cleanBase64[i + 3]));

            if (byteIndex < outputLength) bytes[byteIndex++] = (chunk >> 16) & 255;
            if (byteIndex < outputLength) bytes[byteIndex++] = (chunk >> 8) & 255;
            if (byteIndex < outputLength) bytes[byteIndex++] = chunk & 255;
        }

        return bytes;
    };

    const base64ToBlob = (base64, mimeType = "image/png") => {
        return new Blob([base64ToUint8Array(base64)], { type: mimeType });
    };

    const imageInputToBlob = (input) => {
        if (!input) return null;
        if (typeof Blob !== "undefined" && input instanceof Blob) return input;
        if (typeof input !== "string") return input;

        if (input.startsWith("data:")) {
            const [header, base64 = ""] = input.split(",");
            const mimeType = header.match(/^data:([^;]+)/)?.[1] || "image/png";
            return base64ToBlob(base64, mimeType);
        }

        if (input.startsWith("http://") || input.startsWith("https://")) {
            throw new Error("Image URLs must be loaded by the panel before sending them to the document sandbox.");
        }

        return base64ToBlob(input, "image/png");
    };

    const getImageSize = (bitmapImage) => {
        return getContainSize(bitmapImage, pageGeometry.width - margin * 2, Math.max(120, pageGeometry.height * 0.56));
    };

    const getContainSize = (bitmapImage, maxWidth, maxHeight) => {
        const imageRatio = bitmapImage.width / bitmapImage.height;
        const boxRatio = maxWidth / maxHeight;

        if (imageRatio > boxRatio) {
            return {
                width: maxWidth,
                height: maxWidth / imageRatio
            };
        }

        return {
            width: maxHeight * imageRatio,
            height: maxHeight
        };
    };

    const getCoverSize = (bitmapImage, targetWidth, targetHeight) => {
        const imageRatio = bitmapImage.width / bitmapImage.height;
        const boxRatio = targetWidth / targetHeight;

        if (imageRatio > boxRatio) {
            return {
                width: targetHeight * imageRatio,
                height: targetHeight
            };
        }

        return {
            width: targetWidth,
            height: targetWidth / imageRatio
        };
    };

    const addBackground = (bitmapImage, parent) => {
        if (!bitmapImage) {
            createRect(parent, 0, 0, pageGeometry.width, pageGeometry.height, {
                red: 0.08,
                green: 0.08,
                blue: 0.09,
                alpha: 1
            });
            return;
        }

        const size = getCoverSize(bitmapImage, pageGeometry.width, pageGeometry.height);
        const background = editor.createImageContainer(bitmapImage, {
            initialSize: size
        });
        background.setPositionInParent(
            { x: (pageGeometry.width - size.width) / 2, y: (pageGeometry.height - size.height) / 2 },
            { x: 0, y: 0 }
        );
        parent.children.append(background);
    };

    const addCoverContent = (parent) => {
        createRect(parent, 0, 0, pageGeometry.width, pageGeometry.height, {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0.36
        });
        createTextNode(
            options.title || "MemoMosaic",
            parent,
            margin,
            pageGeometry.height * 0.34,
            pageGeometry.width - margin * 2,
            { fontSize: 34, color: { red: 1, green: 1, blue: 1, alpha: 1 } }
        );
        createTextNode(
            options.subtitle || "",
            parent,
            margin,
            pageGeometry.height * 0.48,
            pageGeometry.width - margin * 2,
            { fontSize: 16, color: { red: 1, green: 1, blue: 1, alpha: 1 } }
        );
    };

    const addSceneTextPanel = (parent, y, text) => {
        const panelY = Math.min(y, pageGeometry.height - 150);
        createRect(parent, margin * 0.75, panelY - 12, pageGeometry.width - margin * 1.5, 130, {
            red: 1,
            green: 1,
            blue: 1,
            alpha: 0.86
        });
        createTextNode(text, parent, margin, panelY, pageGeometry.width - margin * 2, {
            fontSize: 13,
            color: { red: 0.06, green: 0.06, blue: 0.06, alpha: 1 }
        });

        if (options.location || options.audio) {
            const meta = [options.location, options.audio ? "Narration generated" : ""].filter(Boolean).join(" · ");
            createTextNode(meta, parent, margin, panelY + 92, pageGeometry.width - margin * 2, {
                fontSize: 9,
                color: { red: 0.25, green: 0.25, blue: 0.25, alpha: 1 }
            });
        }
    };

    try {
        const backgroundBlob = options.backgroundInput ? imageInputToBlob(options.backgroundInput) : null;
        const bitmapImagePromise = isImage && imageInput
            ? editor.loadBitmapImage(imageInputToBlob(imageInput))
            : null;
        const backgroundImagePromise = backgroundBlob
            ? editor.loadBitmapImage(backgroundBlob)
            : null;

        const bitmapImage = bitmapImagePromise ? await bitmapImagePromise : null;
        const backgroundImage = backgroundImagePromise ? await backgroundImagePromise : null;

        if (options.isCover) {
            await editor.queueAsyncEdit(() => {
                const page = createPage();
                const insertionParent = getTargetParent(page);
                addBackground(backgroundImage, insertionParent);
                addCoverContent(insertionParent);
                try {
                    viewport.bringIntoView(page);
                } catch (_) {}
            });
            return { ok: true };
        }

        if (isImage && bitmapImage) {
            await editor.queueAsyncEdit(() => {
                const page = createPage();
                const insertionParent = getTargetParent(page);
                addBackground(backgroundImage, insertionParent);
                createRect(insertionParent, 0, 0, pageGeometry.width, pageGeometry.height, {
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 0.18
                });

                const imageSize = getImageSize(bitmapImage);
                const mediaContainerNode = editor.createImageContainer(bitmapImage, {
                    initialSize: imageSize
                });
                mediaContainerNode.setPositionInParent(
                    { x: (pageGeometry.width - imageSize.width) / 2, y: margin + 18 },
                    { x: 0, y: 0 }
                );
                insertionParent.children.append(mediaContainerNode);

                addSceneTextPanel(insertionParent, margin + imageSize.height + textGap + 18, narrative);
                try {
                    viewport.bringIntoView(page);
                } catch (_) {}
            });
            return { ok: true };
        }

        if (!isImage) {
            await editor.queueAsyncEdit(() => {
                const page = createPage();
                const insertionParent = getTargetParent(page);
                addBackground(backgroundImage, insertionParent);
                createRect(insertionParent, margin * 0.75, margin * 0.75, pageGeometry.width - margin * 1.5, 180, {
                    red: 1,
                    green: 1,
                    blue: 1,
                    alpha: 0.86
                });
                createTextNode(
                    "[Video]\n\n" + (narrative || ""),
                    insertionParent,
                    margin,
                    margin,
                    pageGeometry.width - margin * 2
                );
                try {
                    viewport.bringIntoView(page);
                } catch (_) {}
            });
            return { ok: true };
        }

        await editor.queueAsyncEdit(() => {
            const page = createPage();
            const insertionParent = getTargetParent(page);
            addBackground(backgroundImage, insertionParent);
            addSceneTextPanel(insertionParent, margin, narrative);
            try {
                viewport.bringIntoView(page);
            } catch (_) {}
        });
        return { ok: true };
    } catch (e) {
        console.error("Error in createPage:", e);
        try {
            await editor.queueAsyncEdit(() => {
                const page = createPage();
                const insertionParent2 = getTargetParent(page);
                createTextNode(
                    "Error adding content: " + (e.message || e) + "\n\n" + (narrative || ""),
                    insertionParent2,
                    margin,
                    margin,
                    pageGeometry.width - margin * 2
                );
            });
        } catch (_) {}
        throw e;
    }
}

function addPageImpl(size = { width: 400, height: 600 }) {
    return editor.queueAsyncEdit(() => {
        editor.documentRoot.pages.addPage(size);
    });
}

async function start() {
    const sandboxApi = {
        addPage: function (size = { width: 400, height: 600 }) {
            return addPageImpl(size);
        },
        /**
         * Direct sandbox API to create a page from data supplied by the UI.
         */
        createPage: function (imageInput, narrative, sceneType, pageSize, options) {
            return createPageImpl(imageInput, narrative, sceneType, pageSize, options);
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
        /**
         * Backwards-compatible invoke-style API used by the UI.
         * Accepts Blob or string as first argument.
         */
        invoke: function (methodName, imageInput, narrative, sceneType, pageSize, options) {
            if (methodName === "createPage") {
                return createPageImpl(
                    imageInput,
                    narrative,
                    sceneType,
                    pageSize,
                    options
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
