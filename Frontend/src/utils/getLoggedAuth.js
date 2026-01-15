export const getValidAuthFromStorage = () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;

    try {
        const parsed = JSON.parse(auth);
        if (parsed.expiresIn && parsed.expiresIn > Date.now()) {
            return parsed;
        }

        // expired
        localStorage.removeItem("auth");
        return null;
    } catch {
        localStorage.removeItem("auth");
        return null;
    }
};
