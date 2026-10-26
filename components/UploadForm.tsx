"use client";

import Link from "next/link";
import { useActionState } from "react";
import { uploadProject } from "@/app/actions";
import type { UploadState } from "@/lib/projects";

const initial: UploadState = { status: "idle" };

export default function UploadForm() {
  const [state, action, pending] = useActionState(uploadProject, initial);
  const kept = state.status === "error" ? state.values : undefined;

  return (
    <form action={action} className="upload-form">
      <p className="prompt">
        C:\CPC&gt; submit_repo<span className="caret" />
      </p>

      <label className="field">
        <span>github repo</span>
        <input name="repo" type="text" inputMode="url" placeholder="github.com/you/your-project" defaultValue={kept?.repo} required autoComplete="off" />
      </label>
      <label className="field">
        <span>your name</span>
        <input name="author" type="text" placeholder="Jane Kim" defaultValue={kept?.author} required maxLength={60} autoComplete="name" />
      </label>
      {/* Honeypot for bots — hidden from people and screen readers. */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />

      <div className="loadbar" data-on={pending || undefined} aria-hidden>
        <i />
        <i />
        <i />
      </div>

      <button type="submit" className="btn-aqua btn-upload" disabled={pending}>
        {pending ? "Uploading…" : "Upload"}
      </button>

      <p className="status" role="status" aria-live="polite">
        {state.status === "error" && <span className="status-err">! {state.message}</span>}
        {state.status === "ok" && state.repo && (
          <span className="status-ok">
            ✓ {state.repo} is live. <Link href="/showcase">See it on the showcase →</Link>
          </span>
        )}
      </p>
    </form>
  );
}
