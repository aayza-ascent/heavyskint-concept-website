/**
 * A form field.
 *
 * The label sits above the input, never inside it as a placeholder: the contact
 * form is a promoter's route to the band and has to survive being half-filled,
 * and a placeholder disappears the moment someone starts typing.
 *
 * Focus thickens the hairline to flash rather than adding a coloured ring —
 * there is no hue anywhere in this system.
 */

const inputClass =
  "hs-body w-full border border-smoke bg-ink-raised px-block py-[14px] text-flash " +
  "transition-colors duration-[120ms] ease-[steps(2,end)] " +
  "focus:border-flash focus:outline-none focus-visible:outline-none " +
  "placeholder:text-smoke";

type BaseProps = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
};

export function Field({
  name,
  label,
  hint,
  required,
  autoComplete,
  type = "text",
}: BaseProps & { type?: "text" | "email" }) {
  return (
    <div>
      <label htmlFor={name} className="hs-label block text-smoke">
        {label}
        {required ? null : <span className="ml-tight">(optional)</span>}
      </label>
      {hint ? <p className="hs-meta mt-hair text-smoke">{hint}</p> : null}
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${name}-hint` : undefined}
        className={`${inputClass} mt-tight max-w-none`}
      />
    </div>
  );
}

export function TextArea({
  name,
  label,
  hint,
  required,
  rows = 7,
}: BaseProps & { rows?: number }) {
  return (
    <div>
      <label htmlFor={name} className="hs-label block text-smoke">
        {label}
        {required ? null : <span className="ml-tight">(optional)</span>}
      </label>
      {hint ? <p className="hs-meta mt-hair text-smoke">{hint}</p> : null}
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        className={`${inputClass} mt-tight max-w-none resize-y`}
      />
    </div>
  );
}
