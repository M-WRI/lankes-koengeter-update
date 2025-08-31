export interface Contact {
  _id: string;
  title: string;
  link: string;
  publishedAt?: string;
}

export interface InformationContentBlock {
  title?: string;
  text: string;
}

export interface Information {
  _id: string;
  id: string;
  title: string;
  contentBlocks: InformationContentBlock[];
  publishedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  images?: Array<{
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
    text?: string;
  }>;
  publishedAt?: string;
}
