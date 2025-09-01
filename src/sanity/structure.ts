import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Blog")
    .items([
      orderableDocumentListDeskItem({
        type: "post",
        title: "Posts",
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "information",
        title: "Information",
        S,
        context,
      }),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() && !["post", "information"].includes(item.getId()!)
      ),
    ]);
