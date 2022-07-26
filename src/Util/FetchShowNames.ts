import axios from "axios";
import { User } from "../Types/AppTypes";
import { API_URI } from "./InitialState";

export const fetchShowNames = async (userData: User, ACCESS_TOKEN: string) => {
    console.log("fetchshownames");
    let shows = [];
    for (let i = 0; i < userData.shows.length; i++) {
        let response = await axios.get(
            `${API_URI}/shows/name/${userData.shows[i]}`,
            {
                headers: {
                    "x-access-token": ACCESS_TOKEN,
                },
            }
        );

        shows.push(response.data.show);
    }
    return shows;
};
