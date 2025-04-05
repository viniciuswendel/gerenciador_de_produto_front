import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { Link, Outlet } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdowns, setDropdowns] = useState({
    clientes: false,
    produtos: false,
    fornecedores: false,
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);

    // Adicionar/remover classe global no <body>
    if (!sidebarOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  };

  const toggleDropdown = (menu) => {
    setDropdowns((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.menuIcon} onClick={toggleSidebar}>
          ☰
        </div>
        <div className={styles.brand}>
          <Link to="/">
            <img src="./logo.png" alt="BreaKeR Motos" />
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <nav className={styles.sidebarNav}>
          {/* Clientes */}
          <div
            className={`${styles.navItem} ${
              dropdowns.clientes ? styles.active : ""
            }`}
            onClick={() => toggleDropdown("clientes")}
          >
            <span>Clientes</span>
            <span className={styles.dropdownIcon}>
              {dropdowns.clientes ? "▼" : "▶"}
            </span>
          </div>
          {dropdowns.clientes && (
            <div className={styles.dropdownMenu}>
              <Link to="/add-clientes">Adicionar Clientes</Link>
              <Link to="/listar-clientes">Listar Clientes</Link>
            </div>
          )}

          {/* Produtos */}
          <div
            className={`${styles.navItem} ${
              dropdowns.produtos ? styles.active : ""
            }`}
            onClick={() => toggleDropdown("produtos")}
          >
            <span>Produtos</span>
            <span className={styles.dropdownIcon}>
              {dropdowns.produtos ? "▼" : "▶"}
            </span>
          </div>
          {dropdowns.produtos && (
            <div className={styles.dropdownMenu}>
              <Link to="/add-produtos">Adicionar Produtos</Link>
              <Link to="/listar-produtos">Listar Produtos</Link>
            </div>
          )}

          {/* Fornecedores */}
          <div
            className={`${styles.navItem} ${
              dropdowns.fornecedores ? styles.active : ""
            }`}
            onClick={() => toggleDropdown("fornecedores")}
          >
            <span>Fornecedores</span>
            <span className={styles.dropdownIcon}>
              {dropdowns.fornecedores ? "▼" : "▶"}
            </span>
          </div>
          {dropdowns.fornecedores && (
            <div className={styles.dropdownMenu}>
              <Link to="/add-fornecedores">Adicionar Fornecedores</Link>
              <Link to="/listar-fornecedores">Listar Fornecedores</Link>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`${styles.content} ${
          sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        <Outlet />
      </main>

    </div>
  );
};

export default Navbar;
