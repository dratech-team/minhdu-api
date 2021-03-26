export interface IAppVersion {
  /**
   * @description when making incompatible API changes
   */
  major: number;

  /**
   * @description when adding functionality in a backwards compatible manner
   */
  minor: number;

  /**
   * @description when making backwards compatible bug fixes
   */
  patch: number;
}
