import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [message, setMessage] = useState("");
  const [landLord, setLandlord] = useState(null);
  const onchange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/user/${listing.userRef}`,
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landLord && (
        <div className="flex flex-col gap-2">
          <p className="items-center gap-2 flex flex-wrap">
            Contact - <span className="font-semibold">{landLord.username}</span>{" "}
            For{" "}
            <span className="font-semibold ">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            value={message}
            onChange={onchange}
            name="message"
            id="message"
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
            rows="2"
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
