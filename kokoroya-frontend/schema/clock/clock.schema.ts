import { BaseResponse } from "@/lib/api";

export interface PunchResponseData {
  action: "in" | "out";
  name: string;
  at: string;
}
export type PunchResponse = BaseResponse<PunchResponseData>;
