import { asserts, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import { UsuarioRepository } from "../../src/repositories/repositories.ts";
import { UsuarioService } from "../../src/services/services.ts";

Rhum.testPlan("Testing Usuario Service", () => {
    Rhum.testSuite("Testing autenticación de usuarios", () => {
        let dbManagement: Stubbed<DBManagement>;
        let usuarioRepository: Stubbed<UsuarioRepository>;
        let user = {
            username: "mruano",
            password: "12345",
            rol: "admin",
            nombre: "Mario",
            apellidos: "Ruano Fernández",
            fechaNacimiento: new Date("1989-11-01"),
            email: "mruano@us.es"
        }
        Rhum.beforeAll(() => {
            dbManagement = Rhum.stubbed(new DBManagement());
            dbManagement.stub("connect", () => {
                return 0;
            });
            dbManagement.stub("getCollection", () => {
                return 0;
            });
        });
        
        Rhum.beforeEach(() => {
            usuarioRepository = Rhum.stubbed(new UsuarioRepository(dbManagement));
        });

        Rhum.testCase("No permite crear usuario con username existente", () => {
            usuarioRepository.stub("getUsuarioByUsername", () => {
               return user;
            });

            const usuarioService = new UsuarioService(usuarioRepository);
            asserts.assertThrowsAsync(async () => {
                await usuarioService.createUsuario(user);
            }, Error, `El username ${user.username} no está disponible`);
        });

        Rhum.testCase("Permite crear un usuario", async () => {
            usuarioRepository.stub("getUsuarioByUsername", () => {
                throw new Error(`${user.username} no existe`);
            });

            usuarioRepository.stub("createUsuario", () => {
                return true;
            })

            const usuarioService = new UsuarioService(usuarioRepository);
            const res = await usuarioService.createUsuario(user);
            asserts.assertEquals(res, true);
        });

        Rhum.testCase("Autenticación de usuario", async () => {
            usuarioRepository.stub("getUsuarioByUsername", () => {
                let hashUsuario = user;
                hashUsuario.password = "7d4e3eec80026719639ed4dba68916eb94c7a49a053e05c8f9578fe4e5a3d7ea";
                return hashUsuario;
            });

            const usuarioService = new UsuarioService(usuarioRepository);
            const correcto = await usuarioService.loginUsuario({ username: "mruano", password: "12345" });
            asserts.assertEquals(correcto, true);
            asserts.assertThrowsAsync(async () => {
                await usuarioService.loginUsuario({ username: "mruano", password: "123123" });
            }, Error, "El usuario o la contraseña introducidos no son correctos");
        });
    });
});

Rhum.run();