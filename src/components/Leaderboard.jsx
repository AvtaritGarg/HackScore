import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

const Leaderboard = () => {
  const [rankedTeams, setRankedTeams] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "scores"), (snapshot) => {
      const allScores = snapshot.docs.map((doc) => doc.data());

      // STEP 1: group all scores by teamId
      // grouped ends up looking like:
      // { T1: [ {score from J1}, {score from J2} ], T2: [ {score from J1} ] }
      const grouped = {};
      allScores.forEach((score) => {
        if (!grouped[score.teamId]) {
          grouped[score.teamId] = [];
        }
        grouped[score.teamId].push(score);
      });

      // STEP 2: turn each group into one summary object per team
      // Object.keys(grouped) = ["T1", "T2", ...] — just the team IDs
      const teamSummaries = Object.keys(grouped).map((teamId) => {
        const judgeScores = grouped[teamId]; // all judges' scores for this team

        // for each judge's submission, add up their 3 scores into one total,
        // then average across however many judges scored this team
        const totalAverage =
          judgeScores.reduce((sum, score) => {
            const judgeTotal =
              score.innovation + score.codeQuality + score.presentation;
            return sum + judgeTotal / 3; // this judge's average across the 3 categories
          }, 0) / judgeScores.length; // divide by number of judges who scored this team

        return {
          teamId,
          averageScore: totalAverage,
          numJudges: judgeScores.length,
        };
      });

      // STEP 3: sort teams highest score first
      const sorted = teamSummaries.sort(
        (a, b) => b.averageScore - a.averageScore,
      );

      setRankedTeams(sorted);
    });

    // cleanup: stop listening when this component unmounts (e.g. judge
    // navigates away). Without this, the listener keeps running forever
    // in the background, which wastes resources.
    return () => unsubscribe();
  }, []); // empty array = only set up the listener once, when the page first loads

  return (
    <div className="w-screen min-h-screen bg-linear-to-b from-neutral-950 to-neutral-900 px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Live Leaderboard</h1>

      <div className="w-full max-w-md flex flex-col gap-3">
        {rankedTeams.length === 0 && (
          <p className="text-neutral-400 text-center">
            No scores submitted yet.
          </p>
        )}

        {rankedTeams.map((team, index) => (
          <div
            key={team.teamId}
            className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-red-500 w-6">
                {index + 1}
              </span>
              <span className="text-white font-medium">{team.teamId}</span>
            </div>
            <div className="text-right">
              <span className="text-white font-semibold">
                {team.averageScore.toFixed(2)}
              </span>
              <p className="text-xs text-neutral-500">
                {team.numJudges} judge{team.numJudges > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
