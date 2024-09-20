// Para hacer publica la carpeta publics cuando se suba el prpoyecto a un servidor

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;