/**
 * @description 程序中中断信号相关实现，包含break，continue和return
 *
 * @export
 * @class Break_Signal
 */
export default class Break_Signal {
  private readonly BREAK_SIGNAL: {} = {};
  private readonly CONTINUE_SIGNAL: {} = {};
  private readonly RETURN_SIGNAL: {} = {};

  /**
   * @description 供Map继承使用，单独创建实例没有意义
   *
   * @memberof Break_Signal
   */
  constructor() {}

  /**
   * @description 创建一个break信号
   *
   * @protected
   * @returns
   * @memberof Break_Signal
   */
  protected createBreakSignal() {
    return this.BREAK_SIGNAL;
  }

  /**
   * @description 创建一个continue信号
   *
   * @protected
   * @returns {object}
   * @memberof Break_Signal
   */
  protected createContinueSignal(): object {
    return this.CONTINUE_SIGNAL;
  }

  /**
   * @description 创建一个return信号
   *
   * @protected
   * @param {*} data
   * @returns {object}
   * @memberof Break_Signal
   */
  protected createReturnSignal(data: any): object {
    return { signal: this.RETURN_SIGNAL, data };
  }

  /**
   * @description 判断当前信号是否是break信号
   *
   * @protected
   * @param {*} signal
   * @returns {boolean}
   * @memberof Break_Signal
   */
  protected isBreakSignal(signal): boolean {
    return signal === this.BREAK_SIGNAL;
  }

  /**
   * @description 判断当前信号是否是continue信号
   *
   * @protected
   * @param {*} signal
   * @returns {boolean}
   * @memberof Break_Signal
   */
  protected isContinueSignal(signal): boolean {
    return signal === this.CONTINUE_SIGNAL;
  }

  /**
   * @description 判断当前信号是否是return信号
   *
   * @protected
   * @param {*} signal
   * @returns {boolean}
   * @memberof Break_Signal
   */
  protected isReturnSignal(signal): boolean {
    return signal ? signal.signal === this.RETURN_SIGNAL : false;
  }
}
