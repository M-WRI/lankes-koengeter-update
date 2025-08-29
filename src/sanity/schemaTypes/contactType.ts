import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export const contactType = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      type: "string",
      title: "Link or Phone Number",
      description:
        "Enter a URL (e.g., https://example.com) or phone number (e.g., tel:03088767600)",
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: "contact" }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      link: "link",
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.link,
        media: LinkIcon,
      };
    },
  },
  orderings: [orderRankOrdering],
});
