import { Request,Response } from "express"
import { fetchRouteDetails } from "../services/databaseService";
import { RouteDetailsResponse } from "../interfaces/trashPickupInterfaces";


export const getRouteDetails = async (req:Request, res:Response):Promise<any> =>{


    try {
        
        const { county, pickup_day } = req.body;
        const routeDetails:RouteDetailsResponse = await fetchRouteDetails(county, pickup_day);

        if (!routeDetails) {
            return res.status(404).json({ error: "Route not found" });
        }        
        res.status(200).json(routeDetails);
    } catch (error) {
        console.error("Error fetching route details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
