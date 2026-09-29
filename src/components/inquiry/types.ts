import { steps } from "@/content/inquiry";
import type { Inquiry } from "@/lib/inquiry/model";

/** View index of the summary screen (after the last question). */
export const REVIEW = steps.length;

export type Phase = "form" | "sending" | "success" | "error";

export type FlowState = {
  data: Inquiry;
  view: number;
  /** Furthest step the visitor has reached — lets the progress rail jump back. */
  reached: number;
  currencyTouched: boolean;
};

export function stepName(view: number): string {
  return view >= REVIEW ? "review" : steps[view].key;
}
