import { client } from "./client";
import { contactQuery, informationQuery, postsQuery } from "./queries";
import type { Contact, Information, Post } from "./types";

export async function getContacts(): Promise<Contact[]> {
  return client.fetch(contactQuery);
}

export async function getInformation(): Promise<Information | null> {
  return client.fetch(informationQuery);
}

export async function getPosts(): Promise<Post[]> {
  return client.fetch(postsQuery);
}
