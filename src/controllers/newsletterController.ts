import {
  AllowOnly,
  Controller,
  GET,
  POST,
  RequestBody,
  RouteParam,
} from "../../deps.ts";
import { NewsletterService } from "../services/services.ts";
import { Newsletter } from "../models/models.ts";

@Controller("/api/admin")
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @GET("/newsletters")
  public async getAllNewsletters(): Promise<Newsletter[]> {
    return await this.newsletterService.getAllNewsletters();
  }

  @GET("/newsletters/:id")
  public async getNewsletter(
    @RouteParam("id") id: string,
  ): Promise<Newsletter> {
    try {
      return await this.newsletterService.getNewsletter(id);
    } catch (err) {
      throw err;
    }
  }

  @POST("/newsletters")
  @AllowOnly("hasRole('ADMIN')")
  public async createNewsletter(@RequestBody() payload: Newsletter) {
    try {
      return await this.newsletterService.createNewsletter(payload);
    } catch (err) {
      throw err;
    }
  }
}
