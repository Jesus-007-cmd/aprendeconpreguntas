// Navbar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Iconos simples en SVG (sin dependencias). Cámbialos si prefieres react-icons.
const Icon = {
  Menu: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Close: (props) => (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...props}>
      <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  ChevronDown: (props) => (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const LANG_ITEMS = [
  { label: "Alemán", option: "german" },
  { label: "Francés", option: "french" },
  { label: "Japonés", option: "japanese" },
  { label: "Portugués", option: "portuguese" },
  { label: "Italiano", option: "italian" },
  { label: "Inglés", option: "english" },
  { label: "Quiz All Languages", option: "QuizAllLanguages" },
  { label: "Word Display All Languages", option: "WordDisplayAllLanguagesComponent" },
  { label: "Spaced Repetition", option: "SpacedRepetition" },
  { label: "Quiz Audio", option: "QuizAppAllLanguages" },
  { label: "Quiz Audio 190", option: "QuizAppAllLanguages2" },
];

const MAIN_ITEMS = [
  { label: "Cuestionario", option: "quiz" },
  { label: "Learning English with Phrases", option: "LearningEnglishWithQuestions" },
  // ❌ Antes: { label: "Herramientas", option: "CombineCSVFiles" },
  // ✅ Ahora será un dropdown (no lo metas aquí como botón plano)
  { label: "Cuestionario V2 (Entrevistas)", option: "interviewQuiz" },
  { label: "Quiz 3D Carrusel", option: "interviewQuiz3D" },
];

// NUEVO: items para Herramientas
const TOOLS_ITEMS = [
  { label: "Análisis Univariado (TXT → grid)", option: "AnalisisUnivariado" },
  { label: "Excel → JSON", option: "ExcelToJsonConverter" },
  { label: "Combinar CSV", option: "CombineCSVFiles" },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};
// NUEVO: handlers hover para Herramientas


export default function Navbar({ onSelectOption }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);
  const langBtnRef = useRef(null);
  const langMenuRef = useRef(null);
  // NUEVO: estado/refs para Herramientas (desktop)
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsBtnRef = useRef(null);
  const toolsMenuRef = useRef(null);
  const toolsHandlers = {
    onMouseEnter: () => setToolsOpen(true),
    onMouseLeave: () => setToolsOpen(false),
  };
  // Scroll style (sticky + blur)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquear scroll del body al abrir menú móvil
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  // Cerrar dropdown si se clickea fuera
  useEffect(() => {
    const onClick = (e) => {
      const t = e.target;
      // cerrar Pronunciación
      if (
        langsOpen &&
        langMenuRef.current && !langMenuRef.current.contains(t) &&
        langBtnRef.current && !langBtnRef.current.contains(t)
      ) setLangsOpen(false);

      // NUEVO: cerrar Herramientas
      if (
        toolsOpen &&
        toolsMenuRef.current && !toolsMenuRef.current.contains(t) &&
        toolsBtnRef.current && !toolsBtnRef.current.contains(t)
      ) setToolsOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setLangsOpen(false);
        setToolsOpen(false); // NUEVO
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [langsOpen, toolsOpen]);


  const handleNavigate = (option) => {
    if (typeof onSelectOption === "function") onSelectOption(option);
    setMobileOpen(false);
  };

  // Desktop: dropdown pronunciación con “hover-intent”
  // (abrimos al enfocar o al hacer hover; cerramos al salir)
  const langHandlers = useMemo(
    () => ({
      onMouseEnter: () => setLangsOpen(true),
      onMouseLeave: () => setLangsOpen(false),
    }),
    []
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-gray-900/70 backdrop-blur-md shadow-sm" : "bg-gray-900"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo / título (puedes reemplazar por una imagen) */}
          <button
            className="text-white font-bold tracking-wide text-lg md:text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
            onClick={() => handleNavigate("home")}
            aria-label="Inicio"
          >
            Mi App
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-6 text-white">
            {MAIN_ITEMS.map((item) => (
              <li key={item.option}>
                <button
                  onClick={() => handleNavigate(item.option)}
                  className="hover:text-yellow-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
                >
                  {item.label}
                </button>
              </li>

            ))}
            {/* NUEVO: Dropdown Herramientas (desktop) */}
            <li className="relative" {...toolsHandlers}>
              <button
                ref={toolsBtnRef}
                onClick={() => setToolsOpen((v) => !v)}
                className="flex items-center gap-1 hover:text-yellow-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
                aria-haspopup="menu"
                aria-expanded={toolsOpen}
                aria-controls="tools-menu"
              >
                Herramientas
                <Icon.chevronDown className={`w-4 h-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    id="tools-menu"
                    role="menu"
                    ref={toolsMenuRef}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={panelVariants}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[280px] w-max bg-gray-800 text-white rounded-xl shadow-xl border border-yellow-400/50 overflow-hidden"
                  >
                    <div className="grid grid-cols-1">
                      {TOOLS_ITEMS.map((item) => (
                        <button
                          key={item.option}
                          onClick={() => { handleNavigate(item.option); setToolsOpen(false); }}
                          role="menuitem"
                          className="px-4 py-2 text-left hover:bg-gray-700/70 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Dropdown Pronunciación */}
            <li className="relative" {...langHandlers}>
              <button
                ref={langBtnRef}
                onClick={() => setLangsOpen((v) => !v)}
                className="flex items-center gap-1 hover:text-yellow-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
                aria-haspopup="menu"
                aria-expanded={langsOpen}
                aria-controls="pronunciacion-menu"
              >
                Pronunciación
                <Icon.chevronDown className={`w-4 h-4 transition-transform ${langsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langsOpen && (
                  <motion.div
                    id="pronunciacion-menu"
                    role="menu"
                    ref={langMenuRef}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={panelVariants}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[260px] w-max bg-gray-800 text-white rounded-xl shadow-xl border border-yellow-400/50 overflow-hidden"
                  >
                    {/* Grid en 2 columnas para mejor lectura */}
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      {LANG_ITEMS.map((item) => (
                        <button
                          key={item.option}
                          onClick={() => {
                            handleNavigate(item.option);
                            setLangsOpen(false);
                          }}
                          role="menuitem"
                          className="px-4 py-2 text-left hover:bg-gray-700/70 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Toggle móvil */}
          <button
            className="md:hidden text-white p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <Icon.close className="w-6 h-6" /> : <Icon.menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil (overlay + panel) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Fondo oscuro */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.aside
              className="fixed top-0 right-0 h-full w-[84%] max-w-sm bg-gray-900 z-50 shadow-xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              aria-label="Menú móvil"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-white font-semibold">Menú</span>
                <button
                  className="text-white p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <Icon.close className="w-6 h-6" />
                </button>
              </div>

              <div className="px-2 py-2 overflow-y-auto">
                <ul className="space-y-1">
                  {MAIN_ITEMS.map((item) => (
                    <li key={item.option}>
                      <button
                        onClick={() => handleNavigate(item.option)}
                        className="w-full text-left px-3 py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}

                  {/* Acordeón Pronunciación en móvil */}
                  <MobileAccordion
                    title="Pronunciación"
                    items={LANG_ITEMS}
                    onPick={(opt) => handleNavigate(opt)}
                  />
                  {/* NUEVO: Acordeón Herramientas en móvil */}
                  <MobileAccordion
                    title="Herramientas"
                    items={TOOLS_ITEMS}
                    onPick={(opt) => handleNavigate(opt)}
                  />

                </ul>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileAccordion({ title, items, onPick }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <li className="border-t border-white/10 pt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-colors"
        aria-expanded={open}
        aria-controls={`section-${title}`}
      >
        <span>{title}</span>
        <Icon.chevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`section-${title}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul ref={contentRef} className="py-1">
              {items.map((it) => (
                <li key={it.option}>
                  <button
                    onClick={() => onPick(it.option)}
                    className="w-full text-left px-5 py-2.5 rounded-lg text-white/90 hover:bg-white/10 active:bg-white/20 transition-colors"
                  >
                    {it.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
