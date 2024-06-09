import { Alert, Snackbar } from "@mui/material";
import {
  createContext,
  type ReactNode,
  useCallback,
  useState,
  useMemo,
} from "react";

export interface IGlobalContext {
  showAlert: (config: AlertConfigTypes) => void;
  hideAlert: () => void;
}

export const GlobalContext = createContext<IGlobalContext | null>(null);

export interface AlertConfigTypes {
  open?: boolean;
  message: ReactNode;
  type?: "success" | "warning" | "error" | "info";
  duration?: number;
}

const INITIAL_ALERT_CONFIG = {
  open: false,
  message: "",
  duration: 3000,
};

function GlobalProvider({ children }: { children: ReactNode }) {
  const [alertConfig, setAlertConfig] =
    useState<AlertConfigTypes>(INITIAL_ALERT_CONFIG);

  const showAlert = useCallback(
    ({ open = true, duration = 3000, ...config }: AlertConfigTypes) =>
      setAlertConfig({
        ...config,
        open,
        duration,
      }),
    []
  );

  const hideAlert = useCallback(() => {
    setAlertConfig((prevConfig) => ({
      ...prevConfig,
      open: false,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      showAlert,
      hideAlert,
    }),
    [showAlert, hideAlert]
  );

  return (
    <div className="bg-neutrals-white">
      <GlobalContext.Provider value={contextValue}>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={alertConfig.open}
          style={{ width: "100%" }}
          onClose={hideAlert}
          autoHideDuration={alertConfig.duration}
        >
          <Alert
            severity={alertConfig.type}
            variant="filled"
            className="!text-light-white"
            onClose={hideAlert}
            sx={{ color: "white" }}
          >
            {alertConfig.message}
          </Alert>
        </Snackbar>
        {children}
      </GlobalContext.Provider>
    </div>
  );
}

export default GlobalProvider;
