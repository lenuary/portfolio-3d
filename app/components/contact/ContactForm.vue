<template>
  <div class="terminal-computer">
    <div class="monitor-top" aria-hidden="true"></div>
    <span class="sticky-note code-note" aria-hidden="true">&lt;/&gt;</span>
    <div class="monitor-case">
      <div class="screen-bezel">
        <form
          class="terminal-form"
          aria-label="Email message"
          aria-describedby="email-draft-hint"
          @input="handleFormInput"
          @submit.prevent="openEmailDraft"
        >
          <div class="terminal-command" aria-hidden="true">
            <span>&gt;</span> new_message.exe
            <span class="command-light"></span>
          </div>

          <label class="terminal-line" for="contact-name">
            <span aria-hidden="true">&gt;</span>
            <span><span class="sr-only">Your </span>name:</span>
            <input
              id="contact-name"
              v-model.trim="senderName"
              name="name"
              type="text"
              autocomplete="name"
              placeholder="...................."
              required
              maxlength="100"
            />
          </label>
          <label class="terminal-line" for="contact-email">
            <span aria-hidden="true">&gt;</span>
            <span><span class="sr-only">Your </span>email:</span>
            <input
              id="contact-email"
              v-model.trim="senderEmail"
              name="email"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="...................."
              required
              maxlength="200"
            />
          </label>
          <div class="message-line">
            <label for="contact-message"> <span aria-hidden="true">&gt;</span> Message: </label>
            <textarea
              id="contact-message"
              v-model.trim="messageBody"
              name="message"
              rows="3"
              placeholder="What would you like to work on?"
              required
              maxlength="3000"
            ></textarea>
          </div>

          <button class="send-message-button" type="submit">
            <NeonIcon name="send" />
            Send Message
          </button>
          <p id="email-draft-hint" class="form-status" role="status">
            {{ emailDraftStatus || "Opens a draft in your email app." }}
          </p>
        </form>
      </div>
      <div class="monitor-controls" aria-hidden="true">
        <span></span><span></span><span></span><i></i>
      </div>
    </div>
    <span class="sticky-note game-note" aria-hidden="true">
      <svg
        viewBox="0 0 36 27"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        focusable="false"
      >
        <path d="M10 5h16c4 0 7 14 6 17-2 4-7-2-10-5h-8C10 21 6 26 4 22 2 17 5 5 10 5Z" />
        <path d="M11 9v8m-4-4h8" />
        <circle cx="24" cy="11" r="1.5" />
        <circle cx="28" cy="15" r="1.5" />
      </svg>
    </span>
    <div class="monitor-stand" aria-hidden="true"><span></span></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NeonIcon from "@/components/ui/NeonIcon.vue";
import { contactData } from "@/data/contactData";

const senderName = ref("");
const senderEmail = ref("");
const messageBody = ref("");
const emailDraftStatus = ref("");

function handleFormInput(event: Event) {
  emailDraftStatus.value = "";
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

  field.setCustomValidity(
    field.value && !field.value.trim() ? "Please enter a value, not just spaces." : "",
  );
}

function openEmailDraft() {
  const subject = encodeURIComponent(`Portfolio message from ${senderName.value}`);
  const body = encodeURIComponent(
    `Name: ${senderName.value}\nEmail: ${senderEmail.value}\n\n${messageBody.value}`,
  );

  window.location.href = `mailto:${contactData.email}?subject=${subject}&body=${body}`;
  emailDraftStatus.value = "Continue in your email app to send your message.";
}
</script>

<style scoped>
.terminal-computer {
  position: relative;
  width: 100%;
  padding-bottom: 14px;
  isolation: isolate;
}

.monitor-top {
  position: absolute;
  top: -12px;
  left: 16px;
  right: 12px;
  height: 23px;
  transform: skewX(-28deg);
  border: 1px solid #af60c94d;
  border-radius: 9px 4px 0 0;
  background: linear-gradient(180deg, #733387, #472250);
  z-index: -1;
}

.monitor-case {
  position: relative;
  display: flex;
  padding: 12px 23px 12px 12px;
  border: 1px solid #ac55ca80;
  border-radius: 17px 12px 12px 17px;
  background: linear-gradient(110deg, #733485, #3e1a4d 7%, #683072 89%, #7a3883 91%, #381a43 100%);
  box-shadow:
    9px 10px 0 #230e2f66,
    0 18px 25px #0004,
    inset 3px 3px 5px #e188ed33;
}

.screen-bezel {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding: 8px;
  border: 2px solid #18091f;
  border-radius: 12px;
  background: #160c1d;
  box-shadow:
    inset 2px 4px 9px #000,
    1px 2px 1px #cb82d344;
}

.terminal-form {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 315px;
  padding: 15px 14px 9px;
  color: #13ee8d;
  border-radius: 6px;
  background:
    radial-gradient(ellipse at 50% 0, #26302633, transparent 75%),
    linear-gradient(120deg, #160e1e, #120c1c);
  font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
  font-size: 11px;
  text-shadow: 0 0 6px #08ec7830;
}

.terminal-form::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.18;
  background: repeating-linear-gradient(0deg, #0005 0 1px, transparent 1px 4px);
  border-radius: inherit;
  box-shadow: inset 0 0 25px #0008;
}

.terminal-command {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 14px;
  margin-bottom: 12px;
  border-bottom: 1px solid #8e4c8b33;
  font-weight: 700;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.command-light {
  width: 5px;
  height: 5px;
  margin-left: auto;
  border-radius: 50%;
  background: #24f499;
  box-shadow: 0 0 8px #24f499;
}

.terminal-line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-block: 7px;
  font-weight: 650;
}

.terminal-line input {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: 3px 0 3px 2px;
  color: #43ffae;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--color-field-border);
  border-radius: 0;
  font: inherit;
  font-weight: 400;
  caret-color: #34ffad;
}

.terminal-line input::placeholder {
  color: #62bd91;
  opacity: 1;
  letter-spacing: 1.5px;
}

.terminal-line input:focus {
  outline: 2px solid #93efc2;
  outline-offset: 2px;
  border-color: #46dc98;
}

.message-line {
  padding-top: 8px;
}

.message-line label {
  display: flex;
  gap: 8px;
  font-weight: 650;
}

.message-line textarea {
  display: block;
  width: 100%;
  min-height: 69px;
  max-height: 150px;
  padding: 9px 0 2px 17px;
  color: #43ffae;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--color-field-border);
  border-radius: 0;
  font: inherit;
  resize: vertical;
  caret-color: #34ffad;
}

.message-line textarea::placeholder {
  color: #62bd91;
  font-size: 10px;
}

.message-line textarea:focus {
  outline: 2px solid #93efc2;
  outline-offset: 2px;
  border-color: #46dc98;
}

.send-message-button {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: auto;
  padding: 10px 6px;
  color: #fff;
  border: 1px solid #f2a0ff55;
  border-radius: 14px;
  background: linear-gradient(180deg, var(--color-action-start), var(--color-action-end));
  box-shadow:
    0 0 19px #bf34ed55,
    inset 0 1px 2px #efb2ff77;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    filter 0.2s;
}

.send-message-button svg {
  width: 16px;
  height: 16px;
}

.send-message-button:hover {
  background: linear-gradient(
    180deg,
    var(--color-action-hover-start),
    var(--color-action-hover-end)
  );
  box-shadow: 0 0 25px #bf34ed88;
}

.send-message-button:focus-visible {
  outline: 2px solid #fac5ff;
  outline-offset: 4px;
}

.form-status {
  position: relative;
  z-index: 3;
  min-height: 19px;
  margin: 9px 0 0;
  color: #d0b4db;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  line-height: 1.5;
  text-align: center;
  text-shadow: none;
}

.monitor-controls {
  position: absolute;
  top: 45%;
  right: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.monitor-controls span {
  width: 5px;
  height: 5px;
  border: 1px solid #af65c074;
  border-radius: 50%;
  box-shadow: inset 1px 1px 2px #0008;
}

.monitor-controls i {
  width: 3px;
  height: 11px;
  border-radius: 2px;
  background: #31133f;
}

.sticky-note {
  position: absolute;
  z-index: 5;
  display: grid;
  place-items: center;
  width: 47px;
  height: 51px;
  color: #792a68;
  background: linear-gradient(130deg, #d37598, #ba557c);
  box-shadow:
    2px 3px 5px #0003,
    inset 1px 1px 1px #ffb3c64d;
}

.sticky-note::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 10px;
  right: 10px;
  height: 5px;
  background: #e892b92b;
}

.code-note {
  top: -17px;
  right: -6px;
  transform: rotate(8deg);
  font-family: ui-monospace, monospace;
  font-size: 23px;
  font-weight: 300;
}

.game-note {
  bottom: 18px;
  right: -9px;
  transform: rotate(-9deg);
  width: 47px;
  height: 46px;
}

.game-note svg {
  width: 34px;
  height: 27px;
}

.monitor-stand {
  position: relative;
  z-index: -1;
  width: 76%;
  height: 16px;
  margin: -1px auto 0;
  border: 1px solid #a35fb82d;
  border-radius: 0 0 4px 4px;
  background: linear-gradient(#35153d, #623170);
  box-shadow: 0 7px 9px #0003;
}

.monitor-stand span {
  display: block;
  height: 2px;
  width: 32%;
  margin: 8px auto;
  background: #8b4d9a66;
}

@media (max-width: 640px) {
  .terminal-form {
    min-height: 300px;
    padding-inline: 12px;
  }

  .monitor-case {
    padding-right: 22px;
  }

  .terminal-line input,
  .message-line textarea {
    font-size: 16px;
  }
}
</style>
