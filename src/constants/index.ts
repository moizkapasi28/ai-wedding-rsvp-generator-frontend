/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Assets
 */
import {
  BookOpenIcon,
  CalendarIcon,
  CopyIcon,
  EyeIcon,
  GaugeIcon,
  LayoutListIcon,
  LifeBuoyIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  SparklesIcon,
  TrashIcon,
  UserIcon,
  Users2Icon,
  Crown,
  Palette,
  Heart,
  Smile,
  LayoutGrid,
  Camera,
  Star,
  Zap,
  Sparkles,
  Video,
  Pencil,
  Paintbrush,
} from "lucide-react";

export const APP_SIDEBAR = {
  primaryNav: [
    {
      title: "All Weddings",
      path: "/weddings",
      url: "#",
      Icon: LayoutListIcon,
    },
    {
      title: "Wedding Dashboard",
      path: "/weddings/wedding-dashboard",
      url: "#",
      Icon: GaugeIcon,
    },
    {
      title: "Guests",
      url: "#",
      path: "/weddings/guests",
      Icon: Users2Icon,
    },
    {
      title: "Events",
      url: "#",
      path: "/weddings/events",
      Icon: CalendarIcon,
    },
    {
      title: "RSVP Page Settings",
      url: "#",
      path: "/weddings/page-settings",
      Icon: SettingsIcon,
      badge: "Beta",
    },
    {
      title: "AI Invite Card",
      url: "#",
      path: "/weddings/ai-invite-card",
      Icon: SparklesIcon,
      badge: "Beta",
    },
    {
      title: "Guest Preview",
      url: "#",
      path: "/weddings/guest-preview",
      Icon: EyeIcon,
    },
  ],
  secondaryNav: [
    {
      title: "Support",
      url: "#",
      Icon: LifeBuoyIcon,
    },
    {
      title: "Settings",
      url: "#",
      Icon: SettingsIcon,
    },
  ],
  curProfile: {
    src: "https://randomuser.me/api/portraits/men/47.jpg",
    name: "Salvador Pearson",
    email: "salvador.pearson@example.com",
  },
  allProfiles: [
    {
      src: "https://randomuser.me/api/portraits/men/47.jpg",
      name: "Salvador Pearson",
      email: "salvador.pearson@example.com",
    },
    {
      src: "https://randomuser.me/api/portraits/women/43.jpg",
      name: "Violet Hicks",
      email: "violet.hicks@example.com",
    },
  ],
  userMenu: {
    itemsPrimary: [
      {
        title: "View profile",
        url: "#",
        Icon: UserIcon,
        kbd: "⌘K->P",
      },
      {
        title: "Account settings",
        url: "#",
        Icon: SettingsIcon,
        kbd: "⌘S",
      },
      {
        title: "Documentation",
        url: "#",
        Icon: BookOpenIcon,
      },
    ],
    itemsSecondary: [
      {
        title: "Sign out",
        url: "#",
        Icon: LogOutIcon,
        kbd: "⌥⇧Q",
      },
    ],
  },
};

export const DASHBOARD_CARD_MENU = [
  {
    label: "Edit",
    Icon: PencilIcon,
  },
  {
    label: "Copy",
    Icon: CopyIcon,
  },
  {
    label: "Delete",
    Icon: TrashIcon,
  },
];

export const DESIGN_PRESET_OPTIONS = [
  { value: "classic_elegant", label: "Classic Elegant Wedding" },
  { value: "modern_minimalist", label: "Modern Minimalist" },
  { value: "rustic_botanical", label: "Rustic Botanical" },
  { value: "vintage_royal", label: "Vintage Royal" },
  { value: "moody_avant_garde", label: "Moody Avant-Garde" },
];

export const TEXTURE_EMULATION_OPTIONS = [
  { value: "smooth_matte", label: "Smooth Matte" },
  { value: "deckled_watercolor", label: "Deckled Watercolor Paper" },
  { value: "heavy_linen", label: "Heavy Linen" },
  { value: "frosted_vellum", label: "Frosted Vellum" },
  { value: "pearl_shimmer", label: "Pearl Shimmer" },
];

export const METALLIC_ACCENTS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "gold_foil", label: "Gold Foil" },
  { value: "silver_filigree", label: "Silver Filigree" },
  { value: "rose_gold_leaf", label: "Rose Gold Leaf" },
  { value: "holographic_edge", label: "Holographic Edge" },
];

export const NEGATIVE_SPACE_OPTIONS = [
  { value: "centered_core", label: "Centered Core (Empty center)" },
  { value: "bottom_heavy", label: "Bottom Heavy (Empty top half)" },
  { value: "asymmetric_left", label: "Asymmetric Left (Empty right side)" },
  { value: "bordered_frame", label: "Bordered Frame (Open space inside)" },
  { value: "floating_cloud", label: "Floating Cloud (Soft fade to blank center)" },
];

export const MONOGRAM_STYLE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "calligraphic_crest", label: "Calligraphic Crest" },
  { value: "modern_serif", label: "Modern Serif Initials" },
  { value: "floral_wreath", label: "Floral Wreath" },
  { value: "geometric_deco", label: "Geometric Deco Shield" },
];

export const EDGE_STYLING_OPTIONS = [
  { value: "sharp_cut", label: "Sharp Cut" },
  { value: "torn_deckled", label: "Torn/Deckled Edge" },
  { value: "gold_gilded", label: "Gold Gilded Edge" },
  { value: "scalloped_frame", label: "Scalloped Frame" },
  { value: "floral_bleed", label: "Floral Bleed (Spilling off edge)" },
];

export const ILLUSTRATION_THEME_OPTIONS = [
  { value: "traditional", label: "Traditional Indian" },
  { value: "modern", label: "Modern Minimalist" },
  { value: "watercolor", label: "Watercolor" },
  { value: "royal", label: "Royal Heritage" },
];

export const ATTIRE_STYLE_OPTIONS = [
  { id: "default", name: "Default / Let style decide" },
  { id: "lehenga_sherwani", name: "Lehenga & Sherwani" },
  { id: "sharara_sherwani", name: "Sharara/Gharara & Sherwani" },
  { id: "kurta_pagri_sharara", name: "Kurta, Pagri & Sharara" },
  { id: "saree_bandhgala", name: "Saree & Bandhgala" },
  { id: "white_gown_tuxedo", name: "White Gown & Tuxedo" },
  { id: "qipao_tang_suit", name: "Qipao/Cheongsam & Tang Suit" },
  { id: "hanbok", name: "Hanbok" },
  { id: "kimono_montsuki", name: "Kimono & Montsuki" },
  { id: "agbada_asooke", name: "Agbada & Aso-Oke" },
  { id: "jalabiya_thobe", name: "Jalabiya & Thobe-style" },
  { id: "modern_fusion", name: "Modern Fusion" },
  { id: "surprise_me", name: "Surprise me" },
];

export const ILLUSTRATION_STYLE_OPTIONS = [
  { id: "royal_regal_portrait", name: "Royal Portrait", icon: Crown },
  { id: "watercolor_fine_art", name: "Watercolor Dream", icon: Palette },
  { id: "heritage_miniature", name: "Heritage Miniature", icon: Heart },
  { id: "storybook_3d", name: "3D Storybook", icon: Smile },
  { id: "modern_line_art", name: "Modern Line Art", icon: LayoutGrid },
  { id: "vintage_keepsake", name: "Vintage Keepsake", icon: Camera },
  { id: "anime_style", name: "Anime Style", icon: Star },
  { id: "pop_art_bash", name: "Pop Art Bash", icon: Zap },
  { id: "fairytale_romance", name: "Fairytale Romance", icon: Sparkles },
  { id: "retro_cinema_poster", name: "Retro Cinema Poster", icon: Video },
  { id: "fun_caricature", name: "Fun Caricature", icon: Pencil },
  { id: "classic_oil_painting", name: "Classic Oil Painting", icon: Paintbrush },
];

export const TYPOGRAPHY_PAIRING_OPTIONS = [
  { value: 'editorial', label: 'Luxury Editorial (Serifs)' },
  { value: 'modern', label: 'Modern Contrast (Serif + Sans)' },
  { value: 'romantic', label: 'Romantic Script (Script + Serif)' },
  { value: 'minimal', label: 'Ultra Clean (All Sans-Serif)' },
];

export const TEXT_ALIGNMENT_OPTIONS = [
  { value: 'strict', label: 'Strict Center-Aligned (Classic)' },
  { value: 'cascading', label: 'Cascading Center' },
  { value: 'geometric', label: 'Geometric Centered' },
];
