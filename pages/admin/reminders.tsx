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
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getApp } from "firebase/app";
import { InspectionBlock } from "../../Types/FB";
import ReactTimeAgo from "react-time-ago";

interface reminder {
  message: string;
  from: string;
  to: string;
  date: number;
}

const Reminders = () => {
  const [m, setM] = useState(0);
  const [error, setError] = useState("");
  const [reminders, setReminders] = useState<{
    Sent?: reminder[];
    Recieved?: reminder[];
  }>({});
  const [option, setOption] = useState<"Sent" | "Recieved">("Sent");
  const allUsers = ["Lukas Jarasunas", "Nicky Yarnall", "Admin"];
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (m === 0) {
      setError("");
    }
  }, [m]);

  const select = (to: string) => {
    if (allUsers.indexOf(to) !== -1) {
      setSelectedUsers((cur) => [...cur.filter((name) => name !== to), to]);
    }
  };

  const remove = (to: string) => {
    setSelectedUsers((cur) => cur.filter((name) => name !== to));
  };

  const send = async () => {
    if (message === "") {
      setError("Fill out message");
    } else if (selectedUsers.length === 0) {
      setError("Add atleast 1 recipient");
    } else {
      const db = getFirestore(getApp());
      for (const user of selectedUsers) {
        const date = Date.now();
        const d = doc(db, "Reminders", "Admin: " + user + " " + date);
        const newData = { message, from: "Admin", to: user, date };
        await setDoc(d, newData);
        setReminders((d) => {
          d = { ...d };
          if (!("Sent" in d)) {
            d["Sent"] = [];
          }
          d["Sent"].push(newData);

          if (user === "Admin") {
            if (!("Recieved" in d)) {
              d["Recieved"] = [];
            }
            d["Recieved"].push(newData);
          }
          return d;
        });
      }

      setM(0);
      setMessage("");
      setSelectedUsers([]);
    }
  };

  useEffect(() => {
    const fun = async () => {
      if (!(option in reminders)) {
        const db = getFirestore(getApp());
        const col = collection(db, "Reminders");
        const q =
          option === "Sent"
            ? query(col, where("from", "==", "Admin"))
            : query(col, where("to", "==", "Admin"));
        const data = (await getDocs(q)).docs.map((doc) =>
          doc.data()
        ) as reminder[];
        setReminders((cur) => {
          cur = { ...cur };
          cur[option] = data;
          return cur;
        });
      }
    };

    setTimeout(() => fun());
  }, [option]);

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
          <Typography variant="h4">Send Notification</Typography>
          {error !== "" && <Typography color="error">{error}</Typography>}
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: "300px" }}
          />
          <Autocomplete
            disablePortal
            options={allUsers}
            sx={{ width: "300px" }}
            renderInput={(params) => (
              <TextField {...params} label="Recipients" />
            )}
            onChange={(event, newValue) => {
              if (newValue) select(newValue);
            }}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", width: "300px" }}>
            {selectedUsers.map((user) => (
              <Button
                key={user}
                sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
                onClick={() => remove(user)}
                color="appBlack"
              >
                <Typography>{user}</Typography>
                <Icon component={CloseIcon} />
              </Button>
            ))}
          </Box>
          <Button variant="contained" onClick={send}>
            Send Notification
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
              width: "100%",
              padding: "2rem",
            }}
          >
            <Typography color="black" variant="h5">
              Notification Center
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Button
              color="primary"
              variant="contained"
              onClick={() => setM(1)}
              sx={{ margin: "0 1rem 0 0" }}
            >
              Send Reminder
            </Button>
            <Select
              value={option}
              onChange={(e) => setOption(e.target.value as "Sent" | "Recieved")}
            >
              <MenuItem value={"Sent"}>Sent</MenuItem>
              <MenuItem value={"Recieved"}>Recieved</MenuItem>
            </Select>
          </Box>
          <Grid container spacing={2} sx={{ padding: "0 2rem 2rem" }}>
            {option in reminders &&
              reminders[option].map((reminder, i) => (
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
                      <Typography>
                        From: {reminder.from}, To: {reminder.to}
                      </Typography>
                      <Typography>Message: {reminder.message}</Typography>
                      <ReactTimeAgo date={reminder.date} locale="en-US" />
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

export default Reminders;
