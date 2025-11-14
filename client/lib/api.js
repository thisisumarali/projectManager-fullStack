export const API_BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const data = await res.json();
    if (!res.ok) {
        const errMsg = data.msg || data.message || "Something went wrong";
        throw new Error(errMsg);
    }
    return data;
}

export const loginUser = async (userData) => {
    return request("/userauth/login", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

export const registerUser = async (userData) => {
    return request("/userauth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};
