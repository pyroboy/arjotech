export const getComplexityDescription = (level: number): string => {
  switch (level) {
    case 1:
      return "Simple";
    case 2:
      return "Detailed";
    case 3:
      return "Intricate";
    default:
      return "Unknown";
  }
};

export const getFreedomDescription = (value: number): string => {
  if (value <= 20) return "Very Specific";
  if (value <= 40) return "Mostly Specific";
  if (value <= 60) return "Balanced";
  if (value <= 80) return "Mostly Free";
  return "Full Creative Freedom";
};

export const formatCurrency = (amount: number): string => {
  return `₱${amount.toLocaleString("en-PH")}`;
};

export const formatDuration = (totalMinutes: number): string => {
  if (!totalMinutes || isNaN(totalMinutes) || totalMinutes <= 0) return "TBD";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = "";
  if (hours > 0) result += `${hours} hr${hours > 1 ? "s" : ""}`;
  if (minutes > 0) {
    if (result) result += " ";
    result += `${minutes} min`;
  }
  return result || "TBD";
};

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show";

export const getStatusBadgeVariant = (status: AppointmentStatus): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
    case "confirmed":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "completed":
      return "bg-tech-500/20 text-tech-300 border border-tech-500/30";
    case "cancelled":
      return "bg-red-500/20 text-red-300 border border-red-500/30";
    case "no-show":
      return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
  }
};
