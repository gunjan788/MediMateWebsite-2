import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission route
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate the request body
      const result = insertContactSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: result.error.format() 
        });
      }
      
      // Store the contact message
      await storage.saveContactMessage(result.data);
      
      return res.status(200).json({ 
        message: "Message sent successfully" 
      });
    } catch (error) {
      console.error("Error saving contact message:", error);
      return res.status(500).json({ 
        message: "Failed to send message" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
