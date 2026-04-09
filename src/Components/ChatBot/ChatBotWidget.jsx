import React, { useMemo, useState } from "react";
import { getChatbotReply } from "../../services/chatbotService";

const starterPrompts = [
  "Which package is cheapest?",
  "Show Cox's Bazar tour dates",
  "What spots will I visit in Sajek?",
];

const ChatBotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I am Travel Guru AI Assistant. Ask me about package prices, dates, and visiting spots.",
    },
  ]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isTyping,
    [input, isTyping],
  );

  const sendMessage = async (content) => {
    const userText = content.trim();

    if (!userText) return;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(async () => {
      try {
        const botReply = await getChatbotReply(userText);
        setMessages((prev) => [...prev, { role: "assistant", text: botReply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Sorry, I could not process your request right now. Please try again.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 400);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-2xl">
          <div className="bg-cyan-800 px-4 py-3 text-white">
            <h3 className="text-base font-bold">Travel Guru AI Chat</h3>
            <p className="text-xs text-cyan-100">Ask your travel questions</p>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto bg-slate-50 p-3">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-6 ${
                  msg.role === "user"
                    ? "ml-auto bg-cyan-600 text-white"
                    : "bg-white text-slate-700 shadow"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="inline-block rounded-xl bg-white px-3 py-2 text-sm text-slate-500 shadow">
                Assistant is typing...
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-100"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (canSend) {
                  sendMessage(input);
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="rounded-lg bg-cyan-700 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-cyan-800"
      >
        {open ? "Close Chat" : "AI Chat"}
      </button>
    </div>
  );
};

export default ChatBotWidget;
