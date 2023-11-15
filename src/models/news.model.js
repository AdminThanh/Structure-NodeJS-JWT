"use strict";

//create !dmbg
const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "News";
const COLLECTION_NAME = "Newss";

const newsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: { // ID user Post News
      type: String,
      required: true,
    },
    news_url: {
      type: String,
      required: true,
    },
    news_thumb: {
      type: String,
      required: true,
    },
    news_description: {
      type: String,
    },
    news_description_short: {
      type: String,
    },
    news_views: {
      type: Number,
      default: 0,
    },
    news_likes: { // Nâng cấp sau (View tên người like)
      type: Number,
      default: 0,
    },
    news_comments: {
      type: Array,
      default: [],
    },
    news_share: {
      type: Number,
      default: 0,
    },
    news_public: {
      type: Schema.Types.Boolean,
      default: true,
    },
    news_status: {
      type: Number,
      default: true,
    },
    news_categorys: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const comments = new Schema(
  {},
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, newsSchema);
