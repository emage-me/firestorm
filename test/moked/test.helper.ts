import firestorm from '../../src/moked'

export const clear = async (): Promise<void> => {
  firestorm.data = {}
}
