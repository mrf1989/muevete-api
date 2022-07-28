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
    const newsletter: Newsletter = payload as Newsletter;
    if (newsletter.enlaces.length >= 5) {
      try {
        newsletter.fecha = new Date(Date.now());
        return await this.newsletterRepository.createNewsletter(newsletter);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error(
        "La newsletter debe tener al menos 5 enlaces entre artículos y eventos",
      );
    }
  }

  public async updateNewsletter(id: string): Promise<Newsletter> {
    const newsletterId = new Bson.ObjectId(id);
    const newsletter = await this.newsletterRepository.getNewsletter(
      newsletterId,
    );
    newsletter.fechaEnvio = new Date(Date.now());

    const ultimaNewsletter = await this.getUltimaNewsletterEnviada();
    const fechaEnvioDisponible = this.diasEntreFechas(
      ultimaNewsletter.fechaEnvio!,
      newsletter.fechaEnvio,
    ) >= 15;

    if (fechaEnvioDisponible) {
      const res = await this.newsletterRepository.updateNewsletter(
        newsletterId,
        newsletter,
      );

      if (!res) throw new Error("La newsletter no se ha podido actualizar");

      return res;
    } else {
      throw new Error(
        "No es posible enviar una nueva newsletter en un plazo inferior a 15 días desde el último envío",
      );
    }
  }

  public async getUltimaNewsletterEnviada(): Promise<Newsletter> {
    const newsletters = await this.getAllNewsletters();
    let ultimaNewsletter: Newsletter = newsletters[0];

    newsletters.forEach((newsletter) => {
      if (
        newsletter.fechaEnvio &&
        (newsletter.fechaEnvio > ultimaNewsletter!.fechaEnvio!)
      ) {
        ultimaNewsletter = newsletter;
      }
    });

    return ultimaNewsletter!;
  }

  public diasEntreFechas(fechaA: Date, fechaB: Date): number {
    const miliseconds: number = Math.abs(fechaB.getTime() - fechaA.getTime());
    const dias: number = Math.ceil(miliseconds / (1000 * 60 * 60 * 24));
    return dias;
  }
}
