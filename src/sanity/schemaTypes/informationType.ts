import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const informationType = defineType({
  name: "information",
  title: "Information",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The title for this information section (e.g., 'About Us', 'Services', 'Company Info')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "id",
      type: "string",
      title: "ID",
      description:
        "The ID for this information section (e.g., 'about-us', 'services', 'company-info')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentBlocks",
      type: "array",
      title: "Content Blocks",
      description: "Add multiple content blocks for your information section",
      of: [
        defineArrayMember({
          type: "object",
          name: "contentBlock",
          title: "Content Block",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title (Optional)",
              description: "Optional title for this content block",
            }),
            defineField({
              name: "text",
              type: "text",
              title: "Text",
              description: "The main content text for this block",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              text: "text",
            },
            prepare(selection) {
              const text = selection.text || "No text";
              return {
                title: selection.title || "Untitled Block",
                subtitle:
                  text.length > 50 ? `${text.substring(0, 50)}...` : text,
                media: DocumentIcon,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      blocks: "contentBlocks",
    },
    prepare(selection) {
      const blocks = selection.blocks || [];
      return {
        title: selection.title || "Untitled Information",
        subtitle: `${blocks.length} content block${blocks.length !== 1 ? "s" : ""}`,
        media: DocumentIcon,
      };
    },
  },
});
