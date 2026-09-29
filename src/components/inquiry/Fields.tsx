"use client";

import { useId } from "react";
import type { Option } from "@/content/inquiry";
import styles from "./InquiryFlow.module.css";

/** Inline error — collapses to zero height when empty (height + fade transition). */
export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <div className={`${styles.error} ${message ? styles.errorOn : ""}`} aria-live="polite">
      <p id={id} className={styles.errorInner}>
        {message}
      </p>
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  optional?: boolean;
  hint?: string;
  large?: boolean;
};

export function TextField({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  optional,
  hint,
  large,
}: TextFieldProps) {
  const id = useId();
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;
  return (
    <div className={`${styles.field} ${large ? styles.fieldLarge : ""} ${error ? styles.invalid : ""}`}>
      <label htmlFor={id} className={`meta-sm ${styles.label}`}>
        {label}
        {optional && <span className={styles.optional}> — OPTIONAL</span>}
      </label>
      <div className={styles.inputWrap}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={[error ? errId : "", hint ? hintId : ""].filter(Boolean).join(" ") || undefined}
          spellCheck={type === "text"}
        />
        <span className={styles.underline} aria-hidden="true" />
      </div>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <FieldError id={errId} message={error} />
    </div>
  );
}

type ChoiceProps = {
  legend: string;
  options: Option[];
  optional?: boolean;
  error?: string;
  columns?: "auto" | "two" | "three" | "four";
  size?: "large" | "small";
} & (
  | { multiple: true; value: string[]; onChange: (v: string[]) => void }
  | { multiple?: false; value: string; onChange: (v: string) => void }
);

/**
 * Large editorial option buttons. Multi-select uses aria-pressed toggles;
 * single-select behaves as a radio group (click again to clear when optional).
 */
export function ChoiceGroup(props: ChoiceProps) {
  const { legend, options, optional, error, columns = "auto", size = "large" } = props;
  const id = useId();
  const errId = `${id}-err`;
  const isOn = (oid: string) => (props.multiple ? props.value.includes(oid) : props.value === oid);
  const toggle = (oid: string) => {
    if (props.multiple) {
      props.onChange(isOn(oid) ? props.value.filter((v) => v !== oid) : [...props.value, oid]);
    } else {
      props.onChange(isOn(oid) && optional ? "" : oid);
    }
  };
  return (
    <fieldset className={styles.group} aria-describedby={error ? errId : undefined}>
      <legend className={`meta-sm ${styles.label}`}>
        {legend}
        {props.multiple && <span className={styles.optional}> — CHOOSE ANY</span>}
        {optional && <span className={styles.optional}> — OPTIONAL</span>}
      </legend>
      <div
        className={`${styles.choices} ${styles[`cols_${columns}`]} ${size === "small" ? styles.choicesSmall : ""}`}
        role={props.multiple ? "group" : "radiogroup"}
        aria-label={legend}
      >
        {options.map((o) => {
          const on = isOn(o.id);
          return (
            <button
              key={o.id}
              type="button"
              className={`${styles.choice} ${on ? styles.choiceOn : ""}`}
              onClick={() => toggle(o.id)}
              {...(props.multiple ? { "aria-pressed": on } : { role: "radio", "aria-checked": on })}
            >
              <span className={styles.check} aria-hidden="true" />
              <span className={styles.choiceLabel}>{o.label}</span>
            </button>
          );
        })}
      </div>
      <FieldError id={errId} message={error} />
    </fieldset>
  );
}
