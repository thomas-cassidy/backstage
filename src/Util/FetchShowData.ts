import axios from "axios";
import { API_URI } from "./InitialState";

export const fetchShowData = async (showId: string, ACCESS_TOKEN: string) => {
    console.log("fetchshowdata");

    let response = await axios.get(`${API_URI}/shows/${showId}`, {
        headers: {
            "x-access-token": ACCESS_TOKEN,
        },
    });

    return response.data;
};
