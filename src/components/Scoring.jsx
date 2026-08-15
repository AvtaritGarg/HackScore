import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { Link } from "react-router-dom";

const Scoring = () => {
  const judgeId = useSelector((state) => state.judge.judgeId);

  const [teamId, setTeamId] = useState("");
  const [innovation, setInnovation] = useState("");
  const [codeQuality, setCodeQuality] = useState("");
  const [presentation, setPresentation] = useState("");
  const [status, setStatus] = useState("");
  const [teamScores, setTeamScores] = useState([]);

  // Always normalise Team ID
  const normalisedTeamId = teamId.trim().toUpperCase();

  // Real-time scores
  useEffect(() => {
    if (!normalisedTeamId) {
      setTeamScores([]);
      return;
    }

    const q = query(
      collection(db, "scores"),
      where("teamId", "==", normalisedTeamId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scores = snapshot.docs.map((doc) => doc.data());
      console.log(scores);

      setTeamScores(scores);
    });

    return () => unsubscribe();
  }, [normalisedTeamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!normalisedTeamId || !innovation || !codeQuality || !presentation) {
      setStatus("Please fill all fields");
      return;
    }

    try {
      await setDoc(doc(db, "scores", `${normalisedTeamId}_${judgeId}`), {
        teamId: normalisedTeamId,
        judgeId,
        innovation: Number(innovation),
        codeQuality: Number(codeQuality),
        presentation: Number(presentation),
      });

      setStatus("Score submitted!");
      setInnovation("");
      setCodeQuality("");
      setPresentation("");
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Try again.");
    }
  };

  // Calculate total scores
  const totals = teamScores.map(
    (score) => score.innovation + score.codeQuality + score.presentation,
  );

  const average =
    totals.length > 0 ? totals.reduce((a, b) => a + b, 0) / totals.length : 0;

  // Calculate variance
  const variance =
    totals.length > 1
      ? totals.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) /
        totals.length
      : 0;

  const standardDeviation = Math.sqrt(variance);

  const highVariance = standardDeviation >= 3;

  return (
    <div className="w-full min-h-screen overflow-y-auto bg-linear-to-b from-neutral-950 to-neutral-900 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Judge Panel</h1>

            <p className="text-neutral-400 mt-1">
              Logged in as{" "}
              <span className="text-red-500 font-medium">{judgeId}</span>
            </p>
          </div>

          <Link
            to="/leaderboard"
            className="self-start sm:self-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700 hover:border-red-500 hover:text-white transition-all"
          >
            🏆
            <span>Leaderboard</span>
          </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* SCORING FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 border border-neutral-800 p-6 sm:p-7 rounded-2xl shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              Score a Team
            </h2>

            {/* TEAM ID */}
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Team ID
              </label>

              <input
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                type="text"
                placeholder="e.g. T1"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value.toUpperCase())}
              />
            </div>

            {/* INNOVATION */}
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Innovation (1–10)
              </label>

              <input
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                type="number"
                min="1"
                max="10"
                placeholder="Score"
                value={innovation}
                onChange={(e) => setInnovation(e.target.value)}
              />
            </div>

            {/* CODE QUALITY */}
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Code Quality (1–10)
              </label>

              <input
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                type="number"
                min="1"
                max="10"
                placeholder="Score"
                value={codeQuality}
                onChange={(e) => setCodeQuality(e.target.value)}
              />
            </div>

            {/* PRESENTATION */}
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Presentation (1–10)
              </label>

              <input
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 text-white border border-neutral-700 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                type="number"
                min="1"
                max="10"
                placeholder="Score"
                value={presentation}
                onChange={(e) => setPresentation(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-red-900/20 cursor-pointer"
            >
              Submit Score
            </button>

            {status && (
              <p
                className={`text-center text-sm mt-4 ${
                  status.includes("submitted")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {status}
              </p>
            )}
          </form>

          {/* SCORES */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl h-162.5 flex flex-col overflow-hidden">
            {/* STICKY HEADER */}
            <div className="shrink-0 p-6 sm:p-7 border-b border-neutral-800 bg-neutral-900 z-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Team Scores
                  </h2>

                  <p className="text-sm text-neutral-500 mt-1">
                    {normalisedTeamId
                      ? `Live scores for ${normalisedTeamId}`
                      : "Enter a Team ID to view scores"}
                  </p>
                </div>

                {normalisedTeamId && (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </div>
                )}
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7">
              {teamScores.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-3xl mb-3 opacity-50">📊</div>

                  <p className="text-neutral-500 text-sm">
                    No scores submitted yet
                  </p>

                  <p className="text-neutral-700 text-xs mt-1">
                    Enter a team ID to see judge evaluations
                  </p>
                </div>
              ) : (
                <>
                  {/* INSIGHTS */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-neutral-800/70 border border-neutral-700/60 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-neutral-500 uppercase tracking-wide">
                        Average
                      </p>

                      <p className="text-xl font-bold text-white mt-1">
                        {average.toFixed(1)}
                        <span className="text-xs text-neutral-500 font-normal">
                          {" "}
                          /30
                        </span>
                      </p>
                    </div>

                    <div className="bg-neutral-800/70 border border-neutral-700/60 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-neutral-500 uppercase tracking-wide">
                        Judges
                      </p>

                      <p className="text-xl font-bold text-white mt-1">
                        {teamScores.length}
                      </p>
                    </div>

                    <div className="bg-neutral-800/70 border border-neutral-700/60 rounded-xl p-3 text-center">
                      <p className="text-[11px] text-neutral-500 uppercase tracking-wide">
                        Agreement
                      </p>

                      <p
                        className={`text-xl font-bold mt-1 ${
                          highVariance ? "text-yellow-400" : "text-green-400"
                        }`}
                      >
                        {highVariance ? "Review" : "Good"}
                      </p>
                    </div>
                  </div>

                  {/* WARNING */}
                  {highVariance && (
                    <div className="mb-5 p-3.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-sm text-yellow-400">
                        ⚠️ Judges have significantly different scores. A review
                        may be recommended.
                      </p>
                    </div>
                  )}

                  {/* JUDGE SCORES */}
                  <div className="space-y-3">
                    {teamScores.map((score) => {
                      const total =
                        score.innovation +
                        score.codeQuality +
                        score.presentation;

                      return (
                        <div
                          key={score.judgeId}
                          className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-4 hover:border-neutral-600 transition"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold">
                                {score.judgeId}
                              </div>

                              <span className="text-white font-medium">
                                Judge {score.judgeId.replace("J", "")}
                              </span>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-neutral-500">Total</p>

                              <p className="text-red-400 font-bold text-lg">
                                {total}
                                <span className="text-xs text-neutral-600">
                                  /30
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-neutral-900/70 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-neutral-500 uppercase">
                                Innovation
                              </p>
                              <p className="text-white font-semibold mt-1">
                                {score.innovation}
                                <span className="text-neutral-600 text-xs">
                                  /10
                                </span>
                              </p>
                            </div>

                            <div className="bg-neutral-900/70 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-neutral-500 uppercase">
                                Code
                              </p>
                              <p className="text-white font-semibold mt-1">
                                {score.codeQuality}
                                <span className="text-neutral-600 text-xs">
                                  /10
                                </span>
                              </p>
                            </div>

                            <div className="bg-neutral-900/70 rounded-lg p-2.5 text-center">
                              <p className="text-[10px] text-neutral-500 uppercase">
                                Presentation
                              </p>
                              <p className="text-white font-semibold mt-1">
                                {score.presentation}
                                <span className="text-neutral-600 text-xs">
                                  /10
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoring;
