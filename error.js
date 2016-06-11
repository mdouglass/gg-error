'use strict'

class BaseError extends Error {

  // [error, ]code, message[, props]
  constructor(...args) {
    super()

    if (args[0] instanceof Error)
      this.cause = args.shift()
    this.code = args.shift()
    this.message = args.shift()
    this.props = args.shift()

    Error.captureStackTrace(this, this.constructor)

    if (this.cause) {
      const oldStack = Reflect.getOwnPropertyDescriptor(this, 'stack')
      Reflect.defineProperty(this, 'stack', {
        get: function() {
          return oldStack.get.call(this) + '\nCaused by ' + this.cause.stack
        }
      })
    }

    if (!this.code)
      throw new BaseError(this, 'error.code-missing', 'BaseError must be thrown with a code')
    else if (!this.message)
      throw new BaseError(this, 'error.message-missing', 'BaseError must be thrown with a message')
  }

  get name() {
    return this.constructor.name
  }
}

module.exports = BaseError
