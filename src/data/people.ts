export type AuthorKey = "furkan" | "omer";

export interface Author {
  key: AuthorKey;
  name: string;        // display name on the page
  schemaName: string;  // schema.org Person.name
  github: string;      // schema.org Person.sameAs
}

export const people: Record<AuthorKey, Author> = {
  furkan: {
    key: "furkan",
    name: "Furkan",
    schemaName: "Furkan Ünsalan",
    github: "https://github.com/furkanunsalan",
  },
  omer: {
    key: "omer",
    name: "Ömer",
    schemaName: "Ömer Duran",
    github: "https://github.com/omerdduran",
  },
};
