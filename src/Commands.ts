import { Command } from "./Command";
import { Save } from "./commands/Save";
import { Load } from "./commands/Load";
import { Reply } from "./commands/Reply";

export const Commands: Command[] = [Load,Save,Reply]; 