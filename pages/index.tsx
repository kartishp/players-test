import axios, { AxiosError } from "axios";
import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import moment from "moment";

const Home: NextPage = () => {
  const [teamsList, setTeamsList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [playerFilterList, setPlayerFilterList] = useState(playerList);

  const getData = async () => {
    try {
      const res = await axios.get("https://api.npoint.io/20c1afef1661881ddc9c");
      console.log("🚀 ~ file: index.tsx:9 ~ getData ~ res:", res.data);
      res.data.playerList.sort(comparePlayer);
      setTeamsList(res.data.teamsList);
      setPlayerList(res.data.playerList);
      setPlayerFilterList(res.data.playerList);
    } catch (e: AxiosError | any) {
      console.log("🚀 ~ file: index.tsx:9 ~ getData ~ e:", e);
    }
  };

  const comparePlayer = (a: any, b: any) => {
    if (a.TName < b.TName) {
      return -1;
    }
    if (a.TName > b.TName) {
      return 1;
    }
    return 0;
  };

  useEffect(() => {
    getData();
  }, []);

  const filterList = (name: any) => {
    if (name !== "") {
      console.log("🚀 ~ file: index.tsx:38 ~ filterList ~ name:", name);
      const newList = playerList.filter(
        (item: any) =>
          item.TName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
          item.PFName.toLowerCase().indexOf(name.toLowerCase()) !== -1
      );
      console.log(
        "🚀 ~ file: index.tsx:42 ~ filterList ~ playerList:",
        newList
      );
      setPlayerFilterList(newList);
    } else {
      setPlayerFilterList(playerList);
    }
  };

  return (
    <section className="p-10 w-full bg-gray-100 space-y-10 min-h-screen">
      <h1 className="w-full text-center text-2xl font-bold uppercase underline underline-offset-4 text-gray-800">
        Players List
      </h1>
      <div className="w-1/2 mx-auto">
        <input
          type="text"
          onChange={(e: any) => filterList(e.target.value)}
          className="bg-white drop-shadow p-2 mx-auto rounded w-full focus:outline-none"
          placeholder="Search Player"
        />
      </div>
      <div className="w-full container mx-auto grid grid-cols-6 gap-10">
        {playerFilterList.length !== 0 &&
          playerFilterList.map((player: any) => (
            <div
              key={player.Id}
              className="col-span-1 p-2 shadow w-full flex flex-col items-center rounded bg-white"
            >
              <div className="relative w-52 h-52 rounded overflow-hidden">
                <Image
                  src={`/player-images/${player.Id}.jpg`}
                  alt={player.PFName}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
              <div className="space-y-3 p-2 w-full flex flex-col justify-center items-center">
                <h3>
                  {player.TName} - {player.SkillDesc}
                </h3>
                <p className="text-sm">
                  {player.UpComingMatchesList[0].CCode} {" vs "}
                  {player.UpComingMatchesList[0].VsCCode}
                </p>
                <p className="text-sm">
                  {moment(player.UpComingMatchesList[0].MDate).format(
                    "DD-MM-YYYY h:mm:ss a"
                  )}
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Home;
