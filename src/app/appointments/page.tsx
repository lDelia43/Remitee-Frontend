import type { Metadata } from "next";
import { AppointmentsTemplate } from "@/components/templates/AppointmentsTemplate";

export const metadata: Metadata = {
  title: "Appointments",
};

export default function AppointmentsPage() {
  return <AppointmentsTemplate />;
}
