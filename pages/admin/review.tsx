import {
    Autocomplete,
    Box,
    Button,
    Grid,
    Icon,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import Navbar from "../../components/navbar";
  import CloseIcon from "@mui/icons-material/Close";
  import {
    collection,
    doc,
    getDocs,
    getFirestore,
    setDoc,
  } from "firebase/firestore";
  import { getApp } from "firebase/app";
  import { InspectionBlock } from "../../Types/FB";
  
  const Dashboard = () => {
    const [m, setM] = useState(0);
    const [name, setName] = useState("");
    const [date, setDate] = useState("2022-01-01");
    const [time, setTime] = useState("12:00");
    const [location, setLocation] = useState("CIT");
    const allInspectors = ["Lukas Jarasunas", "Nicky Yarnall"];
    const [inspectors, setInspectors] = useState<string[]>([]);
  
    const [inspections, setInspections] = useState<InspectionBlock[]>([]);
  
    useEffect(() => {
      const fun = async () => {
        const db = getFirestore(getApp());
        const col = collection(db, "InspectionBlock");
        const data = (await getDocs(col)).docs.map((doc) =>
          doc.data()
        ) as InspectionBlock[];
        setInspections(data);
      };
  
      setTimeout(() => fun());
    }, []);
  
    return (
      <>
        <Modal open={m !== 0} onClose={() => setM(0)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "2rem 1rem",
              width: "400px",
              borderRadius: "10px",
            }}
          >
            Hi
          </Box>
        </Modal>
        <Navbar>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                padding: "2rem",
              }}
            >
              <Typography color="black" variant="h5">
                Awaiting Review
              </Typography>
            </Box>
  
            <Box sx={{ 
                    padding: "0 2rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    width: "100%",
                }}>
              {inspections.map((inspection, i) => (
                  <Box
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "10px",
                      width: "100%",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1rem",
                    }}
                    key = {i}
                  >
                    <Box
                      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                    >
                      <Typography variant="h4">{inspection.name} in {inspection.location} </Typography>
                      <Typography>Completed: {inspection.dateCompleted}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "250px"}}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => setM(2)}
                      >
                        <Typography variant="h6">Review</Typography>
                      </Button>
                    </Box>
                  </Box>
              ))}
            </Box>
          </Box>
        </Navbar>
      </>
    );
  };
  
  export default Dashboard;
  