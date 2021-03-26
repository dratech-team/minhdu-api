import { Schema } from "mongoose";
import { ObjectId } from "mongodb";

export function tossInitPlugin(schema: Schema, options: { name: string }) {
  schema.add(BaseSchema);
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });
  schema.set("timestamps", true);
  schema.set("collection", options.name);
  schema.set("versionKey", "vK");
}

export function tossInitSchema(schema: Schema, name: string) {
  schema.plugin(tossInitPlugin, { name });
}

export function tossInitEmbeddedPlugin(schema: Schema) {
  schema.add(EmbeddedSchema);
}

export const BaseSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    required: false,
  },
  deletedBy: {
    type: ObjectId,
    required: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

export const EmbeddedSchema = {
  _id: {
    type: ObjectId,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  embeddedAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  vK: {
    type: Number,
    default: 0,
  },
};
