import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

function start() {
    // APIs to be exposed to the UI runtime
    // i.e., to the `index.html` file of this add-on.
    const sandboxApi = {
        createRectangle: () => {
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
        createPage: async (base64Image, narrative) => {
            try {
                const insertionParent = editor.context.insertionParent;

                // Create Image
                // Convert base64 to blob
                const res = await fetch(`data:image/png;base64,${base64Image}`);
                const blob = await res.blob();

                // Try to create image container
                // Note: API might differ, using best guess based on SDK patterns
                const bitmap = await editor.createBitmapImage(blob); // Hypothetical API
                // If createBitmapImage doesn't exist, we might need another way.
                // But let's assume it works or similar.

                insertionParent.children.append(bitmap);
                bitmap.translation = { x: 50, y: 50 };
                bitmap.width = 400;
                bitmap.height = 300; // Aspect ratio might be wrong

                // Create Text
                const text = editor.createText();
                text.text = narrative;
                text.translation = { x: 50, y: 400 };
                const color = { red: 0, green: 0, blue: 0, alpha: 1 };
                text.color = editor.makeColorFill(color); // Assuming makeColorFill works for text color too

                insertionParent.children.append(text);

            } catch (e) {
                console.error("Error in createPage:", e);
                // Fallback: Create a rectangle with text if image fails
                const text = editor.createText();
                text.text = "Error adding image: " + e.message + "\n" + narrative;
                text.translation = { x: 50, y: 50 };
                const insertionParent = editor.context.insertionParent;
                insertionParent.children.append(text);
            }
        }
    };

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
