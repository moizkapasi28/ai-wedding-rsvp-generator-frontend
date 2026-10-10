import assert from "node:assert/strict";
import { test } from "node:test";
import { IMAGE_ACCEPT, imageUploadProblem } from "./imageUpload.ts";

const MB = 1024 * 1024;

test("JPG, PNG and WebP up to 20 MB are accepted", () => {
  assert.equal(imageUploadProblem({ type: "image/jpeg", size: 3 * MB }), null);
  assert.equal(imageUploadProblem({ type: "image/png", size: 20 * MB }), null);
  assert.equal(imageUploadProblem({ type: "image/webp", size: 1 }), null);
});

test("HEIC is rejected, including when the browser reports no type for it", () => {
  assert.match(
    imageUploadProblem({ type: "image/heic", size: MB }) ?? "",
    /JPG, PNG or WebP/,
  );
  assert.match(
    imageUploadProblem({ type: "", size: MB }) ?? "",
    /JPG, PNG or WebP/,
  );
});

test("anything over 20 MB is rejected", () => {
  assert.match(
    imageUploadProblem({ type: "image/jpeg", size: 20 * MB + 1 }) ?? "",
    /20 MB/,
  );
});

test("the file picker offers exactly the accepted types", () => {
  assert.equal(IMAGE_ACCEPT, "image/jpeg,image/png,image/webp");
});
