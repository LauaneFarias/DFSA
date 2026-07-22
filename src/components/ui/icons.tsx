"use client";

/**
 * Icon set for the site, backed by Phosphor Icons
 * (@phosphor-icons/react) rather than hand-rolled inline SVGs. Every
 * export below is a thin, semantically-named wrapper around a
 * Phosphor icon so the rest of the app can keep importing
 * `RulebookIcon`, `SearchIcon`, etc. without caring which underlying
 * icon library is in use.
 */

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bank,
  Bell,
  BookOpen,
  Briefcase,
  CaretDown,
  CaretLeft,
  CaretRight,
  Certificate,
  ChartLineUp,
  ChatCenteredDots,
  ClipboardText,
  ClockCounterClockwise,
  DotsNine,
  Equals,
  FileText,
  Gavel,
  GearSix,
  Globe,
  HandCoins,
  Handshake,
  IdentificationBadge,
  IdentificationCard,
  InstagramLogo,
  Lightbulb,
  LinkedinLogo,
  MagnifyingGlass,
  Microphone,
  Scales,
  Scroll,
  SealCheck,
  ShieldCheck,
  ShieldCheckered,
  ShieldWarning,
  TrendUp,
  Umbrella,
  X,
  XLogo,
} from "@phosphor-icons/react";

type IconProps = { size?: number };

export function SearchIcon({ size = 17 }: IconProps) {
  return <MagnifyingGlass size={size} weight="regular" aria-hidden="true" />;
}

export function MicrophoneIcon({ size = 17 }: IconProps) {
  return <Microphone size={size} weight="regular" aria-hidden="true" />;
}

export function ChevronLeft({ size = 14 }: IconProps) {
  return <CaretLeft size={size} weight="bold" aria-hidden="true" />;
}

export function ChevronRight({ size = 14 }: IconProps) {
  return <CaretRight size={size} weight="bold" aria-hidden="true" />;
}

/** The search category select's dropdown indicator. */
export function ChevronDown({ size = 12 }: IconProps) {
  return <CaretDown size={size} weight="bold" aria-hidden="true" />;
}

/** Recent-search row icon (a "history" clock). */
export function HistoryIcon({ size = 14 }: IconProps) {
  return <ClockCounterClockwise size={size} weight="regular" aria-hidden="true" />;
}

/* These service-card icons use the "light" Phosphor weight (a ~1.5px
   stroke at these sizes) per request — a bit thinner/lighter than the
   library's default "regular" weight. They're only ever used inside
   ServiceCardRow, so it's safe to hardcode the weight here rather than
   threading a weight prop through every wrapper. */
export function RulebookIcon({ size = 17 }: IconProps) {
  return <BookOpen size={size} weight="light" aria-hidden="true" />;
}

export function AuthorisationIcon({ size = 17 }: IconProps) {
  return <SealCheck size={size} weight="light" aria-hidden="true" />;
}

export function RegisterIcon({ size = 17 }: IconProps) {
  return <IdentificationCard size={size} weight="light" aria-hidden="true" />;
}

export function DecisionIcon({ size = 17 }: IconProps) {
  return <Gavel size={size} weight="regular" aria-hidden="true" />;
}

export function CareerIcon({ size = 17 }: IconProps) {
  return <Briefcase size={size} weight="regular" aria-hidden="true" />;
}

export function InnovationIcon({ size = 17 }: IconProps) {
  return <Lightbulb size={size} weight="light" aria-hidden="true" />;
}

export function SupervisionIcon({ size = 17 }: IconProps) {
  return <ShieldCheck size={size} weight="light" aria-hidden="true" />;
}

export function DocumentIcon({ size = 17 }: IconProps) {
  return <FileText size={size} weight="light" aria-hidden="true" />;
}

export function EnforcementIcon({ size = 17 }: IconProps) {
  return <Gavel size={size} weight="light" aria-hidden="true" />;
}

export function PolicyIcon({ size = 17 }: IconProps) {
  return <Scroll size={size} weight="light" aria-hidden="true" />;
}

export function InternationalIcon({ size = 17 }: IconProps) {
  return <Globe size={size} weight="light" aria-hidden="true" />;
}

export function ComplaintsIcon({ size = 17 }: IconProps) {
  return <ChatCenteredDots size={size} weight="light" aria-hidden="true" />;
}

export function WaiversIcon({ size = 17 }: IconProps) {
  return <Scales size={size} weight="light" aria-hidden="true" />;
}

export function BellIcon({ size = 15 }: IconProps) {
  return <Bell size={size} weight="regular" aria-hidden="true" />;
}

export function ArrowUpRightIcon({ size = 16 }: IconProps) {
  return <ArrowUpRight size={size} weight="regular" aria-hidden="true" />;
}

/** 3x3 dot grid — the "trendy pixel-dotted" menu trigger icon (no
 * longer used by the hamburger button, kept in case it's wanted
 * again). */
export function DotsNineIcon({ size = 18 }: IconProps) {
  return <DotsNine size={size} weight="bold" aria-hidden="true" />;
}

/** Two horizontal lines — the hamburger button's menu-trigger glyph,
 * per feedback asking for a simpler "two-line" icon instead of the
 * dot grid. */
export function TwoLinesIcon({ size = 18 }: IconProps) {
  return <Equals size={size} weight="bold" aria-hidden="true" />;
}

export function CloseIcon({ size = 18 }: IconProps) {
  return <X size={size} weight="bold" aria-hidden="true" />;
}

export function ArrowRightIcon({ size = 15 }: IconProps) {
  return <ArrowRight size={size} weight="regular" aria-hidden="true" />;
}

/** Plain arrow (shaft + head, no circle/pill background) — used to be
 * the What We Do row's prev/next nav; kept in case it's wanted again,
 * but superseded there by the user-supplied PrevArrowIcon/NextArrowIcon
 * below. */
export function ArrowLeftIcon({ size = 18 }: IconProps) {
  return <ArrowLeft size={size} weight="regular" aria-hidden="true" />;
}

/** User-supplied slider arrows (see public/icons/Pre.svg / Next.svg),
 * inlined as JSX rather than loaded via <img> so the stroke can use
 * currentColor and pick up the same hover-color transition as every
 * other icon here (see .hero-card-row-nav button:hover in hero.css). */
export function PrevArrowIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.1117 12.0004L1.97578 12.0004M11 23.112L3.29411 15.4061C1.41315 13.5252 1.41315 10.4755 3.29411 8.59456L11 0.888672"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NextArrowIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1.88832 12.0004L22.0242 12.0004M13 23.112L20.7059 15.4061C22.5869 13.5252 22.5869 10.4755 20.7059 8.59456L13 0.888672"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---- "Our Approach" risk-domain icons ---- */
export function AuditIcon({ size = 20 }: IconProps) {
  return <ClipboardText size={size} weight="light" aria-hidden="true" />;
}

export function CyberRiskIcon({ size = 20 }: IconProps) {
  return <ShieldWarning size={size} weight="light" aria-hidden="true" />;
}

export function InsuranceIcon({ size = 20 }: IconProps) {
  return <Umbrella size={size} weight="light" aria-hidden="true" />;
}

export function OperationalRiskIcon({ size = 20 }: IconProps) {
  return <GearSix size={size} weight="light" aria-hidden="true" />;
}

export function MarketsSupervisionIcon({ size = 20 }: IconProps) {
  return <ChartLineUp size={size} weight="light" aria-hidden="true" />;
}

/* ---- "About the DFSA" feature-card icons ---- */
export function GrowthIcon({ size = 22 }: IconProps) {
  return <TrendUp size={size} weight="light" aria-hidden="true" />;
}

export function CollaborationIcon({ size = 22 }: IconProps) {
  return <Handshake size={size} weight="light" aria-hidden="true" />;
}

/* ---- "Start your DIFC journey" authorisation-type icons ---- */
export function FirmIcon({ size = 20 }: IconProps) {
  return <Bank size={size} weight="light" aria-hidden="true" />;
}

export function IndividualIcon({ size = 20 }: IconProps) {
  return <IdentificationBadge size={size} weight="light" aria-hidden="true" />;
}

export function InstitutionIcon({ size = 20 }: IconProps) {
  return <Bank size={size} weight="light" aria-hidden="true" />;
}

export function AuditorIcon({ size = 20 }: IconProps) {
  return <Certificate size={size} weight="light" aria-hidden="true" />;
}

export function DnfbpIcon({ size = 20 }: IconProps) {
  return <ShieldCheckered size={size} weight="light" aria-hidden="true" />;
}

/* ---- "Additional References" card icon ---- */
export function IslamicFinanceIcon({ size = 20 }: IconProps) {
  return <HandCoins size={size} weight="light" aria-hidden="true" />;
}

/* ---- Footer ---- */
export function LinkedInIcon({ size = 16 }: IconProps) {
  return <LinkedinLogo size={size} weight="regular" aria-hidden="true" />;
}

export function XSocialIcon({ size = 16 }: IconProps) {
  return <XLogo size={size} weight="regular" aria-hidden="true" />;
}

export function InstagramIcon({ size = 16 }: IconProps) {
  return <InstagramLogo size={size} weight="regular" aria-hidden="true" />;
}
