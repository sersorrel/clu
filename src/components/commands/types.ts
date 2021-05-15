export interface CommandData {
  command: string[],
}

export type Props = {
  id: string,
  data: CommandData,
  type: string,
  selected: boolean,
  sourcePosition: string,
  targetPosition: string,
}
