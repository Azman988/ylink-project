
export const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
    // 1. Standard Error instances (e.g. throw new Error)
    if (error instanceof Error && error.message) {
        return error.message;
    }

    // 2. EmailJS error objects (EmailJS often returns { text: "...", status: 400 })
    if (typeof error === "object" && error !== null && "text" in error) {
        return String((error as { text: unknown }).text);
    }

    // 3. String errors (e.g. throw "Some error")
    if (typeof error === "string") {
        return error;
    }

    // 4. Default fallback message
    return fallbackMessage;
};