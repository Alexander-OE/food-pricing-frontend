// Plain-English names for the technical codes the admin API sends.
import type { RefreshType } from "@/types/admin";

export const REFRESH_LABELS: Record<RefreshType, string> = {
  NBS_PRICES: "Commodity prices",
  MACRO_FEATURES: "Market indicators",
  ACCURACY: "Accuracy scoring",
  PREDICTIONS: "Forecasts",
};

export const REFRESH_TYPES: RefreshType[] = ["NBS_PRICES", "MACRO_FEATURES", "ACCURACY", "PREDICTIONS"];
