// Using React UMD globals (no imports/exports)
const { useState } = React;

const initialPlayers = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: "",
  score: 0,
}));

function App() {
  const [players, setPlayers] = useState(initialPlayers);
  const [bracket, setBracket] = useState({});
  const [tournamentStarted, setTournamentStarted] = useState(false);

  const setWinner = (round, match, winner) => {
    setBracket((prev) => ({
      ...prev,
      [`${round}-${match}`]: winner,
    }));
  };

  const getWinner = (round, match) => bracket[`${round}-${match}`];

  const renderMatch = (round, match, p1, p2) => (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-800 text-white p-2 m-1 rounded-lg">
      <button
        onClick={() => setWinner(round, match, p1)}
        className={`flex-1 p-2 m-1 rounded-lg ${
          getWinner(round, match) === p1 ? "bg-green-600" : "bg-gray-700"
        }`}
      >
        {p1?.name || "-"}
      </button>
      <button
        onClick={() => setWinner(round, match, p2)}
        className={`flex-1 p-2 m-1 rounded-lg ${
          getWinner(round, match) === p2 ? "bg-green-600" : "bg-gray-700"
        }`}
      >
        {p2?.name || "-"}
      </button>
    </div>
  );

  const startNewTournament = () => {
    setBracket({});
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0, name: "" })));
    setTournamentStarted(false);
  };

  const startTournament = () => {
    setBracket({});
    setTournamentStarted(true);
  };

  const sortedPlayers = [...players]
    .filter((p) => p.score > 0 && p.name.trim() !== "")
    .sort((a, b) => b.score - a.score);

  const useTop16 = sortedPlayers.length > 8;

  const round1 = useTop16
    ? [
        [sortedPlayers[0], sortedPlayers[15]],
        [sortedPlayers[7], sortedPlayers[8]],
        [sortedPlayers[3], sortedPlayers[12]],
        [sortedPlayers[4], sortedPlayers[11]],
        [sortedPlayers[1], sortedPlayers[14]],
        [sortedPlayers[6], sortedPlayers[9]],
        [sortedPlayers[2], sortedPlayers[13]],
        [sortedPlayers[5], sortedPlayers[10]],
      ]
    : [];

  const round2 = useTop16
    ? [
        [getWinner(1, 1), getWinner(1, 2)],
        [getWinner(1, 3), getWinner(1, 4)],
        [getWinner(1, 5), getWinner(1, 6)],
        [getWinner(1, 7), getWinner(1, 8)],
      ]
    : [
        [sortedPlayers[0], sortedPlayers[7]],
        [sortedPlayers[3], sortedPlayers[4]],
        [sortedPlayers[1], sortedPlayers[6]],
        [sortedPlayers[2], sortedPlayers[5]],
      ];

  const semifinals = [
    [getWinner(2, 1), getWinner(2, 2)],
    [getWinner(2, 3), getWinner(2, 4)],
  ];

  const finals = [[getWinner(3, 1), getWinner(3, 2)]];

  const thirdPlace = [
    [
      getWinner(2, 1) === getWinner(3, 1) ? getWinner(2, 2) : getWinner(2, 1),
      getWinner(2, 3) === getWinner(3, 2) ? getWinner(2, 4) : getWinner(2, 3),
    ],
  ];

  const updatePlayer = (id, field, value) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const visiblePlayersCount = Math.min(
    Math.max(1, players.filter((p) => p.name.trim() !== "").length + 1),
    16
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Salajase pleistaühingu driftisari</h1>

      {!tournamentStarted ? (
        <div className="mb-6">
          <h2 className="text-xl mb-2">Sõitjate nimed ja kvalifikatsioon</h2>
          {players.slice(0, visiblePlayersCount).map((player) => (
            <div key={player.id} className="flex flex-col sm:flex-row items-center gap-2 mb-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayer(player.id, "name", e.target.value)}
                className="p-2 rounded bg-gray-800 text-white flex-1 w-full sm:w-auto"
                placeholder={`Sõitja ${player.id}`}
              />
              <input
                type="number"
                value={player.score}
                onChange={(e) =>
                  updatePlayer(player.id, "score", Number(e.target.value))
                }
                className="p-2 rounded bg-gray-800 text-white w-full sm:w-24"
                placeholder="Punktid"
                min="0"
              />
            </div>
          ))}

          <h2 className="text-xl mt-4 mb-2">Kvalifikatsiooni tulemused</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 text-left">Koht</th>
                  <th className="p-2 text-left">Nimi</th>
                  <th className="p-2 text-left">Punktid</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-700">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={startTournament}
            className="mt-4 px-4 py-2 bg-green-600 rounded-lg mr-2 w-full sm:w-auto"
          >
            Alusta võistlust
          </button>
          <button
            onClick={startNewTournament}
            className="mt-4 px-4 py-2 bg-red-600 rounded-lg w-full sm:w-auto"
          >
            Nulli kõik
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col sm:flex-row gap-2">
            <button
              onClick={startNewTournament}
              className="px-4 py-2 bg-red-600 rounded-lg w-full sm:w-auto"
            >
              Alusta uus võistlus
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 overflow-x-auto">
            {useTop16 && (
              <div>
                <h2 className="text-xl mb-2">Top 16</h2>
                {round1.map((match, i) =>
                  renderMatch(1, i + 1, match[0], match[1])
                )}
              </div>
            )}
            <div>
              <h2 className="text-xl mb-2">Top 8</h2>
              {round2.map((match, i) => renderMatch(2, i + 1, match[0], match[1]))}
            </div>
            <div>
              <h2 className="text-xl mb-2">Poolfinaalid</h2>
              {semifinals.map((match, i) =>
                renderMatch(3, i + 1, match[0], match[1])
              )}
            </div>
            <div>
              <h2 className="text-xl mb-2">Finaal</h2>
              {finals.map((match, i) => renderMatch(4, i + 1, match[0], match[1]))}
              <h2 className="text-xl mt-6 mb-2">3. Koht</h2>
              {thirdPlace.map((match, i) =>
                renderMatch(5, i + 1, match[0], match[1])
              )}
            </div>
            <div>
              <h2 className="text-xl mb-2">Poodium</h2>
              <div className="bg-yellow-600 p-2 rounded-lg mb-2">
                🥇 {getWinner(4, 1)?.name || "-"}
              </div>
              <div className="bg-gray-400 p-2 rounded-lg mb-2">
                🥈 {finals[0].find((p) => p !== getWinner(4, 1))?.name || "-"}
              </div>
              <div className="bg-orange-600 p-2 rounded-lg">
                🥉 {getWinner(5, 1)?.name || "-"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
