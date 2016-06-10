'use strict'

const { expect } = require('chai')
const util = require('util')
const BaseError = require('../error')

describe('BaseError', () => {
  it('has the code and message passed to its constructor available as properties', () => {
    try {
      throw new BaseError('my-code', 'my-message')
    } catch (e) {
      expect(e.name).equals('BaseError')
      expect(e.code).equals('my-code')
      expect(e.message).equals('my-message')
      expect(e.cause).equals(undefined)
      expect(e.props).equals(undefined)
    }
  })

  it('if optional Error is passed to the constructor, it is recognized as the cause', () => {
    const cause = new Error('root cause')
    try {
      throw new BaseError(cause, 'cause-code', 'cause-message')
    } catch (e) {
      expect(e.name).equals('BaseError')
      expect(e.code).equals('cause-code')
      expect(e.message).equals('cause-message')
      expect(e.cause).equals(cause)
      expect(e.props).equals(undefined)
    }
  })

  it('if optional Error is passed to the constructor, the stack track is modified to reflect it', () => {
    const cause = new Error('root message')
    try {
      throw new BaseError(cause, 'cause-code', 'cause-message')
    } catch (e) {
      expect(e.stack).match(/^BaseError: cause-message/)
      expect(e.stack).match(/^Caused by Error: root message/m)
    }
  })

  it('if optional properties are passed to the constructor, they are attached to the error', () => {
    const props = { foo: 'bar' }
    try {
      throw new BaseError('props-code', 'props-message', props)
    } catch (e) {
      expect(e.name).equals('BaseError')
      expect(e.code).equals('props-code')
      expect(e.message).equals('props-message')
      expect(e.cause).equals(undefined)
      expect(e.props).equals(props)
    }
  })

  it('is identified as an error by util#isError', () => {
    try {
      throw new BaseError('code', 'message')
    } catch (e) {
      expect(util.isError(e)).equals(true)
    }
  })

  it('the name property reflects a class derived from BaseError', () => {
    try {
      class MyError extends BaseError { }
      throw new MyError('my-code', 'my-message')
    } catch (e) {
      expect(e.name).equals('MyError')
      expect(e.code).equals('my-code')
      expect(e.message).equals('my-message')
      expect(e.cause).equals(undefined)
      expect(e.props).equals(undefined)
    }
  })

  it('fails if code is not valid', () => {
    try {
      throw new BaseError()
    } catch (e) {
      expect(e.name).equals('BaseError')
      expect(e.code).equals('error.code-missing')
      expect(e.message).equals('BaseError must be thrown with a code')
      expect(e.props).equals(undefined)

      expect(e.cause.name).equals('BaseError')
      expect(e.cause.code).equals(undefined)
      expect(e.cause.message).equals(undefined)
      expect(e.cause.props).equals(undefined)
    }
  })

  it('fails if message is not valid', () => {
    try {
      throw new BaseError('code')
    } catch (e) {
      expect(e.name).equals('BaseError')
      expect(e.code).equals('error.message-missing')
      expect(e.message).equals('BaseError must be thrown with a message')
      expect(e.props).equals(undefined)

      expect(e.cause.name).equals('BaseError')
      expect(e.cause.code).equals('code')
      expect(e.cause.message).equals(undefined)
      expect(e.cause.props).equals(undefined)
    }
  })
})
