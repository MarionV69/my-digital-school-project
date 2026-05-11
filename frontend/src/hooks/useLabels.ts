import api from "@/api/axiosConfig";
import { useEffect, useState } from "react";

export default function useLabels() {

    const [labels, setLabels] = useState<{id: number; name: string; description: string}[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getLabels() {
            try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/suppliers/labels`);
            setLabels(response.data);
            } catch {
                setError("Erreur lors du chargement des labels");
            } finally {
                setLoading(false);
            }
        }
        getLabels();
    }, []);

    return {labels, error, loading};

}
