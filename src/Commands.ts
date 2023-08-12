import { Command } from "./Command";
import { Save } from "./commands/Save";
import { Load } from "./commands/Load";
import { Reply } from "./commands/Reply";
import { Dump } from "./commands/Dump";
import { Reload } from "./commands/Reload";

export const Commands: Command[] = [Load,Save,Reply,Dump,Reload]; 