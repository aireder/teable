/**
 * Hook types - simplified from SDK hooks
 */

export interface IButtonClickStatus {
  recordId?: string;
  fieldId?: string;
  loading?: boolean;
  error?: string | null;
}

export type IButtonClickStatusHook = () => {
  status: IButtonClickStatus;
  trigger: (recordId: string, fieldId: string) => Promise<void>;
  reset: () => void;
};