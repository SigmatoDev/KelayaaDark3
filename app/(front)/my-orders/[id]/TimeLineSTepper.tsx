"use client";

import * as React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useMediaQuery,
  StepIconProps,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface StatusHistoryItem {
  status: string;
  note: string;
  changedAt: string;
}

interface Props {
  statuses: string[];
  initialStep?: number;
  statusHistory?: StatusHistoryItem[];
}

function CustomStepIcon(
  props: StepIconProps & { showCancel: boolean; completedStep: boolean }
) {
  const { active, showCancel, completedStep, className, icon } = props;
  const theme = useTheme();

  if (showCancel) {
    return (
      <CancelIcon color="error" className={className} sx={{ fontSize: 28 }} />
    );
  }

  if (completedStep) {
    return (
      <CheckCircleIcon
        color="success"
        className={className}
        sx={{ fontSize: 28 }}
      />
    );
  }

  const color = active
    ? theme.palette.primary.main
    : theme.palette.text.disabled;

  return (
    <Box
      className={className}
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        backgroundColor: color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 16,
        userSelect: "none",
      }}
    >
      {icon}
    </Box>
  );
}

export default function ResponsiveStatusStepper({
  statuses,
  initialStep = 0,
  statusHistory = [],
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const historyMap = React.useMemo(() => {
    const map = new Map<string, { note: string; changedAt: string }>();
    statusHistory.forEach(({ status, note, changedAt }) => {
      map.set(status.toLowerCase().replace(/[\s-]/g, ""), { note, changedAt });
    });
    return map;
  }, [statusHistory]);

  const getHistory = (status: string) =>
    historyMap.get(status.toLowerCase().replace(/[\s-]/g, ""));

  const cancelledIndex = statusHistory.findIndex(
    (s) => s.status.toLowerCase() === "cancelled"
  );

  const renderDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: true,
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
      : "";

  const renderStepper = (orientation: "horizontal" | "vertical") => (
    <Stepper
      activeStep={initialStep}
      alternativeLabel={orientation === "horizontal"}
      orientation={orientation}
    >
      {statuses
        .filter((status) => {
          const isCancelled = status.toLowerCase() === "cancelled";
          if (isCancelled) {
            return cancelledIndex !== -1; // only show if cancelled in history
          }
          return true;
        })
        .map((status, index) => {
          const normalized = status.toLowerCase().replace(/[\s-]/g, "");
          const history = getHistory(status);

          const isCancelledStatus =
            status.toLowerCase() === "cancelled" && cancelledIndex !== -1;

          const isCompleted = !!history && !isCancelledStatus;
          const isAfterCancelled =
            cancelledIndex !== -1 &&
            statuses.findIndex(
              (s) => s.toLowerCase() === status.toLowerCase()
            ) > cancelledIndex;

          const showCancelIcon = isCancelledStatus || isAfterCancelled;

          const labelColor =
            isCancelledStatus || isAfterCancelled
              ? theme.palette.text.disabled
              : isCompleted
                ? theme.palette.success.main
                : theme.palette.text.disabled;

          return (
            <Step key={status} completed={isCompleted}>
              <StepLabel
                StepIconComponent={(stepIconProps) => (
                  <CustomStepIcon
                    {...stepIconProps}
                    completedStep={isCompleted}
                    showCancel={showCancelIcon}
                  />
                )}
                optional={
                  history ? (
                    <>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {history.note}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {renderDate(history.changedAt)}
                      </Typography>
                    </>
                  ) : null
                }
                sx={{
                  "& .MuiStepLabel-label": {
                    color: labelColor,
                    fontWeight: isCancelledStatus ? "bold" : "normal",
                  },
                }}
              >
                {isCancelledStatus ? "Cancelled" : status}
              </StepLabel>
            </Step>
          );
        })}
    </Stepper>
  );

  return (
    <Box sx={{ width: "100%" }}>
      {isMobile ? renderStepper("vertical") : renderStepper("horizontal")}
    </Box>
  );
}
