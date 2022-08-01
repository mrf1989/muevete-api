import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import { NewsletterRepository } from "../../src/repositories/repositories.ts";
import { NewsletterService } from "../../src/services/services.ts";

Rhum.testPlan("Testing Newsletter Service", () => {
  let dbManagement: Stubbed<DBManagement>;

  const newsletters = [
    { fechaEnvio: new Date(Date.now()) },
    { fechaEnvio: new Date("2022-05-03") },
    { fechaEnvio: new Date("2022-06-16") },
    { fechaEnvio: new Date("2022-07-01") },
  ];
  const nuevaNewsletter: {
    _id: Bson.ObjectId;
    titulo: string;
    fechaEnvio?: Date;
  } = {
    _id: new Bson.ObjectId("6235d572c077516a2dffaa8f"),
    titulo: "Nueva newsletter",
  };

  let newsletterRepository: Stubbed<NewsletterRepository>;

  Rhum.beforeAll(() => {
    dbManagement = Rhum.stubbed(new DBManagement());
    dbManagement.stub("connect", () => {});
    dbManagement.stub("getCollection", () => {});
  });

  Rhum.testSuite("Operaciones auxiliares en newsletters", () => {
    Rhum.beforeEach(() => {
      newsletterRepository = Rhum.stubbed(
        new NewsletterRepository(dbManagement),
      );
    });

    Rhum.testCase("Devuelve la última newsletter enviada", async () => {
      newsletterRepository.stub("getAll", () => {
        return newsletters;
      });

      const newsletterService = new NewsletterService(newsletterRepository);
      const newsletter = await newsletterService.getUltimaNewsletterEnviada();
      asserts.assertEquals(newsletter, newsletters[0]);
      asserts.assertNotEquals(newsletter, newsletters[1]);
    });

    Rhum.testCase("Devuelve los días entre dos fechas", () => {
      const newsletterService = new NewsletterService(newsletterRepository);
      const dias = newsletterService.diasEntreFechas(
        newsletters[3].fechaEnvio,
        newsletters[2].fechaEnvio,
      );
      asserts.assertEquals(dias, 15);
    });
  });

  Rhum.testSuite("Operaciones CRUD en newsletters", () => {
    Rhum.beforeEach(() => {
      newsletterRepository = Rhum.stubbed(
        new NewsletterRepository(dbManagement),
      );

      nuevaNewsletter.fechaEnvio = undefined;
    });

    Rhum.testCase(
      "No permite el envío de una newsletter en menos de 15 días desde el último envío",
      () => {
        newsletterRepository.stub("getAll", () => {
          return newsletters;
        });

        newsletterRepository.stub("getNewsletter", () => {
          return nuevaNewsletter;
        });

        const newsletterService = new NewsletterService(newsletterRepository);

        asserts.assertThrowsAsync(
          async () => {
            await newsletterService.updateNewsletter(
              "6235d572c077516a2dffaa8f",
            );
          },
          Error,
          "No es posible enviar una nueva newsletter en un plazo inferior a 15 días desde el último envío",
        );
      },
    );

    Rhum.testCase(
      "Permite la actualización (envío) de newsletter",
      async () => {
        newsletterRepository.stub("getAll", () => {
          return newsletters.slice(1);
        });

        newsletterRepository.stub("getNewsletter", () => {
          return nuevaNewsletter;
        });

        newsletterRepository.stub("updateNewsletter", () => {
          nuevaNewsletter.fechaEnvio = new Date(Date.now());
          return nuevaNewsletter;
        });

        const newsletterService = new NewsletterService(newsletterRepository);
        const newsletterEnviada = await newsletterService.updateNewsletter(
          "6235d572c077516a2dffaa8f",
        );

        asserts.assertEquals(
          newsletterEnviada.fechaEnvio,
          nuevaNewsletter.fechaEnvio,
        );
      },
    );

    Rhum.testCase("Permite la actualización (envío) de newsletter si no se ha enviado ninguna", async () => {
      newsletterRepository.stub("getAll", () => {
        return [];
      });

      newsletterRepository.stub("getNewsletter", () => {
        return nuevaNewsletter;
      });

      newsletterRepository.stub("updateNewsletter", () => {
        nuevaNewsletter.fechaEnvio = new Date(Date.now());
        return nuevaNewsletter;
      });

      const newsletterService = new NewsletterService(newsletterRepository);
      const newsletterEnviada = await newsletterService.updateNewsletter(
        "6235d572c077516a2dffaa8f",
      );

      asserts.assertNotEquals(newsletterEnviada.fechaEnvio, undefined);
      asserts.assertNotEquals(typeof newsletterEnviada.fechaEnvio, undefined);
      asserts.assertEquals(
        newsletterEnviada.fechaEnvio,
        nuevaNewsletter.fechaEnvio,
      );
    });

    Rhum.testCase(
      "Impide la creación de newsletter con menos de 5 enlaces",
      () => {
        const newsletterDosEnlaces = {
          titulo: "Una newsletter con poca información",
          enlaces: [
            { titulo: "enlace 1", enlace: "1234", tipo: "articulos" },
            { titulo: "enlace 2", enlace: "4321", tipo: "eventos" },
          ],
        };
        const newsletterService = new NewsletterService(newsletterRepository);

        asserts.assertThrowsAsync(
          async () => {
            await newsletterService.createNewsletter(
              newsletterDosEnlaces,
            );
          },
          Error,
          "La newsletter debe tener al menos 5 enlaces entre artículos y eventos",
        );
      },
    );

    Rhum.testCase(
      "Permite la creación de newsletter con 5 enlaces",
      async () => {
        const newsletterCincoEnlaces: {
          titulo: string;
          fecha?: Date;
          enlaces: {
            titulo: string;
            enlace: string;
            tipo: string;
          }[];
        } = {
          titulo: "Una newsletter con suficiente información",
          enlaces: [
            { titulo: "enlace 1", enlace: "1234", tipo: "articulos" },
            { titulo: "enlace 2", enlace: "4321", tipo: "eventos" },
            { titulo: "enlace 3", enlace: "1357", tipo: "eventos" },
            { titulo: "enlace 3", enlace: "2468", tipo: "articulos" },
            { titulo: "enlace 5", enlace: "0918", tipo: "eventos" },
          ],
        };

        newsletterRepository.stub("createNewsletter", () => {
          newsletterCincoEnlaces.fecha = new Date(Date.now());
          return newsletterCincoEnlaces;
        });

        const newsletterService = new NewsletterService(newsletterRepository);
        const newsletterCreada = await newsletterService.createNewsletter(
          newsletterCincoEnlaces,
        );

        asserts.assertEquals(
          newsletterCreada.fecha,
          newsletterCincoEnlaces.fecha,
        );
      },
    );
  });
});

Rhum.run();
