// Error Location based on the parsley -json output
export type ErrLocation = {
  fname: string;
  lnum: number;
  bol: number;
  cnum: number;
};

// Error Message based on the parsley -json output
export type ErrMessage = {
  errm_start: ErrLocation;
  errm_end: ErrLocation;
  errm_ghost: boolean;
  errm_reason: string;
};
