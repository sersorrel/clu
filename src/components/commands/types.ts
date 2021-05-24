export interface BaseCommandData {
  commandName: string,
  [extra: string]: unknown,
}

export interface BaseProps {
  id: string,
  data: BaseCommandData,
  type: string,
  selected: boolean,
  sourcePosition: string,
  targetPosition: string,
}
