import React from "react";
import AuthPopup from "../components/AuthPopup";
import ThreeScene from "./ThreeScene";
import { motion } from "framer-motion";
// import AnimatedPath from "../components/AnimatedPath";

const Home = () => {
  return (
    <>
      {/* Home page */}
      <div className="p-2 h-screen w-full">
        <div className="border-2 p-4 bg-gray-100 border-gray-300 rounded-3xl w-full h-full">
          <div className="flex flex-row">
            <div className="w-3/4 rounded-md">
              <motion.h1
                animate={{
                  transition: { duration: 1 },
                  x: 30,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                }}
                className="text-[7vw] font-bold"
              >
                DEEP <span className="text-yellow-500">LAB</span> APPLICATION
              </motion.h1>
              <h2 className="py-5 font-semibold text-xl tracking-tight leading-8">
                Create a New Account or Login if you already have one and dive
                into the incredible world of DeepLab image segmentation. Unleash
                your creativity and explore the limitless possibilities today!
              </h2>
            </div>
            <div className="w-1/3">
              <ThreeScene />
            </div>
            <div className="w-1/3 py-[30vh]">
              <AuthPopup />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
