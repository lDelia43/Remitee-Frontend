"use client";

import { Table, Button, Skeleton } from "@heroui/react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { AppointmentStatusBadge } from "@/components/molecules/AppointmentStatusBadge";
import { SearchInput } from "@/components/molecules/SearchInput";
import { EmptyState } from "@/components/atoms/EmptyState";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { CalendarIcon } from "@/components/atoms/icons/calendar.icon";
import { useAllAppointments } from "@/services/queries/useAppointments";
import { useDoctors } from "@/services/queries/useDoctors";
import { formatDate, formatTime } from "@/utils";
import type { Appointment, AppointmentStatus } from "@/types";

interface AppointmentTableProps {
  onCancelAppointment: (appointment: Appointment) => void;
  externalSearch?: string;
}

const PAGE_SIZE = 8;
type SortKey = "patientName" | "doctorName" | "scheduledAt" | "status";

const statusOptions: { label: string; value: AppointmentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Cancelled", value: "Cancelled" },
];

export const AppointmentTable = ({
  onCancelAppointment,
  externalSearch,
}: AppointmentTableProps) => {
  const { appointments, isLoading, isError, error } = useAllAppointments();
  const { data: doctors = [] } = useDoctors();
  const [search, setSearch] = useState(externalSearch ?? "");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("scheduledAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (externalSearch !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing internal state from external prop
      setSearch(externalSearch);
      setPage(1);
    }
  }, [externalSearch]);

  const doctorMap = useMemo(
    () => new Map(doctors.map((d) => [d.id, `${d.name} — ${d.specialty}`])),
    [doctors]
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...appointments]
      .filter((a) => {
        const doctorLabel = doctorMap.get(a.doctorId)?.toLowerCase() ?? "";
        const matchesSearch =
          !q || a.patientName.toLowerCase().includes(q) || doctorLabel.includes(q);
        const matchesStatus = statusFilter === "all" || a.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let aVal: string;
        let bVal: string;
        if (sortKey === "doctorName") {
          aVal = doctorMap.get(a.doctorId) ?? "";
          bVal = doctorMap.get(b.doctorId) ?? "";
        } else {
          aVal = String(a[sortKey as keyof Appointment] ?? "");
          bVal = String(b[sortKey as keyof Appointment] ?? "");
        }
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
  }, [appointments, search, statusFilter, sortKey, sortDir, doctorMap]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : "Failed to load appointments."}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          key={externalSearch}
          placeholder="Search patient or doctor..."
          onSearch={handleSearch}
          defaultValue={externalSearch ?? ""}
          className="flex-1"
        />
        <div className="flex gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1);
              }}
              className="px-3 py-1.5 text-xs rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: statusFilter === opt.value ? "var(--accent)" : "var(--default)",
                color:
                  statusFilter === opt.value ? "var(--accent-foreground)" : "var(--foreground)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Appointments">
                <Table.Header>
                  <Table.Column isRowHeader>
                    <SortHeader
                      label="Patient"
                      sortKey="patientName"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                  </Table.Column>
                  <Table.Column>
                    <SortHeader
                      label="Doctor"
                      sortKey="doctorName"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                  </Table.Column>
                  <Table.Column>
                    <SortHeader
                      label="Date"
                      sortKey="scheduledAt"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                  </Table.Column>
                  <Table.Column>Time</Table.Column>
                  <Table.Column>
                    <SortHeader
                      label="Status"
                      sortKey="status"
                      current={sortKey}
                      dir={sortDir}
                      onSort={handleSort}
                    />
                  </Table.Column>
                  <Table.Column> </Table.Column>
                </Table.Header>
                <Table.Body>
                  {paginated.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={6}>
                        <EmptyState
                          title="No appointments found"
                          description={
                            search || statusFilter !== "all"
                              ? "Try adjusting your search or filters."
                              : "No appointments scheduled yet."
                          }
                          icon={<CalendarIcon className="w-12 h-12" strokeWidth={1} />}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    paginated.map((appointment) => (
                      <Table.Row key={appointment.id}>
                        <Table.Cell>
                          <span className="font-medium">{appointment.patientName}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-[--muted]">
                            {doctorMap.get(appointment.doctorId) ?? appointment.doctorId}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-[--muted]">
                            {formatDate(appointment.scheduledAt)}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-[--muted]">
                            {formatTime(appointment.scheduledAt)}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <AppointmentStatusBadge status={appointment.status} />
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="sm"
                            variant="ghost"
                            isDisabled={
                              appointment.status === "Cancelled" ||
                              new Date(appointment.scheduledAt) < new Date()
                            }
                            onPress={() => onCancelAppointment(appointment)}
                            style={{
                              color:
                                appointment.status === "Cancelled" ||
                                new Date(appointment.scheduledAt) < new Date()
                                  ? "var(--muted)"
                                  : "var(--danger)",
                            }}
                          >
                            Cancel
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          {pages > 1 && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-[--muted]">{filtered.length} results</span>
              <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3)
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="w-7 h-7 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-xs text-[--muted]">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className="min-w-7 h-7 px-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              backgroundColor: currentPage === p ? "var(--accent)" : "transparent",
              color: currentPage === p ? "var(--accent-foreground)" : "var(--muted)",
              border: currentPage === p ? "none" : "1px solid var(--border)",
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="w-7 h-7 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

const SortHeader = ({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) => {
  const isActive = current === sortKey;
  return (
    <Button
      variant="ghost"
      size="sm"
      onPress={() => onSort(sortKey)}
      className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider px-0 h-auto"
      style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}
    >
      {label}
      {isActive && (
        <svg
          className={`w-3 h-3 transition-transform ${dir === "desc" ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
      )}
    </Button>
  );
};

const TableSkeleton = () => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-4 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--default)" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1 rounded-md" />
      ))}
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex gap-4 px-3 py-3">
        {Array.from({ length: 6 }).map((__, j) => (
          <Skeleton key={j} className="h-5 flex-1 rounded-md" />
        ))}
      </div>
    ))}
  </div>
);
