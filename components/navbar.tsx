import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const Navbar = ({ children }: { children?: ReactNode }) => {
  const router = useRouter();
  const options = [
    { name: "Home", href: "" },
    { name: "Dashboard", href: "dashboard" },
    { name: "Review", href: "review" },
    { name: "Organizations", href: "organizations" },
    { name: "Administrators", href: "administrators" },
    { name: "Reminders", href: "reminders" },
    { name: "Profile", href: "profile" },
  ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#E6EBFD",
        display: "flex",
      }}
    >
      <Box
        sx={{
          background:
            "linear-gradient(180deg, #F9FAFF -8.86%, rgba(249, 250, 255, 0) 118.13%)",
          width: "345px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: "0.25rem",
            margin: "1rem 0 0",
          }}
        >
          <Image src="/logo.png" width="48px" height="48px" alt="Logo" />
          <Typography variant="h4">ARCi</Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            {options.map((option) => (
              <Box key={option.name}>
                <Link href={"/admin/" + option.href}>
                  <Typography
                    color="black"
                    sx={{
                      textDecoration:
                        router.pathname == "/admin/" + option.href
                          ? "underline"
                          : "unset",
                      "&:hover": {
                        textDecoration: "underline",
                        cursor: "pointer",
                      },
                    }}
                  >
                    {option.name}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
};

export default Navbar;
