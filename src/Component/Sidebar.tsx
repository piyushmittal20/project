/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { NotificationsOutlined, HomeMiniOutlined, ListAltOutlined, Person2Outlined, AddBoxOutlined, LocalHospital, PersonOutline } from "@mui/icons-material";

const Sidebar = () => {

  const {data} = useSession()

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "#191919",
        height: "100vh",
        width: '250px',
      }}
      className="border-r-2"
    >
      <Box className="flex items-start justify-center ">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          className="w-full border-b-2 py-5 pl-5"
        >
          <Avatar sizes="small">{ "A"}</Avatar>
          <Typography fontWeight="normal" className="text-center">
            Employee Name
          </Typography>
        </Box>
      </Box>
      <List className="">
        <ListItem button className="pr-12">
          <NotificationsOutlined />
          <ListItemText
            className="pl-3 font-semibold"
            primary="Notifications"
          />
        </ListItem>

        <ListItem button className="pr-12">
          <HomeMiniOutlined />
          <ListItemText className="pl-3 font-semibold" primary="Home" />
        </ListItem>
        <ListItem button className="pr-12">
          <ListAltOutlined />
          <ListItemText className="pl-3 font-semibold" primary="Plans" />
        </ListItem>
        <ListItem button className="bg-[#edf5ff] text-[#6370af]">
          <Person2Outlined />
          <ListItemText className="pl-3 font-semibold" primary={data?.user.role === "HR_MANAGER" ? 'Employees': 'Dependents'} />
        </ListItem>
        <ListItem button>
          <AddBoxOutlined />
          <ListItemText className="pl-3 font-semibold" primary="Claims" />
        </ListItem>
        <ListItem button className="pr-12">
          <LocalHospital />
          <ListItemText className="pl-3 font-semibold" primary="Hospitals" />
        </ListItem>
        <ListItem button className="pr-12">
          <PersonOutline />
          <ListItemText className="pl-3 font-semibold" primary="Profile" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
