import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import { UsuarioRepository } from "../../src/repositories/repositories.ts";
import { UsuarioService } from "../../src/services/services.ts";
import { Usuario } from "../../src/models/models.ts";

Rhum.testPlan("Testing Usuario Service", () => {
    let dbManagement: Stubbed<DBManagement>;
    const user: Usuario = {
        _id: new Bson.ObjectID("62358b4fac70f4b258326c48"),
        username: "mruano",
        password: "12345",
        rol: "admin",
        nombre: "Mario",
        apellidos: "Ruano Fernández",
        fechaNacimiento: new Date("1989-11-01"),
        email: "mruano@us.es"
    }
    let usuarioRepository: Stubbed<UsuarioRepository>;
    
    Rhum.beforeAll(() => {
        dbManagement = Rhum.stubbed(new DBManagement());
        dbManagement.stub("connect", () => {
            return 0;
        });
        dbManagement.stub("getCollection", () => {
            return 0;
        });
    });
    
    Rhum.testSuite("Testing autenticación de usuarios", () => {
        Rhum.beforeAll(() => {
            usuarioRepository = Rhum.stubbed(new UsuarioRepository(dbManagement));
            usuarioRepository.stub("getUsuarioByUsername", () => {
                const hashUsuario = user;
                hashUsuario.password = "7d4e3eec80026719639ed4dba68916eb94c7a49a053e05c8f9578fe4e5a3d7ea";
                return hashUsuario;
            });
        });
        
        Rhum.testCase("Autenticación de usuario correcto", async () => {
            const usuarioService = new UsuarioService(usuarioRepository);
            const correcto = await usuarioService.loginUsuario({ username: "mruano", password: "12345" });
            asserts.assertEquals(correcto, true);
        });
        
        Rhum.testCase("Autenticación de usuario incorrecto", () => {
            const usuarioService = new UsuarioService(usuarioRepository);
            asserts.assertThrowsAsync(async () => {
                await usuarioService.loginUsuario({ username: "mruano", password: "123123" });
            }, Error, "El usuario o la contraseña introducidos no son correctos");
        });
    });
    
    Rhum.testSuite("Operaciones CRUD en usuarios", () => {
        Rhum.beforeEach(() => {
            usuarioRepository = Rhum.stubbed(new UsuarioRepository(dbManagement));
        });

        Rhum.testCase("Permite crear un usuario", async () => {
            usuarioRepository.stub("getUsuarioByUsername", () => {
                throw new Error(`${user.username} no existe`);
            });
    
            usuarioRepository.stub("createUsuario", () => {
                return true;
            });
    
            const usuarioService = new UsuarioService(usuarioRepository);
            const res = await usuarioService.createUsuario(user);
            asserts.assertEquals(res, true);
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
    
        Rhum.testCase("Actualiza la información de usuario", async () => {
            usuarioRepository.stub("getUsuario", () => {
                return user;
            });
    
            usuarioRepository.stub("updateUsuario", async () => {});
    
            const usuarioService = new UsuarioService(usuarioRepository);
            let res = false;

            if (user._id) {
                res = await usuarioService.updateUsuario(user._id.id, {apellidos: "Ruano", ciudad: "Chipiona"} as Usuario);
            }
            
            asserts.assertEquals(res, true);
        });
    
        Rhum.testCase("No actualiza información si no existe el usuario", () => {
            usuarioRepository.stub("getUsuario", () => {
                throw new Error("Usuario no encontrado");
            });
    
            const usuarioService = new UsuarioService(usuarioRepository);
            
            asserts.assertThrowsAsync(async () => {
                if (user._id) await usuarioService.updateUsuario(user._id.id, {apellidos: "Ruano", ciudad: "Chipiona"} as Usuario);
            });
        });
    });
});

Rhum.run();