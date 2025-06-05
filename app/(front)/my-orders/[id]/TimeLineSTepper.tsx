import * as React from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  useMediaQuery,
  StepIconProps,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface StatusHistoryItem {
  status: string;
  note: string;
  changedAt: string;
}

interface Props {
  statuses: string[];
  initialStep?: number; // zero-based index
  statusHistory?: StatusHistoryItem[];
}

function ColorStepIcon(props: StepIconProps & { completedStep: boolean }) {
  const { active, completedStep, className, icon } = props;

  if (completedStep) {
    // Completed: green check icon with bigger size
    return (
      <CheckCircleIcon
        color="success"
        className={className}
        sx={{ fontSize: 30 }}
      />
    );
  }

  // Active or inactive step: show circle with step number
  const color = active ? "#1976d2" : "#bdbdbd"; // blue or grey

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

  const [activeStep, setActiveStep] = React.useState(initialStep);

  // Map for quick lookup of note and changedAt by normalized status
  const historyMap = React.useMemo(() => {
    const map = new Map<string, { note: string; changedAt: string }>();
    statusHistory.forEach(({ status, note, changedAt }) => {
      map.set(status.toLowerCase().replace(/[\s-]/g, ""), { note, changedAt });
    });
    return map;
  }, [statusHistory]);

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, statuses.length));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Helper to get note & changedAt for a status
  const getHistory = (status: string) => {
    return historyMap.get(status.toLowerCase().replace(/[\s-]/g, ""));
  };

  if (isMobile) {
    return (
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
          {statuses.map((status, index) => {
            const history = getHistory(status);
            const completedStep = index < activeStep;
            const isActive = index === activeStep;

            return (
              <Step key={status} completed={completedStep}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      color: completedStep
                        ? "success.main"
                        : isActive
                          ? "primary.main"
                          : "text.disabled",
                      "&.Mui-completed": {
                        color: "success.main",
                      },
                      svg: {
                        color: completedStep ? "success.main" : undefined,
                      },
                    },
                  }}
                  sx={{
                    "& .MuiStepLabel-label": {
                      color: completedStep
                        ? "success.main"
                        : isActive
                          ? "primary.main"
                          : "text.disabled",
                      fontWeight: isActive ? "bold" : "normal",
                    },
                  }}
                >
                  <Box>
                    <Typography>{status}</Typography>
                    {history && (
                      <>
                        <Typography
                          sx={{ fontStyle: "italic", fontSize: "0.875rem" }}
                          color="text.secondary"
                        >
                          {history.note}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {new Date(history.changedAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            hour12: true, // 12-hour format with AM/PM
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </Typography>
                      </>
                    )}
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    );
  }

  // Horizontal Stepper with alternative labels for desktop
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {statuses.map((status, index) => {
          const history = getHistory(status);
          const completedStep = index < activeStep;

          return (
            <Step key={status} completed={completedStep}>
              <StepLabel
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
                        {new Date(history.changedAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          hour12: true, // 12-hour format with AM/PM
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </Typography>
                    </>
                  ) : null
                }
                StepIconComponent={(stepIconProps) => (
                  <ColorStepIcon
                    {...stepIconProps}
                    completedStep={completedStep}
                  />
                )}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: completedStep
                      ? theme.palette.success.main
                      : index === activeStep
                        ? theme.palette.primary.main
                        : theme.palette.text.disabled,
                    fontWeight: index === activeStep ? "bold" : "normal",
                  },
                }}
              >
                {status}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
