import axios from "axios";
import { ITalle } from "../types/ITalle";

const tallesURL = "http://localhost:9000/talles";

export const getTalles = async (): Promise<ITalle[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get<ITalle[]>(tallesURL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
};