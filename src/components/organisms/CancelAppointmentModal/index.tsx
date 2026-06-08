"use client";

import { Modal, Button, toast } from "@heroui/react";
import { Typography } from "@/components/atoms/Typography";
import { SpinnerIcon } from "@/components/atoms/icons/spinner.icon";
import { useCancelAppointment } from "@/services/mutations/useCancelAppointment";
import { formatDate, formatTime, extractErrorMessage } from "@/utils";
import type { Appointment } from "@/types";

interface CancelAppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CancelAppointmentModal = ({
  appointment,
  isOpen,
  onClose,
}: CancelAppointmentModalProps) => {
  const { mutate: cancelAppointment, isPending } = useCancelAppointment();

  const handleConfirm = () => {
    if (!appointment) return;

    cancelAppointment(
      { id: appointment.id, doctorId: appointment.doctorId },
      {
        onSuccess: () => {
          toast.success("Appointment cancelled", {
            description: "The appointment has been cancelled successfully.",
          });
          onClose();
        },
        onError: (err) => {
          toast.danger("Failed to cancel", {
            description: extractErrorMessage(err),
          });
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Trigger
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
          opacity: 0,
        }}
      />
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Cancel Appointment</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              {appointment && (
                <div className="flex flex-col gap-3">
                  <Typography variant="body-sm" className="text-[--muted]">
                    Are you sure you want to cancel this appointment? This action cannot be undone.
                  </Typography>
                  <div
                    className="rounded-xl p-4 flex flex-col gap-1.5"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--danger) 8%, transparent)",
                      border: "1px solid color-mix(in oklab, var(--danger) 20%, transparent)",
                    }}
                  >
                    <AppointmentRow label="Patient" value={appointment.patientName} />
                    <AppointmentRow label="Date" value={formatDate(appointment.scheduledAt)} />
                    <AppointmentRow label="Time" value={formatTime(appointment.scheduledAt)} />
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="ghost" onPress={onClose} isDisabled={isPending}>
                Keep Appointment
              </Button>
              <Button variant="danger" onPress={handleConfirm} isDisabled={isPending}>
                {isPending ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : null}
                {isPending ? "Cancelling..." : "Cancel Appointment"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

const AppointmentRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-[--muted]">{label}</span>
    <span className="font-medium text-[--foreground]">{value}</span>
  </div>
);
