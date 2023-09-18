

export interface Command {
    name: string;
    description: string;
    inputs: CommandInput[];
    action: (context: CommandContext) => Promise<unknown>
}

export interface CommandInput {
    name: string;
    description: string;
    type: string;
    required: boolean;
}

export interface CommandContext {
    inputs: Record<string, any>;
}