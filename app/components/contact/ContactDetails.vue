<template>
  <div class="contact-copy">
    <header>
      <h1 tabindex="-1">Get in <span>Touch</span></h1>
      <p class="contact-intro">{{ contactData.description }}</p>
    </header>

    <address class="contact-details">
      <a :href="`mailto:${contactData.email}`" class="contact-detail">
        <NeonIcon name="mail" />
        <span>{{ contactData.email }}</span>
      </a>
      <div class="contact-detail">
        <NeonIcon name="pin" />
        <span>{{ contactData.location }}</span>
      </div>
      <div class="contact-detail">
        <span class="availability-light" aria-hidden="true"></span>
        <span>{{ contactData.status }}</span>
      </div>
    </address>

    <nav class="social-links" aria-label="Social profiles">
      <a
        v-for="social in contactData.socials"
        :key="social.name"
        :href="social.url"
        :aria-label="`${social.name} (opens in a new tab)`"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link"
      >
        <NeonIcon :name="social.icon" />
      </a>
    </nav>
    <p class="contact-signoff"><span aria-hidden="true">↳</span> Let's build something together.</p>
  </div>
</template>

<script setup lang="ts">
import NeonIcon from "@/components/ui/NeonIcon.vue";
import { contactData } from "@/data/contactData";
</script>

<style scoped>
.contact-copy {
  position: relative;
  z-index: 2;
  padding: 0 0 12px;
  min-width: 0;
}

.contact-copy h1 {
  margin: 0 0 13px;
  color: #fffaff;
  font-size: clamp(28px, 3.3vw, 42px);
  font-weight: 850;
  line-height: 1.12;
  letter-spacing: -1.4px;
}

.contact-copy h1 span {
  color: var(--color-accent-text);
  text-shadow: 0 0 22px #c53ce838;
}

.contact-intro {
  margin: 0;
  max-width: 310px;
  color: #eee0f1;
  font-size: 12px;
  line-height: 1.85;
}

.contact-details {
  display: grid;
  gap: 20px;
  margin-top: 27px;
  padding-top: 23px;
  border-top: 1px solid #c36fe522;
  font-style: normal;
}

.contact-detail {
  display: flex;
  align-items: center;
  gap: 13px;
  color: #f2e6fa;
  font-size: 12px;
  font-weight: 550;
  text-decoration: none;
}

a.contact-detail:hover {
  color: #edb0ff;
}

.contact-detail svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  color: #dd72ef;
}

.contact-detail > span:last-child {
  min-width: 0;
  overflow-wrap: anywhere;
}

.availability-light {
  width: 11px;
  height: 11px;
  margin-inline: 3px;
  border: 2px solid #22e78c;
  border-radius: 50%;
  box-shadow: 0 0 10px #22e78c55;
}

.availability-light::after {
  content: "";
  display: block;
  width: 3px;
  height: 3px;
  margin: 2px;
  border-radius: 50%;
  background: #22e78c;
}

.social-links {
  display: flex;
  gap: 11px;
  margin-top: 27px;
}

.social-link {
  display: grid;
  place-items: center;
  width: 45px;
  height: 45px;
  color: #fff4ff;
  border: 1px solid #d379f33d;
  border-radius: 9px;
  background: linear-gradient(145deg, #a34cc72c, #58266d15);
  box-shadow:
    inset 0 1px 5px #d177fb13,
    0 4px 12px #0003;
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.social-link svg {
  width: 23px;
  height: 23px;
}

.social-link:hover {
  border-color: #e19bff;
  box-shadow: 0 0 20px #c848f644;
  transform: translateY(-3px);
}

.social-link:focus-visible,
a.contact-detail:focus-visible {
  outline: 2px solid #f1b1ff;
  outline-offset: 5px;
}

.contact-signoff {
  margin: 20px 0 0;
  color: var(--color-text-muted);
  font-family: ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.4px;
}

.contact-signoff span {
  margin-right: 4px;
  color: #df80f5;
}

@media (max-width: 1000px) {
  .contact-copy h1 {
    font-size: 36px;
  }
}

@media (max-width: 760px) {
  .contact-copy {
    padding: 8px 0 0;
  }

  .contact-copy h1 {
    font-size: 32px;
  }

  .contact-intro {
    max-width: 100%;
  }

  .contact-details {
    margin-top: 18px;
    padding-top: 17px;
    gap: 14px;
  }

  .social-links {
    margin-top: 18px;
  }

  .contact-signoff {
    display: none;
  }
}
</style>
