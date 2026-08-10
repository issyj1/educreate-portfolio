import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { navTree } from "../data/navdata";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPath, setOpenPath] = useState([]);
  const [overlayVisible, setOverlayVisible] =
    useState(false);

  const navRef = useRef(null);
  const buttonRef = useRef(null);
  const navWrapperRef = useRef(null);

  // ---------------- SCROLL LOCK ----------------
  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ---------------- CLICK OUTSIDE ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      const wrapper = navWrapperRef.current;
      const button = buttonRef.current;

      if (!wrapper) return;

      const clickedInsideNav =
        wrapper.contains(e.target);

      const clickedButton =
        button?.contains(e.target);

      if (
        clickedInsideNav ||
        clickedButton
      )
        return;

      setOpenPath([]);

      setTimeout(() => {
        setMenuOpen(false);
      }, 450);
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ---------------- ANIMATION ----------------
const listVariants = {
  open: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },

  closed: {
    transition: {
      staggerChildren: 0.07,
      staggerDirection: -1,
    },
  },
};

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  
    closed: {
      opacity: 0,
      x: -10,   // from left
      y: 0,    // from top
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };


  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  
    closed: {
      opacity: 0,
      x: -6,   // from left
      y: -6,    // from top
      scale: 0.98,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  // ---------------- MENU ----------------
  const toggleMenu = () => {
    if (menuOpen) {
      // closing menu
      setOpenPath([]);
  
      setTimeout(() => {
        setMenuOpen(false);
      }, 300);
  
      return;
    }
  
    // opening menu
    setMenuOpen(true);
  };

  const closeAll = () => {
    setOpenPath([]);

    setTimeout(() => {
      setMenuOpen(false);
    }, 300);
  };

  // ---------------- HELPERS ----------------
  const pathsEqual = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => v === b[i]);

    const isOpen = (path) =>
      path.every(
        (segment, i) => openPath[i] === segment
      );

  // accordion behavior
  const togglePath = (path) => {
    setOpenPath((prev) => {
      const clickedInsideCurrent =
        path.every((v, i) => prev[i] === v);
  
      // clicking an already-open branch
      if (clickedInsideCurrent) {
        // ROOT LEVEL → close everything
        if (path.length === 1) {
          return [];
        }
  
        // nested branch → collapse to parent
        return path.slice(0, -1);
      }
  
      // open new branch
      return path;
    });
  };

  // ---------------- OVERLAY ----------------
  const activeRoot =
    openPath[0]?.toLowerCase();

  const overlaySections = [
    "about",
    "reviews",
    "contact",
  ];

  useEffect(() => {
    const shouldShow =
      menuOpen &&
      overlaySections.includes(
        openPath[0]?.toLowerCase()
      );
  
    let timeout;
  
    if (shouldShow) {
      setOverlayVisible(true);
    } else {
      timeout = setTimeout(() => {
        setOverlayVisible(false);
      }, 300);
    }
  
    return () => clearTimeout(timeout);
  }, [menuOpen, openPath]);

  const isReviewsActive =
    menuOpen &&
    (activeRoot === "reviews" ||
      activeRoot === "about");

  // ---------------- RENDER ----------------
  const renderNode = (
    node,
    path = []
  ) => {
    const currentPath = [
      ...path,
      node.label,
    ];

    const open = isOpen(currentPath);

    // ---------------- LINK ----------------
    if (node.to) {
      return (
        <motion.li
          key={currentPath.join("-")}
          className="nav-item"
          variants={itemVariants}
        >
          <Link
            to={node.to}
            onClick={closeAll}
          >
            {node.label}
          </Link>
        </motion.li>
      );
    }

    // ---------------- FOLDER ----------------
    if (node.children) {
      return (
        <motion.li
          key={currentPath.join("-")}
          className="nav-item"
          variants={itemVariants}
        >
          <div className="node-row">
            <div
              className={`caret nav-node ${
                node.label.toLowerCase() ===
                activeRoot
                  ? "active-focus"
                  : ""
              }`}
              onClick={() =>
                togglePath(currentPath)
              }
            >
              {node.label}

              <div className="nav-l" />
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.ul
                className="nested"
                variants={listVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {node.children.map(
                  (child) =>
                    renderNode(
                      child,
                      currentPath
                    )
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.li>
      );
    }

    // ---------------- TEXT ----------------
    if (node.type === "text") {
      return (
        <motion.li
          key={currentPath.join("-")}
          className="nav-item"
          variants={itemVariants}
        >
          <div
            className={`caret ${
              node.label.toLowerCase() ===
              activeRoot
                ? "active-focus"
                : ""
            }`}
            onClick={() =>
              togglePath(currentPath)
            }
          >
            {node.label}
          </div>

          <AnimatePresence>
            {open && (
              <motion.ul
                className="nested"
                variants={listVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {node.lines.map(
                  (line, i) => {
                    // plain string
                    if (
                      typeof line ===
                      "string"
                    ) {
                      return (
                        <motion.p
                          key={i}
                          className="fade-line"
                          variants={
                            textVariants
                          }
                        >
                          {line}
                        </motion.p>
                      );
                    }

                    // review object
                    return (
                      <motion.p
                        key={i}
                        className="fade-line"
                        variants={
                          textVariants
                        }
                      >
                        {line.name && (
                          <>
                            <strong>
                              {line.name}
                            </strong>

                            {line.role &&
                              `, ${line.role}`}{" "}
                          </>
                        )}

                        {line.text}

                        {line.linkText && (
                          <a
                            href={line.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-link"
                          >
                            {line.linkText}
                          </a>
                        )}

                        {line.after}
                      </motion.p>
                    );
                  }
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.li>
      );
    }

    // ---------------- CONTACT ----------------
    if (node.type === "contact") {
      return (
        <motion.li
          key={currentPath.join("-")}
          className="nav-item"
          variants={itemVariants}
        >
          <div
            className={`caret ${
              node.label.toLowerCase() ===
              activeRoot
                ? "active-focus"
                : ""
            }`}
            onClick={() =>
              togglePath(currentPath)
            }
          >
            {node.label}
          </div>

          <AnimatePresence>
            {open && (
              <motion.ul
                className="nested contact-block"
                variants={textVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.a
                  variants={textVariants}
                  className="fade-line contact-link"
                  href={`mailto:${node.email}`}
                >
                  {node.email}
                </motion.a>

                <motion.a
                  variants={textVariants}
                  className="fade-line contact-link"
                  href={node.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </motion.a>

                <motion.p
                  variants={textVariants}
                  className="fade-line contact-text"
                >
                  {node.lines?.[0]}
                </motion.p>
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.li>
      );
    }

    return null;
  };

  // ---------------- UI ----------------
  return (
    <>
      <div ref={navWrapperRef}>
        <Link
          to="/"
          className="logo"
          onClick={closeAll}
        >
          <img
            src={`${import.meta.env.BASE_URL}img/svg/Asset 5.svg`}
            alt="logo"
          />
        </Link>

        <motion.button
          className="hamburger"
          ref={buttonRef}
          onClick={toggleMenu}
          animate={
            menuOpen ? "open" : "closed"
          }
          variants={{
            closed: {
              rotate: -40,
              color: "",
              backgroundColor:
                "darkgray",
            },

            open: {
              rotate: 45,
              color: "",
              backgroundColor:
                "rgb(239, 177, 20)",
            },
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          →
        </motion.button>

        <motion.div
  className="overlay"
  animate={{
    opacity: overlayVisible ? 1 : 0,
  }}
  transition={{
    duration: 0.3,
    ease: "easeInOut",
  }}
  style={{
    pointerEvents: overlayVisible
      ? "auto"
      : "none",
  }}
/>

        <motion.nav
          ref={navRef}
          initial={false}
          animate={
            menuOpen ? "open" : "closed"
          }
          className={`nav
            ${menuOpen ? "open" : ""}
            ${
              isReviewsActive
                ? "focus-reviews"
                : ""
            }
          `}
        >
          <motion.ul
            className="menu"
            variants={listVariants}
            initial="closed"
            animate={
              menuOpen
                ? "open"
                : "closed"
            }
          >
            {navTree.map((node) =>
              renderNode(node)
            )}
          </motion.ul>
        </motion.nav>
      </div>
    </>
  );
}