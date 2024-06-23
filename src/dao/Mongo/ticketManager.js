import { ticketModel } from "../models/ticketModel.js";

export class TicketManager{
    async create(ticket){
        return await ticketModel.create(ticket)
    }
}