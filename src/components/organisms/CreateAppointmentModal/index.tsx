"use client";

import { Modal } from "@heroui/react";
import { AppointmentForm } from "../AppointmentForm";
import type { Doctor } from "@/types";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (patientName: string) => void;
  preselectedDoctor?: Doctor;
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  onCreated,
  preselectedDoctor,
}: CreateAppointmentModalProps) => (
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
            <Modal.Heading>Schedule Appointment</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <AppointmentForm
              preselectedDoctor={preselectedDoctor}
              onSuccess={(patientName) => {
                onCreated?.(patientName);
                onClose();
              }}
              onCancel={onClose}
            />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </Modal>
);
