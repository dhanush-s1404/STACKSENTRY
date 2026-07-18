const API_URL = import.meta.env.VITE_API_URL;

export async function getJobs() {
    const response = await fetch(`${API_URL}/jobs`);
    return response.json();
}