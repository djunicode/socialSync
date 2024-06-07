"use client";
import React from "react";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../lib/fonts.css";
import { MenuIcon, CrossIcon } from "lucide-react";

export default function SidebarWithSearch() {
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [livestreams, setLivestreams] = React.useState([]);
  const [tagStreams, setTagStreams] = React.useState([]);
  const [selectedTag, setSelectedTag] = React.useState("all");
  const url = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    try {
      const resp1 = await axios.get(`${url}/api/subscriptions/myStreams`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const streamIds = [];
      resp1.data.forEach((subscription) => {
        subscription.User_Subscriptions_creatorUserIdToUser.Stream.forEach(
          (stream) => {
            streamIds.push(stream.streamId);
          }
        );
      });
      const streamsPromises = streamIds.map(async (sId) => {
        try {
          const response = await axios.get(`${url}/api/stream/${sId}`);
          return response.data;
        } catch (error) {
          console.log(`Stream with ID ${sId} does not exist`);
          return null;
        }
      });
      const liveStreamDetails = await Promise.all(streamsPromises);
      const validLiveStreams = liveStreamDetails.filter(
        (details) => details !== null
      );
      console.log(validLiveStreams);
      setLivestreams(validLiveStreams);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const handleAllSearch = async () => {
    try {
      const response = await axios.get(`${url}/api/stream/all`);
      setTagStreams(response.data);
    } catch (error) {
      console.error("Error fetching all streams:", error);
    }
  };

  const handleTagSearch = async (tag) => {
    try {
      const response = await axios.get(`${url}/api/stream/tag/${tag}`);
      setTagStreams(response.data);
    } catch (error) {
      console.error(`Error fetching streams for tag ${tag}:`, error);
    }
  };

  const handleRadioChange = (tag) => {
    setSelectedTag(tag);
    if (tag === "all") {
      handleAllSearch();
    } else {
      handleTagSearch(tag);
    }
  };

  useEffect(() => {
    fetchData();
    handleAllSearch();
  }, []);

  return (
    <>
      <div className="flex mb-4">
        <div
          className={`${
            isSideBarOpen
              ? "max-md:translate-x-0 max-md:z-20"
              : "max-md:-translate-x-[18rem]"
          } max-md:transform transition-transform ease-in-out duration-500`}
        >
          <Sidebar />
        </div>
        <div className="flex flex-col pt-12 items-center h-full w-full md:ml-[18rem] bg-[#030421] z-0">
          <SearchBar />
          <div
            className={`absolute right-0 mr-5 w-6 h-10 max-md:flex items-center hidden`}
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          >
            {isSideBarOpen ? <CrossIcon /> : <MenuIcon />}
          </div>
          <div className="mt-8 flex ">
            <div className="mb-2">
              <label className="m-2 ">
                <input
                  type="radio"
                  name="tag"
                  value="all"
                  checked={selectedTag === "all"}
                  onChange={() => handleRadioChange("all")}
                  className="hidden"
                />
                <span
                  className={`inline-block bg-[#1C1D2F] hover:bg-gray-800 border border-b-1 max-sm:text-sm max-sm:px-4 text-white font-bold py-2 px-7 rounded-[30px] cursor-pointer ${
                    selectedTag === "all"
                      ? "focus:bg-[#F16602] bg-[#F16602]"
                      : ""
                  }`}
                >
                  All
                </span>
              </label>
            </div>
            <div className="mb-2">
              <label className="m-2">
                <input
                  type="radio"
                  name="tag"
                  value="project"
                  checked={selectedTag === "project"}
                  onChange={() => handleRadioChange("project")}
                  className="hidden"
                />
                <span
                  className={`inline-block bg-[#1C1D2F] hover:bg-gray-800 border border-b-1 max-sm:text-sm max-sm:px-4 text-white font-bold py-2 px-7 rounded-[30px] cursor-pointer ${
                    selectedTag === "project"
                      ? "focus:bg-[#F16602] bg-[#F16602]"
                      : ""
                  }`}
                >
                  Project
                </span>
              </label>
            </div>
            <div className="mb-2">
              <label className="m-2">
                <input
                  type="radio"
                  name="tag"
                  value="unicode"
                  checked={selectedTag === "unicode"}
                  onChange={() => handleRadioChange("unicode")}
                  className="hidden"
                />
                <span
                  className={`inline-block bg-[#1C1D2F] hover:bg-gray-800 border border-b-1 max-sm:text-sm max-sm:px-4 text-white font-bold py-2 px-7 rounded-[30px] cursor-pointer ${
                    selectedTag === "unicode"
                      ? "focus:bg-[#F16602] bg-[#F16602]"
                      : ""
                  }`}
                >
                  Unicode
                </span>
              </label>
            </div>
            <div className="mb-2">
              <label className="m-2">
                <input
                  type="radio"
                  name="tag"
                  value="science"
                  checked={selectedTag === "science"}
                  onChange={() => handleRadioChange("science")}
                  className="hidden"
                />
                <span
                  className={`inline-block bg-[#1C1D2F] hover:bg-gray-800 border border-b-1 max-sm:text-sm max-sm:px-4 text-white font-bold py-2 px-7 rounded-[30px] cursor-pointer ${
                    selectedTag === "science"
                      ? "focus:bg-[#F16602] bg-[#F16602]"
                      : ""
                  }`}
                >
                  Science
                </span>
              </label>
            </div>
          </div>
          <div className="items-start flex-1">
            <h2 className="text-white text-xl mt-10 flex m-4">
              From famous creators
            </h2>
          </div>
          {tagStreams && tagStreams.length !== 0 ? (
            <div className="grid screen:grid-cols-3 size1:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-1 w-full">
              <>
                {tagStreams.map((str) => {
                  return (
                    <div
                      key={str.streamId}
                      className="max-w-[400px] min-w-[256px] mx-auto w-full"
                    >
                      <Card
                        title={str.title}
                        thumbnail={str.thumbnailUrl}
                        date={str.startTimestamp}
                        username={str.creator.username}
                        views={
                          str?._count?.StreamView || str?.StreamView?.length
                        }
                        streamId={str.streamId}
                        userId={str.userUserId}
                      />
                    </div>
                  );
                })}
              </>
            </div>
          ) : (
            <div className="mt-8 mb-8 text-center text-red-400">
              No livestreams!
            </div>
          )}
          <hr className="w-1/2 mx-auto my-5 border-0 h-px bg-slate-500" />
          <h2 className="text-white text-xl mb-4 text-center">
            Creators currently live from your subscriptions
          </h2>
          {livestreams && livestreams.length !== 0 ? (
            <div className="grid screen:grid-cols-3 size1:grid-cols-2 max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-1 w-full">
              <>
                {livestreams.map((str) => {
                  return (
                    <div
                      key={str.streamId}
                      className="max-w-[400px] min-w-[256px] mx-auto w-full"
                    >
                      <Card
                        title={str.title}
                        thumbnail={str.thumbnailUrl}
                        date={str.startTimestamp}
                        username={str.creator.username}
                        views={str._count.StreamView}
                        streamId={str.streamId}
                        userId={str.userUserId}
                      />
                    </div>
                  );
                })}
              </>
            </div>
          ) : (
            <div className="mt-8 mb-8 text-center text-red-400">
              No livestreams!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
