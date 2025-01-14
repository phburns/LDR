import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./inventory.css";

const Inventory = () => {
  return (
    <div className="body">
      <p>Inventory</p>
      <br />
      <div style={{ marginTop: "20px" }}>
        <Link
          to="/admin"
          style={{
            color: "#AF231C",
            textDecoration: "none",
            padding: "10px",
            border: "1px solid #AF231C",
            borderRadius: "5px",
          }}
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
};

export default Inventory;
