// deno-lint-ignore-file

import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import { DorsalRepository, EventoRepository } from "../../src/repositories/repositories.ts";
import { DorsalService, EventoService } from "../../src/services/services.ts";
import { Dorsal } from "../../src/models/models.ts";

Rhum.testPlan("Testing Dorsal Service", () => {
    let dbManagement: Stubbed<DBManagement>;
    const dorsal: Dorsal = {
        _id: new Bson.ObjectID("6235d572c077516a2dffa8ff"),
        lema: "Caminar para vencer",
        num: 34,
        usuario_id: new Bson.ObjectID("6235d572c077516a2dffa836"),
        evento_id: new Bson.ObjectID("6235d572c077516a2dffa823")
    }
    let dorsalRepository: Stubbed<DorsalRepository>;
    let eventoRepository: Stubbed<EventoRepository>;
    let eventoService: Stubbed<EventoService>;

    Rhum.beforeAll(() => {
        dbManagement = Rhum.stubbed(new DBManagement());
        dbManagement.stub("connect", () => {});
        dbManagement.stub("getCollection", () => {});
    });
    
    Rhum.testSuite("Operaciones CRUD en eventos", () => {
        Rhum.beforeEach(() => {
            dorsalRepository = Rhum.stubbed(new DorsalRepository(dbManagement));
            eventoRepository = Rhum.stubbed(new EventoRepository(dbManagement));
            eventoService = Rhum.stubbed(new EventoService(eventoRepository));
        });

        Rhum.testCase("Permite crear un dorsal", async () => {   
            eventoService.stub("getEvento", () => true);
            dorsalRepository.stub("getAll", () => { return [] });
            dorsalRepository.stub("createDorsal", () => {});
    
            const dorsalService = new DorsalService(dorsalRepository, eventoService);
            const res = await dorsalService.createDorsal({
                lema: "A por todas!",
                usuario_id: "6235d572c077516a2dffa836",
                evento_id: "6235d572c077516a2dffa823"
            } as unknown as Dorsal);
            asserts.assertEquals(res, true);
        });
    });
});

Rhum.run();