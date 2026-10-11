// Invisible decoy field for public forms: real visitors never see or fill
// it, but simple bots that auto-fill every input do. If it has a value on
// submit, we pretend to succeed without actually writing to the database —
// no new table, no external service, no friction for real users.
interface HoneypotProps {
  value: string;
  onChange: (v: string) => void;
}

const Honeypot = ({ value, onChange }: HoneypotProps) => (
  <div aria-hidden="true" className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden">
    <label htmlFor="company_website">Company Website</label>
    <input
      id="company_website"
      name="company_website"
      type="text"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Honeypot;
