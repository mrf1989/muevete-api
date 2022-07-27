import { Bson, Service } from "../../deps.ts";
import { NewsletterRepository } from "../repositories/repositories.ts";
import { Newsletter } from "../models/models.ts";

@Service()
export class NewsletterService {
  constructor(private readonly newsletterRepository: NewsletterRepository) {}

  public async getAllNewsletters(): Promise<Newsletter[]> {
    return await this.newsletterRepository.getAll();
  }

  public async getNewsletter(id: string): Promise<Newsletter> {
    try {
      return await this.newsletterRepository.getNewsletter(
        new Bson.ObjectId(id),
      );
    } catch (err) {
      throw err;
    }
  }

  public async createNewsletter(payload: Newsletter): Promise<Bson.Document> {
    try {
      const newsletter: Newsletter = payload as Newsletter;
      newsletter.fecha = new Date(Date.now());
      return await this.newsletterRepository.createNewsletter(newsletter);
    } catch (err) {
      throw err;
    }
  }

  public async updateNewsletter(id: string): Promise<Newsletter> {
    const newsletterId = new Bson.ObjectId(id);
    const newsletter = await this.newsletterRepository.getNewsletter(
      newsletterId,
    );
    newsletter.fechaEnvio = new Date(Date.now());
    const res = await this.newsletterRepository.updateNewsletter(
      newsletterId,
      newsletter,
    );
    if (!res) throw new Error("La newsletter no se ha podido actualizar");
    return res;
  }
}
