import './LandingPage.css';

export default function LandingPage({ onEnter }) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <span className="landing-nav__brand">AI DeveLopez</span>
        
        <a 
          href="https://github.com/tu-usuario/tu-repo"
          target="_blank"
          rel="noreferrer"
          className="landing-nav__link"
        >
          Código en GitHub ↗
        </a>
      </nav>

      <main className="landing-hero">
        <h1 className="landing-hero__title">
          Un asistente de IA que vive<br />en tu ordenador, no en la nube.
        </h1>
        <p className="landing-hero__subtitle">
          Chat local con Qwen2.5-Coder corriendo 100% en tu máquina.
          Sin API externa, sin coste por token, sin que tus datos
          salgan de tu red.
        </p>

        <button className="landing-hero__cta" onClick={onEnter}>
          <span className="cta-text">Probar el chat</span>
          <span className="landing-hero__cta-arrow">→</span>
        </button>

        <div className="landing-stack">
          {['React', 'Vite', 'Ollama', 'Qwen2.5-Coder'].map((tech) => (
            <span key={tech} className="landing-stack__badge">
              {tech}
            </span>
          ))}
        </div>
      </main>

      <footer className="landing-footer">
        <span>Daniel López</span>
        <a href="https://linkedin.com/in/tu-perfil" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </footer>
    </div>
  );
}