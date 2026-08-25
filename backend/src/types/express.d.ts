import type { Role } from "./usuario";

declare global {
    namespace Express {
        interface Request {
            usuario?: {
                id: number;
                role: Role;
            };
        }
    }
}