import { useResumeStore } from "@/store/resumeStore";
import { formatLetterDate } from "@/lib/utils";
import { getPaperSize } from "@/lib/paperSizes";
import { SignatureBlock } from "./SignatureBlock";
import { SIGNATURE_WIDTH, SIGNATURE_HEIGHT } from "@/lib/signatureConstants";

const fontSizeMap = { sm: "11px", md: "12px", lg: "13px" };
const marginMap = { tight: 32, normal: 48, wide: 64 };

function getTheme(template, accent) {
  const ac = accent || "#1e3a5f";

  const themes = {
    professional: {
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      nameStyle: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#111",
        margin: 0,
        lineHeight: 1.2,
        textAlign: "center",
      },
      dateStyle: { fontSize: "11px", color: "#444", whiteSpace: "nowrap" },
      contactStyle: {
        fontSize: "11px",
        color: "#555",
        textAlign: "center",
        margin: "8px 0 0 0",
        lineHeight: 1.5,
      },
      doubleRule: { margin: "10px 0 14px 0" },
      jobTitleStyle: {
        fontSize: "13px",
        fontWeight: "700",
        textAlign: "center",
        color: "#111",
        margin: "0 0 18px 0",
      },
      recipientStyle: {
        fontSize: "12px",
        fontWeight: "600",
        color: ac,
        whiteSpace: "nowrap",
      },
      recipientRule: { flex: 1, height: "1px", backgroundColor: ac, opacity: 0.35 },
      bodyStyle: {
        fontSize: "inherit",
        color: "#222",
        lineHeight: 1.65,
        margin: "0 0 12px 0",
        textAlign: "left",
      },
      bulletStyle: {
        margin: "0 0 14px 0",
        paddingLeft: "18px",
        listStyleType: "disc",
      },
      bulletItemStyle: { marginBottom: "4px", lineHeight: 1.55 },
      closingStyle: { margin: "16px 0 0 0", fontSize: "inherit" },
      signedNameStyle: { fontWeight: "600", fontSize: "inherit" },
    },

    modern: {
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      nameStyle: {
        fontSize: "24px",
        fontWeight: "700",
        color: ac,
        margin: 0,
        lineHeight: 1.15,
        textAlign: "left",
      },
      dateStyle: { fontSize: "11px", color: "#888", whiteSpace: "nowrap" },
      contactStyle: {
        fontSize: "11px",
        color: "#666",
        textAlign: "left",
        margin: "6px 0 0 0",
        lineHeight: 1.6,
      },
      doubleRule: { margin: "12px 0 16px 0", borderTop: `2px solid ${ac}`, opacity: 1 },
      jobTitleStyle: {
        fontSize: "13px",
        fontWeight: "600",
        textAlign: "left",
        color: "#333",
        margin: "0 0 20px 0",
      },
      recipientStyle: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#111",
        whiteSpace: "nowrap",
      },
      recipientRule: { flex: 1, height: "2px", backgroundColor: ac, opacity: 0.2 },
      bodyStyle: {
        fontSize: "inherit",
        color: "#333",
        lineHeight: 1.7,
        margin: "0 0 12px 0",
        textAlign: "left",
      },
      bulletStyle: {
        margin: "0 0 14px 0",
        paddingLeft: "16px",
        listStyleType: "disc",
      },
      bulletItemStyle: { marginBottom: "4px", lineHeight: 1.6 },
      closingStyle: { margin: "18px 0 0 0", fontSize: "inherit" },
      signedNameStyle: { fontWeight: "600", fontSize: "inherit" },
    },
  };

  return themes[template] || themes.professional;
}

function LetterHeader({ sender, letter, theme, accent, variant }) {
  const contact = [sender.address, sender.phone, sender.email].filter(Boolean).join(" | ");
  const isModern = variant === "modern";

  if (isModern) {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <h1 style={{ ...theme.nameStyle, color: accent }}>{sender.fullName || "Your Name"}</h1>
          {letter.date && <div style={theme.dateStyle}>{formatLetterDate(letter.date)}</div>}
        </div>
        {contact && <p style={theme.contactStyle}>{contact}</p>}
        <div style={{ borderTop: `2px solid ${accent}`, margin: "12px 0 16px 0" }} />
        {letter.jobTitle && <p style={theme.jobTitleStyle}>{letter.jobTitle}</p>}
      </>
    );
  }

  return (
    <>
      <div style={{ position: "relative", marginBottom: "6px" }}>
        {letter.date && (
          <div style={{ ...theme.dateStyle, position: "absolute", right: 0, top: 0 }}>
            {formatLetterDate(letter.date)}
          </div>
        )}
        <h1 style={theme.nameStyle}>{sender.fullName || "Your Name"}</h1>
        {contact && <p style={theme.contactStyle}>{contact}</p>}
      </div>
      <div style={{ margin: "10px 0 14px 0" }}>
        <div style={{ borderTop: "2px solid #111", marginBottom: "2px" }} />
        <div style={{ borderTop: "1px solid #111" }} />
      </div>
      {letter.jobTitle && <p style={theme.jobTitleStyle}>{letter.jobTitle}</p>}
    </>
  );
}

export function CoverLetterDocument({
  interactiveSignature = false,
  documentScale = 1,
}) {
  const { coverLetter, updateCoverLetterLetter } = useResumeStore();
  const { meta, sender, letter } = coverLetter;

  const paper = getPaperSize(meta.paperSize || "letter");
  const padding = marginMap[meta.pageMargin] || 48;
  const fontSize = fontSizeMap[meta.fontSize] || "12px";
  const theme = getTheme(meta.template, meta.accentColor);
  const accent = meta.accentColor || "#1e3a5f";

  const paragraphs = (letter.body || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const bullets = (letter.bullets || []).filter((b) => b.text?.trim());
  const recipientLine = [
    letter.recipientName && letter.recipientCompany
      ? `${letter.recipientName} - ${letter.recipientCompany}`
      : letter.recipientName || letter.recipientCompany,
  ].filter(Boolean)[0];

  return (
    <div
      id="document-root"
      style={{
        width: `${paper.widthPx}px`,
        minHeight: `${paper.heightPx}px`,
        backgroundColor: "#fff",
        color: "#111",
        fontFamily: meta.fontFamily || theme.fontFamily,
        fontSize,
        lineHeight: 1.55,
        padding: `${padding}px`,
        boxSizing: "border-box",
      }}
    >
      <LetterHeader
        sender={sender}
        letter={letter}
        theme={theme}
        accent={accent}
        variant={meta.template}
      />

      {recipientLine && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <span style={theme.recipientStyle}>To {recipientLine}</span>
          <div style={theme.recipientRule} />
        </div>
      )}

      {letter.salutation && (
        <p style={{ ...theme.bodyStyle, marginBottom: "14px" }}>{letter.salutation}</p>
      )}

      {paragraphs.map((para, i) => (
        <p key={i} style={theme.bodyStyle}>
          {para}
        </p>
      ))}

      {bullets.length > 0 && (
        <ul style={theme.bulletStyle}>
          {bullets.map((b) => (
            <li key={b.id} style={theme.bulletItemStyle}>
              {b.text}
            </li>
          ))}
        </ul>
      )}

      {letter.closing && <p style={theme.closingStyle}>{letter.closing}</p>}

      <SignatureBlock
        signature={letter.signature}
        fullName={sender.fullName}
        signedNameStyle={theme.signedNameStyle}
        width={letter.signatureWidth ?? SIGNATURE_WIDTH}
        height={letter.signatureHeight ?? SIGNATURE_HEIGHT}
        resizable={interactiveSignature && Boolean(letter.signature)}
        documentScale={documentScale}
        offsetX={letter.signatureOffsetX ?? 0}
        offsetY={letter.signatureOffsetY ?? 0}
        movable={interactiveSignature && Boolean(letter.signature)}
        onResize={
          interactiveSignature
            ? (signatureWidth, signatureHeight) =>
                updateCoverLetterLetter({ signatureWidth, signatureHeight })
            : undefined
        }
        onMove={
          interactiveSignature
            ? (signatureOffsetX, signatureOffsetY) =>
                updateCoverLetterLetter({ signatureOffsetX, signatureOffsetY })
            : undefined
        }
      />
    </div>
  );
}
