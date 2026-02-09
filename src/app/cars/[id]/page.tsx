/* eslint-disable @typescript-eslint/no-explicit-any */
import VehicleDetails from "@/components/VehicleDetails";

export default function VehiclePage({
  params,
}: { params: { id: string } } | any) {
  return <VehicleDetails stockId={(params as { id: string }).id} />;
}
