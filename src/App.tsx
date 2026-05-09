import UserForm from "./components/UserForm";

export default function App() {
  return (
    <div className="layout">
      <aside className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">User Information</span>
          <h1 className="hero-title">
            Tell us about
            <br />
            yourself.
          </h1>
          <p className="hero-tamil">பயனர் தகவல் படிவம்</p>
          <p className="hero-sub">
            Fill out the form on the right. All fields are required and your
            details will be saved securely.
            <br />
            <span className="hero-sub-ta">
              வலதுபக்கம் உள்ள படிவத்தை நிரப்பவும். அனைத்து புலங்களும் கட்டாயம்.
            </span>
          </p>
        </div>
      </aside>

      <main className="form-panel">
        <div className="form-panel-inner">
          <header className="form-header">
            <h2>Your Details / உங்கள் விவரங்கள்</h2>
            <p>Please fill in every field below.</p>
          </header>
          <UserForm />
        </div>
      </main>
    </div>
  );
}
