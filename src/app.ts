import { MandarineCore } from "../deps.ts";
import * as Controllers from "./controllers/controllers.ts";
import * as Services from "./services/services.ts";
import * as Repositories from "./repositories/repositories.ts";
import { DBManagement } from "./database/mongodb.ts";

const controllers = [Controllers.UsuarioController, Controllers.EventoController];
const services = [Services.EventoService, Services.UsuarioService];
const middleware = [];
const repositories = [];
const configurations = [];
const components = [DBManagement, Repositories.EventoRepository, Repositories.UsuarioRepository];
const otherModules = [];

new MandarineCore().MVC().run();