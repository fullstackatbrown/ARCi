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
  deleteDoc,
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
  const [error, setError] = useState("");
  const [inspections, setInspections] = useState<{
    [name: string]: InspectionBlock;
  }>({});

  useEffect(() => {
    if (m === 0) {
      setError("");
    }
  }, [m]);

  useEffect(() => {
    const fun = async () => {
      const db = getFirestore(getApp());
      const col = collection(db, "InspectionBlock");
      const data = (await getDocs(col)).docs;
      const out = {} as {
        [name: string]: InspectionBlock;
      };
      data.forEach((doc) => {
        const d = doc.data() as InspectionBlock;
        out[d.name] = d;
      });
      setInspections(out);
    };

    setTimeout(() => fun());
  }, []);

  const select = (inspector: string) => {
    if (allInspectors.indexOf(inspector) !== -1) {
      setInspectors((inspectors) => [
        ...inspectors.filter((name) => name !== inspector),
        inspector,
      ]);
    }
  };

  const remove = (inspector: string) => {
    setInspectors((inspectors) =>
      inspectors.filter((name) => name !== inspector)
    );
  };

  const editInspection = (inspection: InspectionBlock) => {
    setDate(inspection.date);
    setTime(inspection.time);
    setLocation(inspection.location);
    setInspectors(inspection.inspectors);
    setName(inspection.name);
    setM(1);
  };

  const deleteInspection = async (inspection: InspectionBlock) => {
    const db = getFirestore(getApp());
    await deleteDoc(doc(db, "InspectionBlock", inspection.name));
    setInspections((d) => {
      d = { ...d };
      delete d[inspection.name];
      return d;
    });
  };

  const create = async () => {
    if (name === "") {
      setError("Fill out name");
    } else if (inspectors.length === 0) {
      setError("Add atleast 1 inspector");
    } else if (m === 2 && name in inspections) {
      setError("Name has already been taken");
    } else {
      const db = getFirestore(getApp());
      const d = doc(db, "InspectionBlock", name);
      const newData = { date, time, location, inspectors, name };
      await setDoc(d, newData, { merge: true });
      setInspections((d) => {
        d = { ...d };
        d[name] = newData;
        return d;
      });
      setM(0);
      setName("");
    }
  };

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
          <Typography variant="h4">
            {m === 1 ? "Edit " : "Create "} Inspection Block
          </Typography>
          {error !== "" && <Typography color="error">{error}</Typography>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: "300px" }}
          />
          <TextField
            id="date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: "300px" }}
          />
          <TextField
            id="time"
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: "300px" }}
          />
          <Box>
            <InputLabel id="location">Lab Location</InputLabel>
            <Select
              labelId="location"
              value={location}
              label="Lab Location"
              onChange={(e) => setLocation(e.target.value)}
              sx={{ width: "300px" }}
            >
              <MenuItem value={"CIT"}>CIT</MenuItem>
              <MenuItem value={"SCILI"}>SCILI</MenuItem>
            </Select>
          </Box>
          <Autocomplete
            disablePortal
            options={allInspectors}
            sx={{ width: "300px" }}
            renderInput={(params) => (
              <TextField {...params} label="Inspectors" />
            )}
            onChange={(event, newValue) => {
              if (newValue) select(newValue);
            }}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", width: "300px" }}>
            {inspectors.map((inspector) => (
              <Button
                key={inspector}
                sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
                onClick={() => remove(inspector)}
                color="appBlack"
              >
                <Typography>{inspector}</Typography>
                <Icon component={CloseIcon} />
              </Button>
            ))}
          </Box>
          <Button variant="contained" onClick={create}>
            {m === 1 ? "Edit" : "Create"}
          </Button>
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
              Dashboard
            </Typography>
            <Button color="primary" variant="contained" onClick={() => setM(2)}>
              Add Inspection
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ padding: "0 2rem 2rem" }}>
            {Object.keys(inspections).map((key, i) => (
              <Grid item xs={4} key={i}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    width: "100%",
                    height: "200px",
                    display: "flex",
                    padding: "1rem",
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                  >
                    <Typography>Name: {inspections[key].name}</Typography>
                    <Typography>Date: {inspections[key].date}</Typography>
                    <Typography>Time: {inspections[key].time}</Typography>
                    <Typography>
                      Location: {inspections[key].location}
                    </Typography>
                    <Typography>
                      Inspectors: {inspections[key].inspectors.join(", ")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                      color="appBlack"
                      onClick={() => editInspection(inspections[key])}
                    >
                      Edit
                    </Button>
                    <Button
                      color="appBlack"
                      onClick={() => deleteInspection(inspections[key])}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Navbar>
    </>
  );
};

export default Dashboard;
