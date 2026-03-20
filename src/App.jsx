import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Undo2,
  UserCircle2,
  Globe,
} from "lucide-react";

const accounts = [
  {
    id: "main",
    username: "USECTest",
    label: "Main",
    lastUsed: "Yesterday",
    password: "••••••••",
  },
  {
    id: "secondary",
    username: "LastPassTestAcc",
    label: "Secondary",
    lastUsed: "Today",
    password: "••••••••",
  },
];

function Badge({ children, variant = "default", className = "" }) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>{children}</span>
  );
}

function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

function CardHeader({ children, className = "" }) {
  return <div className={`card-header ${className}`.trim()}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return <h3 className={`card-title ${className}`.trim()}>{children}</h3>;
}

function CardContent({ children, className = "" }) {
  return <div className={`card-content ${className}`.trim()}>{children}</div>;
}

export default function App() {
  const [stage, setStage] = useState("login");
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [filledAccountId, setFilledAccountId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const selected = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId) ?? null,
    [selectedAccountId]
  );

  const filled = useMemo(
    () => accounts.find((a) => a.id === filledAccountId) ?? null,
    [filledAccountId]
  );

  const openChooser = () => setStage("chooser");

  const previewAndFill = (id) => {
    setSelectedAccountId(id);
    setStage("confirm");
  };

  const confirmFill = () => {
    if (!selectedAccountId) return;
    setFilledAccountId(selectedAccountId);
    setStage("filled");
    setShowToast(true);
  };

  const switchAccount = () => {
    setShowToast(false);
    setStage("chooser");
  };

  const undoFill = () => {
    setFilledAccountId(null);
    setSelectedAccountId(null);
    setShowToast(false);
    setStage("login");
  };

  const resetAll = () => {
    setStage("login");
    setSelectedAccountId(null);
    setFilledAccountId(null);
    setShowToast(false);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="hero">
          <div>
            <h1>LastPass desktop extension prototype</h1>
          </div>
          <div className="hero-actions">
            <Button variant="outline" onClick={resetAll}>
              Reset prototype
            </Button>
            <Badge className="pill">Desktop browser extension</Badge>
          </div>
        </div>

        <div className="layout">
          <Card className="browser-shell">
            <CardContent className="browser-shell-content">
              <div className="browser-topbar">
                <div className="topbar-left">
                  <div className="traffic-lights">
                    <div className="dot red" />
                    <div className="dot yellow" />
                    <div className="dot green" />
                  </div>
                  <div className="domain-pill">reddit.com</div>
                </div>
                <div className="topbar-right">
                  <div className="extensions-pill">Extensions</div>
                  <button onClick={openChooser} className="open-lastpass-btn">
                    Open LastPass
                  </button>
                </div>
              </div>

              <div className="browser-body">
                <div className="login-card">
                  <div className="login-header">
                    <h2>Log In</h2>
                    <p>Use the correct identity for this Reddit session.</p>
                  </div>

                  <div className="form-stack">
                    <div>
                      <label>Username</label>
                      <div className="input-box">{filled ? filled.username : ""}</div>
                    </div>
                    <div>
                      <label>Password</label>
                      <div className="input-box">{filled ? filled.password : ""}</div>
                    </div>
                    <Button className="full-width">Login</Button>
                  </div>
                </div>

                <AnimatePresence>
                  {(stage === "chooser" || stage === "confirm") && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="extension-popup"
                    >
                      <div className="extension-header">
                        <div>
                          <div className="extension-title">LastPass</div>
                          <div className="extension-domain">
                            <Globe size={14} /> reddit.com
                          </div>
                        </div>
                        <button
                          onClick={() => setStage(filled ? "filled" : "login")}
                          className="close-btn"
                        >
                          ✕
                        </button>
                      </div>

                      {stage === "chooser" && (
                        <div className="chooser-body">
                          {accounts.map((account) => (
                            <Card key={account.id} className="account-card">
                              <CardContent className="account-card-content">
                                <div className="account-left">
                                  <div className="avatar-box">
                                    <UserCircle2 size={24} />
                                  </div>
                                  <div>
                                    <div className="account-name">{account.username}</div>
                                    <div className="account-badges">
                                      <Badge variant="secondary">{account.label}</Badge>
                                      <Badge variant="outline">
                                        Last used: {account.lastUsed}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <Button onClick={() => previewAndFill(account.id)}>
                                  Preview &amp; Fill
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                          <p className="helper-text">
                            Identity-first account cards help users distinguish multiple
                            credentials saved for the same domain.
                          </p>
                        </div>
                      )}

                      {stage === "confirm" && selected && (
                        <div className="confirm-body">
                          <div className="confirm-panel">
                            <div className="confirm-heading">
                              <ShieldCheck size={16} /> Confirm account before autofill
                            </div>
                            <p className="confirm-copy">
                              Fill credentials for{" "}
                              <span className="strong">{selected.username}</span> into{" "}
                              <span className="strong">reddit.com</span>?
                            </p>
                            <div className="confirm-details">
                              <div className="detail-row">
                                <span>Username</span>
                                <span>{selected.username}</span>
                              </div>
                              <div className="detail-row">
                                <span>Label</span>
                                <span>{selected.label}</span>
                              </div>
                              <div className="detail-row">
                                <span>Password</span>
                                <span>{selected.password}</span>
                              </div>
                            </div>
                            <div className="confirm-actions">
                              <Button onClick={confirmFill}>Confirm &amp; Fill</Button>
                              <Button variant="outline" onClick={switchAccount}>
                                Switch account
                              </Button>
                              <Button variant="ghost" onClick={() => setStage("chooser")}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showToast && filled && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="toast"
                    >
                      <div className="toast-inner">
                        <div className="toast-icon">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="toast-content">
                          <div className="toast-title">Filled as {filled.username}</div>
                          <div className="toast-subtitle">on reddit.com</div>
                          <div className="toast-actions">
                            <Button size="sm" variant="outline" onClick={undoFill}>
                              <Undo2 size={14} />
                              <span>Undo</span>
                            </Button>
                            <Button size="sm" onClick={switchAccount}>
                              Switch account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          <div className="sidebar">
            <Card>
              <CardHeader>
                <CardTitle>Prototype states</CardTitle>
              </CardHeader>
              <CardContent className="state-list">
                <div className="state-row">
                  <span>1. Login page</span>
                  <Badge variant={stage === "login" ? "default" : "secondary"}>
                    Current
                  </Badge>
                </div>
                <div className="state-row">
                  <span>2. Identity-first chooser</span>
                  <Badge variant={stage === "chooser" ? "default" : "secondary"}>
                    Current
                  </Badge>
                </div>
                <div className="state-row">
                  <span>3. Confirmation step</span>
                  <Badge variant={stage === "confirm" ? "default" : "secondary"}>
                    Current
                  </Badge>
                </div>
                <div className="state-row">
                  <span>4. Filled state + recovery</span>
                  <Badge variant={stage === "filled" ? "default" : "secondary"}>
                    Current
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="appendix-note">
                  The prototype I made is a minimally functional frontend demonstration of the redesigned
                  LastPass desktop browser extension flow, so it does not connect to real
                  authentication or browser autofill APIs, but it simulates the key interaction
                  states needed to demonstrate the design concept and recovery path.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}