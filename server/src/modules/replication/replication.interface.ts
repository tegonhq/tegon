

export type logChangeType = {
    kind: string,
    schema: string,
    table: string,
    columnnames: string[],
    columnvalues: string[],
    columntypes: string[],
    oldkeys: Record<string, string[]>
}

export type logType = {
    change: logChangeType[]
}

export const tablesToSendMessagesFor = new Map([
    ['workspace', true]
  ]);