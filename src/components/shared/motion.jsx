import { cn } from "@/lib/utils";

/** Full-screen page entrance (document picker, template picker, builder). */
export function PageTransition({ children, className }) {
  return <div className={cn("motion-page", className)}>{children}</div>;
}

/** Form / panel section switch — re-mount with `sectionKey` to replay. */
export function AnimatedSection({ sectionKey, children, className }) {
  return (
    <div key={sectionKey} className={cn("motion-section", className)}>
      {children}
    </div>
  );
}

/** Staggered list/card entrance — pass index for delay. */
export function StaggerItem({ index = 0, children, className }) {
  return (
    <div
      className={cn("motion-stagger", className)}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {children}
    </div>
  );
}

/** Onboarding / modal step content swap. */
export function AnimatedStep({ stepKey, children, className }) {
  return (
    <div key={stepKey} className={cn("motion-step", className)}>
      {children}
    </div>
  );
}
