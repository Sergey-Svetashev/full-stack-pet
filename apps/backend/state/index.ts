export type Mail = {
  name: string;
  address: string;
  request: string;
};

export type State = {
  mails: Array<Mail>;
  accessToken?: string;
};

/**
 *  Kept it as a const not as a class due to absence of any complexity or additional methods.
 */
export const appState: State = { mails: [] };
