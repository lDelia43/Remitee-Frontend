import type { Metadata } from "next";
import { DoctorsTemplate } from "@/components/templates/DoctorsTemplate";

export const metadata: Metadata = {
  title: "Doctors",
};

export default function DoctorsPage() {
  return <DoctorsTemplate />;
}
