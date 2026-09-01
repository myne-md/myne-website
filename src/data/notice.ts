// The draft-notice vocabulary (myne-md/myne-website#33).
//
// It lives here rather than inside DraftNotice.astro because BOTH the component
// and LandingLayout (which threads the choice through as a prop) have to spell
// the union, and an .astro file cannot export a type for the other to import.
// Two copies drift silently in one direction only: the layout would happily
// accept a fifth variant the component has no copy for, typecheck, build, and
// render a notice with no text in it.
export type NoticeVariant = "status" | "draft" | "updating" | "none";
export type NoticeLang = "en" | "de";
