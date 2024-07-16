import { CollectionFieldSchema } from "typesense/lib/Typesense/Collection";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const issueSchema: CollectionCreateSchema = {
  name: "issues",
  fields: [
    { name: "id", type: "string" },
    { name: "teamId", type: "string" },
    { name: "number", type: "int32" },
    { name: "numberString", type: "string" },
    { name: "issueNumber", type: "string" },
    { name: "title", type: "string" },
    { name: "description", type: "string" },
    { name: "descriptionString", type: "string" },
    { name: "stateId", type: "string" },
    { name: "workspaceId", type: "string" },
    { name: "assigneeId", type: "string" },
  ],
  default_sorting_field: "number",
};

export const cohereEmbedding: CollectionFieldSchema = {
  name: "embeddings",
  type: "float[]",
  num_dim: 1024,
};

export const typesenseEmbedding: CollectionFieldSchema = {
  name: "embeddings",
  type: "float[]",
  embed: {
    from: ["issueNumber", "title", "description"],
    model_config: {
      model_name: "ts/all-MiniLM-L12-v2",
    },
  },
};
