/**
 * Field and cell value types - simplified from @teable/core
 */

/**
 * Button field options
 */
export interface IButtonFieldOptions {
  text?: string;
  icon?: string;
  action?: 'openUrl' | 'triggerScript';
  url?: string;
  scriptId?: string;
}

/**
 * Button field cell value
 */
export interface IButtonFieldCellValue {
  label?: string;
  disabled?: boolean;
}