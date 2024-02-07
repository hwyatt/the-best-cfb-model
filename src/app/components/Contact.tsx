"use client";
import { useState } from "react";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full">
      {submitted ? (
        <div className="flex flex-col gap-8 items-center">
          <img
            src={"icon.png"}
            alt={"saturday stats icon"}
            className="max-h-48"
          />
          <p className="text-xl font-semibold text-gray-800">
            Message sent successfully!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-gray-600">
              Name
            </label>
            <input
              type={"text"}
              className={`w-full text-primary outline-none text-base rounded-md p-2`}
              id="name"
              placeholder={"Joe Burrow"}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-gray-600">
              Email
            </label>
            <input
              type={"text"}
              className={`w-full text-primary outline-none text-base rounded-md p-2`}
              id="email"
              placeholder={"collegefootballfan@cfb.com"}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-semibold text-gray-600">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full text-primary outline-none text-base rounded-md p-2`}
              placeholder={"Lemme see some stats"}
              rows={12}
            ></textarea>
          </div>
          <div className="pt-4">
            <button
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded self-end transition-all duration-100"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
