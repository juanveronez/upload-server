export class InvalidFileFormat extends Error {
  constructor() {
    super('Invalid file format.')
    this.name = 'InvalidFileFormat'
  }
}
