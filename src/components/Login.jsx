import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginJudge } from "../store/judgeSlice";
import { useDispatch } from "react-redux";

const validJudgeIds = import.meta.env.VITE_JUDGE_IDS.split(",");

const Login = () => {
  const [inputId, setInputId] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const trimmedId = inputId.trim();

    if (validJudgeIds.includes(trimmedId)) {
      dispatch(loginJudge(trimmedId));
      navigate("/scoring");
    } else {
      setError("Invalid Judge ID");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-neutral-950 via-neutral-900 to-black px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 mb-4">
            <span className="text-2xl">🚀</span>
          </div>

          <h1 className="text-3xl font-bold text-white">Hackathon Judge</h1>

          <p className="text-neutral-500 mt-2">
            Real-time judging & evaluation platform
          </p>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Judge Login</h2>

            <p className="text-sm text-neutral-500 mt-1">
              Enter your assigned Judge ID to continue.
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Judge ID
            </label>

            <input
              type="text"
              value={inputId}
              onChange={(e) => {
                setInputId(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              placeholder="e.g. J1"
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 text-white border border-neutral-700 outline-none placeholder:text-neutral-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            />

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-red-900/20 cursor-pointer"
          >
            🔐 Enter Judge Panel
          </button>
          <Link
            to="/leaderboard"
            className="mt-3 w-full flex items-center justify-center gap-2
                bg-neutral-800 hover:bg-neutral-700
                border border-neutral-700 hover:border-neutral-600
                text-neutral-200 hover:text-white
                font-medium py-3 rounded-xl
                transition-all duration-200
                cursor-pointer"
          >
            <span>🏆</span>
            <span>View Leaderboard</span>
          </Link>

          <p className="text-center text-xs text-neutral-600 mt-6">
            Authorised judges only
          </p>
        </div>

        <p className="text-center text-xs text-neutral-700 mt-6">
          Hackathon Evaluation System
        </p>
      </div>
    </div>
  );
};

export default Login;
