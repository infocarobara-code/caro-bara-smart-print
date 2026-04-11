import { loginAction } from "./actions";

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f1ea",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fffaf4",
          border: "1px solid #e5d8c8",
          borderRadius: "20px",
          padding: "28px",
          boxShadow: "0 10px 30px rgba(45, 28, 14, 0.05)",
        }}
      >
        <h1
          style={{
            margin: "0 0 20px",
            fontSize: "26px",
            fontWeight: 800,
            color: "#1f1711",
            textAlign: "center",
          }}
        >
          Admin Login
        </h1>

        <form
          action={loginAction}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            autoComplete="username"
            style={{
              height: "44px",
              padding: "0 12px",
              borderRadius: "12px",
              border: "1px solid #d9c7b4",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            style={{
              height: "44px",
              padding: "0 12px",
              borderRadius: "12px",
              border: "1px solid #d9c7b4",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              height: "46px",
              borderRadius: "12px",
              border: "1px solid #2a1d13",
              background: "#2a1d13",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}