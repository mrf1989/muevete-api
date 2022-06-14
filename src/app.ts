// deno-lint-ignore-file

import { MandarineCore } from "../deps.ts";
import * as Controllers from "./controllers/controllers.ts";
import * as Services from "./services/services.ts";
import * as Repositories from "./repositories/repositories.ts";
import { DBManagement } from "./database/mongodb.ts";

const controllers = [
  Controllers.ArticuloController,
  Controllers.DorsalController,
  Controllers.EsfuerzoController,
  Controllers.EventoController,
  Controllers.UsuarioController,
];
const services = [
  Services.ArticuloService,
  Services.AuthService,
  Services.EsfuerzoService,
  Services.DorsalService,
  Services.EventoService,
  Services.UsuarioService,
];
const middleware = [];
const repositories = [];
const configurations = [Controllers.WebMvcConfigurer];
const components = [
  DBManagement,
  Repositories.ArticuloRepository,
  Repositories.DorsalRepository,
  Repositories.EsfuerzoRepository,
  Repositories.EventoRepository,
  Repositories.UsuarioRepository,
];
const otherModules = [];

new MandarineCore().MVC().run();
