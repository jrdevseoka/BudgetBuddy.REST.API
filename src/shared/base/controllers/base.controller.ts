import { Controller, Type } from '@nestjs/common'

/**
 * Base Controller Class
 *
 * This base controller provides a dynamic route path for controllers that inherit from it. The route path
 * is based on the name of the controller class, with "Controller" removed from the end.
 */
@Controller()
export class BaseController {
  constructor() {
    const route = this.getRoutePath()
    Controller(route)(this.constructor as Type<unknown>)
  }
  /**
   * Get Dynamic Route Path
   *
   * This method generates a dynamic route path for the controller based on the name of the controller class,
   * with "Controller" removed. It appends "1.0/" and makes the name lowercase, resulting in a versioned route path.
   *
   * @returns {string} The dynamically generated route path for the controller.
   */
  private getRoutePath(): string {
    const className = this.constructor.name
    const name = className.replace(/Controller$/, '')
    return `1.0/${name.toLowerCase()}s`
  }
}
