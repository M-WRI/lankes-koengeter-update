import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    orderRankField({ type: "post" }),
    defineField({
      name: "images",
      type: "array",
      title: "Images",
      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
            }),
            defineField({
              name: "text",
              type: "text",
              title: "Text for this image",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
  orderings: [orderRankOrdering],
});
