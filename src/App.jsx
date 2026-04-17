// I.R.I.S — MODO PALCO HACKATHON
// Experiência guiada para impressionar jurados em 30–60 segundos

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const videoRef = useRef(null);

  const [stage, setStage] = useState(0); // narrativa
  const [objects, setObjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);

  // CAMERA
  useEffect(() => {
    async function start() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: stage < 2 ? "user" : "environment" }
      });
      videoRef.current.srcObject = stream;
    }
    start();
  }, [stage]);

  // NARRATIVA AUTOMÁTICA (FLOW DE DEMO)
  useEffect(() => {
    if (stage === 0) setTimeout(() => setStage(1), 2000); // íris
    if (stage === 1) setTimeout(() => setStage(2), 2500); // entrar AR
    if (stage === 2) setTimeout(() => fakeDetection(), 2000); // detectar objeto
    if (stage === 3) setTimeout(() => triggerAI(), 2500); // IA fala
  }, [stage]);

  const fakeDetection = () => {
    const obj = {
      id: Date.now(),
      x: window.innerWidth / 2 - 60,
      y: window.innerHeight / 2 - 40,
      name: "Analisando...",
      status: ""
    };

    setObjects([obj]);

    setTimeout(() => update(obj.id, { name: "Equipamento Crítico" }), 800);
    setTimeout(() => update(obj.id, { status: "Restrito" }), 1600);

    setStage(3);
  };

  const update = (id, data) => {
    setObjects((o) => o.map((x) => (x.id === id ? { ...x, ...data } : x)));
  };

  const triggerAI = () => {
    setShowChat(true);

    setTimeout(() => {
      setMessages([
        { from: "ai", text: "Objeto identificado. Acesso restrito." }
      ]);

      const utter = new SpeechSynthesisUtterance(
        "Objeto identificado. Acesso restrito"
      );
      speechSynthesis.speak(utter);
    }, 1000);
  };

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden">

      {/* CAMERA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute w-full h-full object-cover"
      />

      {/* CINEMATIC OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/30 backdrop-blur-md" />

      {/* SCAN EFFECT */}
      {stage === 1 && (
        <motion.div
          className="absolute w-60 h-60 border-4 border-blue-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}

      {/* OBJECT */}
      {objects.map((o) => (
        <motion.div
          key={o.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute border border-blue-400 rounded-lg p-3 text-xs bg-black/40 backdrop-blur"
          style={{ left: o.x, top: o.y }}
        >
          <div className="text-blue-300">{o.name}</div>
          <div className="text-red-400">{o.status}</div>
        </motion.div>
      ))}

      {/* CHAT AUTO */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 right-6 w-72 bg-black/60 backdrop-blur-xl p-3 rounded-xl"
          >
            {messages.map((m, i) => (
              <div key={i} className="text-xs">
                <b>{m.from}:</b> {m.text}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TITLE (IMPACTO INICIAL) */}
      {stage === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
        >
          I.R.I.S SYSTEM INITIALIZING
        </motion.div>
      )}

    </div>
  );
}
