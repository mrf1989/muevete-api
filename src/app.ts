// deno-lint-ignore-file

import { MandarineCore } from "../deps.ts";
import * as Controllers from "./controllers/controllers.ts";
import * as Services from "./services/services.ts";
import * as Repositories from "./repositories/repositories.ts";
import * as Middlewares from "./middlewares/middlewares.ts";
import { DBManagement } from "./database/mongodb.ts";

const controllers = [
    Controllers.UsuarioController,
    Controllers.EventoController,
    Controllers.ArticuloController
];
const services = [
    Services.EventoService,
    Services.UsuarioService,
    Services.AuthService,
    Services.ArticuloService
];
const middleware = [Middlewares.AutorizaAdmin];
const repositories = [];
const configurations = [];
const components = [
    DBManagement,
    Repositories.EventoRepository,
    Repositories.UsuarioRepository,
    Repositories.AuthRepository,
    Repositories.ArticuloRepository
];
const otherModules = [];

new MandarineCore().MVC().run();