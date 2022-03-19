import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import { EventoRepository } from "../../src/repositories/repositories.ts";
import { EventoService } from "../../src/services/services.ts";
import { Evento } from "../../src/models/models.ts";

Rhum.testPlan("Testing Evento Service", () => {
    let dbManagement: Stubbed<DBManagement>;
    const evento: Evento = {
        _id: new Bson.ObjectID("6235d572c077516a2dffa8ff"),
        nombre: "Caminar para vencer",
        descripcion: "Descripción de la actividad deportiva y de la enfermedad contra la que se lucha",
        objetivoKm: 5000,
        fechaCreacion: new Date("2022-03-01"),
        fechaInicio: new Date("2022-03-01"),
        fechaFin: new Date("2022-03-08"),
        modalidad: ["caminata", "carrera"]
    }
    let eventoRepository: Stubbed<EventoRepository>;
    
    Rhum.beforeAll(() => {
        dbManagement = Rhum.stubbed(new DBManagement());
        dbManagement.stub("connect", () => {});
        dbManagement.stub("getCollection", () => {});
    });
    
    Rhum.testSuite("Operaciones CRUD en eventos", () => {
        Rhum.beforeEach(() => {
            eventoRepository = Rhum.stubbed(new EventoRepository(dbManagement));
        });

        Rhum.testCase("Permite crear un evento", async () => {    
            eventoRepository.stub("createEvento", () => {});
    
            const eventoService = new EventoService(eventoRepository);
            const res = await eventoService.createEvento(evento);
            asserts.assertEquals(res, true);
        });

        Rhum.testCase("Valida la duración mínima de un evento", () => {
            evento.fechaFin = new Date("2022-03-03");
    
            const eventoService = new EventoService(eventoRepository);
            asserts.assertThrowsAsync(async () => {
                await eventoService.createEvento(evento);
            }, Error, "El evento debe durar un mínimo de 7 días");
        });

        Rhum.testCase("Listar todos los eventos", async () => {
            eventoRepository.stub("getAll", () => {
                return [evento, evento, evento];
            });

            const eventoService = new EventoService(eventoRepository);
            const eventos = await eventoService.getAllEventos();
            asserts.assertEquals(eventos.length, 3);
        });
    });
});

Rhum.run();