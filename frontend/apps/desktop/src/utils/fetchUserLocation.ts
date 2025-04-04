const IPAddress: string | undefined = import.meta.env.VITE_IP_ADDRESS;

// Get user location
export default async function FetchUserLocation(ip?: string): Promise<any> {
    if (ip === undefined) ip = IPAddress;
    try {
        const response = await fetch(`http://ip-api.com/json/${ip || ""}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user location: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching user location:", error);
        return null;
    }
}