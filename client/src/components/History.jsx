import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../redux/historySlice";
import { motion } from "framer-motion";

const History = ({ onImageClick }) => {
  const dispatch = useDispatch();
  const historyState = useSelector((state) => state.history);
  const { history, status } = historyState;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHistory());
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-col">
      <div className="mb-2 bg-yellow-500 p-5 rounded-xl">
        <h1 className="text-2xl font-bold text-white tracking-wider">History</h1>
      </div>
      <hr className=" border-2 border-yellow-500 w-11/12 m-auto" />
      <div className="mt-1">
        <motion.div
         animate={{
                  transition: { duration: 1 },
                  x: 10,
                  y: 20,
                  scale: 1,
                  rotate: 0,
                }}
         className="font-semibold text-sm">
          {history.length === 0 ? (
            <p>No history available</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="flex gap-1 hover:bg-yellow-500 hover:text-white py-2 rounded-lg pl-2 cursor-pointer"
                onClick={() => onImageClick(item)}
              >
                <h3>{item.userName}</h3>
                <h3>{new Date(item.loginTime).toLocaleString()}</h3>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
