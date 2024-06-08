import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "85vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        THERE IS NOTHING HERE...!!!
        <Button
          variant="contained"
          type="button"
          size="large"
          onClick={() => navigate("/product")}
          sx={{
            borderRadius: "50px",
          }}
        >
          GO TO PRODUCT LIST PAGE
        </Button>
      </div>
    </>
  );
};
