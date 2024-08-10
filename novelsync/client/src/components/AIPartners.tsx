import React from "react";
import { AITextGenerator } from "./gemin";

interface Profile {
  id: number;
  name: string;
  desc: string;
  img: string;
}

const profiles: Profile[] = [
  {
    id: 0,
    name: "Pappu",
    desc: "He a dawg",
    img: "https://avatar.iran.liara.run/public/37",
  },
  {
    id: 1,
    name: "Sokina",
    desc: "She be flirtatious",
    img: "https://avatar.iran.liara.run/public/64",
  },
  {
    id: 2,
    name: "Ali",
    desc: "He kinda sad",
    img: "https://avatar.iran.liara.run/public/45",
  },
  {
    id: 3,
    name: "Rumana",
    desc: "She aight",
    img: "https://avatar.iran.liara.run/public/57",
  },
];

const AIPartners: React.FC = () => {
  const aiGenerator = new AITextGenerator();
  const handleAvatarClick = async (profile: Profile) => {
    aiGenerator.setAiBuddy(profile.id);
  };

  return (
    <div className="flex items-center flex-col justify-center bg-amber-50 p-2 shadow-lg border border-amber-200">
      <h2 className="text-2xl font-serif mb-4 text-amber-800">AI Partners</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col items-center w-32 cursor-pointer"
            onClick={() => handleAvatarClick(profile)}
          >
            <div className="w-24 h-24 rounded-full bg-red-200 overflow-hidden mb-2">
              {/* <img
                src={profile.img}
                alt={profile.name}
                className="w-full h-full object-cover"
              /> */}
            </div>
            <span className="text-sm font-medium text-center">
              {profile.name}
            </span>
            <span className="text-xs text-gray-600 text-center my-3">
              {profile.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPartners;
