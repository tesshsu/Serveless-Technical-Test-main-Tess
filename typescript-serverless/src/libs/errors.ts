export class EntityNotFound extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFound extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        customMessage: ''
      }
    }
  }
}
