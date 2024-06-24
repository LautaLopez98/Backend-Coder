import { TicketManager } from "../dao/Mongo/ticketManager.js";

class TicketService {
    constructor(dao){
        this.dao = dao;
    }
    createTicket = async(ticket)=>{
        return await this.dao.create(ticket)
    }
}

export const ticketService = new TicketService(new TicketManager)