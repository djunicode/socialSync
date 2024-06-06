"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";
import Creator from "./(components)/Creator";
import {
  GreaterThanArrow,
  GoLiveButton,
  UploadButtonSmall,
  MenuIcon,
  CrossIcon,
} from "../../../../public/svgs";

export default function Page({ params }) {
  const [render, setRender] = useState(false);
  const [user, setUser] = useState();
  const [me, setMe] = useState();
  const [isUserTheSame, setIsUserTheSame] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const url = process.env.NEXT_PUBLIC_API_URL;

  const getData = async () => {
    const res = await axios.get(`${url}/api/user/${params.userId}`);
    console.log("User", res.data);
    setUser(res.data);
    const token = localStorage.getItem("token");
    if (!token) return { error: "Unauthorize access" };
    const response = await axios.get(`${url}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Me", response.data);
    setMe(response.data);
    if (res.data.userId === response.data.userId) {
      setIsUserTheSame(true);
    }
    setRender(true);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex">
      <div
        className={`${
          isSideBarOpen
            ? "max-md:translate-x-0 max-md:z-20"
            : "max-md:-translate-x-[18rem]"
        } max-md:transform transition-transform ease-in-out duration-500`}
      >
        <Sidebar />
      </div>
      {render && user && (
        <div className="flex flex-col pt-12 items-center h-full w-full md:ml-[18rem] bg-[#020317] z-10">
          <SearchBar />
          <div
            className={`absolute right-0 mr-5 w-6 h-10 max-md:flex items-center hidden`}
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          >
            {isSideBarOpen ? <CrossIcon /> : <MenuIcon />}
          </div>
          <div className="mt-8 flex justify-center items-center">
            <div className="w-24 h-24 rounded-full bg-[#D9D9D9] border border-[#D9D9D9]">
              <img src="" alt="pfp" className="rounded-full w-full h-full" />
            </div>
            <div className="ml-2">
              <div className="font-semibold text-3xl text-white">
                {`${user?.firstName} ${user?.lastName}` || "Full Name"}
              </div>
              <div className="font-semibold text-xl text-[#867D7D]">
                @{user?.username || "username"}
              </div>
            </div>
          </div>
          {isUserTheSame && (
            <div className="mt-2 w-full">
              <div className="flex justify-center hover:cursor-pointer">
                <Link
                  href={`/profile/${user.userId}/edit`}
                  className="flex items-center"
                >
                  <span className="font-semibold text-base text-[#D9D9D9] underline underline-offset-4 decoration-2 decoration-[#D9D9D9]">
                    Edit personal details
                  </span>
                  <GreaterThanArrow />
                </Link>
              </div>
              <div className="mt-4 flex justify-center">
                <Link
                  href="/golive"
                  className="rounded-full w-fit pl-3 pr-3 h-9 bg-gradient-to-r from-[#F16602] to-[#FF8E00] flex justify-center items-center hover:cursor-pointer"
                >
                  <span className="font-semibold text-xl text-black ml-1">
                    Go Live
                  </span>
                  <span>
                    <GoLiveButton />
                  </span>
                </Link>
                <Link
                  href="/upload"
                  className="rounded-full w-fit pl-3 pr-3 h-9 bg-gradient-to-r from-[#F16602] to-[#FF8E00] flex justify-center items-center hover:cursor-pointer ml-4"
                >
                  <span className="font-semibold text-xl text-black ml-1">
                    Upload
                  </span>
                  <span>
                    <UploadButtonSmall />
                  </span>
                </Link>
              </div>
            </div>
          )}
          <div className="w-full pl-12 p-12 pt-4">
            <div>
              <div className="font-medium text-2xl text-white">
                {isUserTheSame ? "Your" : `${user?.username}'s`} livestreams
              </div>
              <div className="grid screen:grid-cols-3 size1:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-1">
                {user.Stream &&
                  user.Stream.length !== 0 &&
                  user.Stream.map((str) => {
                    return (
                      <div
                        key={str.streamId}
                        className="max-w-[400px] min-w-[256px] mx-auto w-full"
                      >
                        <Card
                          title={str.title}
                          thumbnail={str.thumbnailUrl}
                          date={str.startTimestamp}
                          username={user.username}
                          views={0}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="mt-6">
              <div className="font-medium text-2xl text-white">
                Creators {isUserTheSame ? "you're" : `${user?.username} is`}{" "}
                subscribed to
              </div>
              <div className="mt-4 grid screen:grid-cols-5 lg:grid-cols-4 size1:grid-cols-3 md:grid-cols-2 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1">
                <Creator
                  firstName="Creator"
                  lastName="Name"
                  username="username"
                />
                <Creator
                  firstName="Creator"
                  lastName="Name"
                  username="username"
                />
                <Creator
                  firstName="Creator"
                  lastName="Name"
                  username="username"
                />
                <Creator
                  firstName="Creator"
                  lastName="Name"
                  username="username"
                />
                <Creator
                  firstName="Creator"
                  lastName="Name"
                  username="username"
                />
              </div>
            </div>
            {isUserTheSame && (
              <>
                <div className="mt-7">
                  <div className="font-medium text-2xl text-white">
                    Liked streams
                  </div>
                  <div className="grid screen:grid-cols-3 size1:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-1">
                    <div className="max-w-[400px] min-w-[256px] mx-auto w-full">
                      <Card />
                    </div>
                    <div className="max-w-[400px] min-w-[256px] mx-auto w-full">
                      <Card />
                    </div>
                    <div className="max-w-[400px] min-w-[256px] mx-auto w-full">
                      <Card />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 mt-2"></div>
                </div>
                <div className="mt-6">
                  <div className="font-medium text-2xl text-white">
                    Watch history
                  </div>
                  <div className="grid screen:grid-cols-3 size1:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-1">
                    <div className="max-w-[400px] min-w-[256px] mx-auto w-full">
                      <Card />
                    </div>
                    <div className="max-w-[400px] min-w-[256px] mx-auto w-full">
                      <Card />
                    </div>
                    <div className="max-w-[400px] min-w-[256px] mx-auto w-full">
                      <Card />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}