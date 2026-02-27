import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const drawerWidth = 240;

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background:
            "linear-gradient(180deg, #023047, #219ebc)",
          color: "white",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6">GyanTrack</Typography>
      </Toolbar>

      <List>
        <ListItemButton>
          <ListItemIcon sx={{ color: "white" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;