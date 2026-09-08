import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/Icon";

/**
 * The knocked-out bar.
 *
 * The system's signature silhouette: a solid rectangle of bone with black
 * uppercase label type inside it, doing the work a rounded pill button would do
 * elsewhere. On the King Tut's poster the wordmark, the venue and the date each
 * sit in one of these.
 *
 * `bone` is the primary action. `ghost` is a smoke hairline for secondary.
 * `disabled` is the state this band hits often — a sold-out show, an
 * out-of-stock size — so it has to look deliberate rather than broken.
 */

type Variant = "bone" | "ghost" | "disabled";

const base =
  "hs-label inline-flex items-center gap-tight px-[28px] py-block " +
  "transition-colors duration-[120ms] ease-[steps(2,end)] " +
  "focus-visible:outline-2 focus-visible:outline-flash focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  // Hover takes the bar to flash — the paper appears to catch the light.
  bone: "bg-bone text-ink hover:bg-flash hover:text-void",
  ghost:
    "border border-smoke text-ink-white hover:bg-ink-raised hover:text-flash",
  disabled: "border border-smoke text-smoke cursor-not-allowed",
};

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonProps = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
};

type LinkProps = CommonProps & {
  href: string;
  /** Renders the leaving-the-site arrow and the correct rel/target. */
  external?: boolean;
};

export function PosterButton(props: ButtonProps | LinkProps) {
  const variant = props.variant ?? "bone";
  const cls = `${base} ${variants[variant]} ${props.className ?? ""}`;

  if (props.href !== undefined) {
    const { href, external, children } = props;

    if (variant === "disabled") {
      // A disabled action must not stay focusable or navigable.
      return (
        <span className={cls} aria-disabled="true">
          {children}
        </span>
      );
    }

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
        >
          {children}
          <ArrowUpRight className="text-[1.15em]" />
        </a>
      );
    }

    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled ?? variant === "disabled"}
      className={cls}
    >
      {props.children}
    </button>
  );
}
