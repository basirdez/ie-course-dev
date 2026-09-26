<script setup lang="ts">
// بازسازی تایپی صفحهٔ اول پیشنهاد ۱۹۸۹؛ اسکن اصلی در CERN است و لینکش زیر کارت می‌آید.
</script>

<template>
  <figure class="prop">
    <div class="prop-sheet" dir="ltr" role="img" aria-label="صفحهٔ اول پیشنهاد ۱۹۸۹ برنرز-لی با یادداشت دست‌نویس Vague but exciting">
      <div class="prop-note">Vague but exciting …</div>
      <div class="prop-title">Information Management: A Proposal</div>
      <div class="prop-by">Tim Berners-Lee, CERN</div>
      <div class="prop-by">March 1989</div>
      <div class="prop-lines" aria-hidden="true"><i /><i /><i /><i style="width: 70%" /><i /><i style="width: 55%" /></div>
    </div>
    <figcaption>بازسازی صفحهٔ اول؛ <a href="https://cds.cern.ch/record/1405411">اسکن اصلی در CERN</a> و <a href="https://www.w3.org/History/1989/proposal.html">متن کامل</a></figcaption>
  </figure>
</template>

<style scoped>
.prop { margin: 0; }
.prop-sheet { position: relative; width: 100%; max-width: 400px; margin: 18px auto 0; padding: 64px 30px 26px; box-sizing: border-box;
  background: #FFFEF8; color: #202124; border: 1px solid #DADCE0; box-shadow: 0 6px 18px rgba(0,0,0,.12); transform: rotate(-1.2deg);
  font-family: "Times New Roman", Times, serif; text-align: left; }
.prop-note { position: absolute; top: 14px; left: 26px; font: italic 26px/1 "Segoe Script", "Bradley Hand", "Comic Sans MS", cursive; color: #1A4FA3; transform: rotate(-4deg); }
.prop-title { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
.prop-by { font-size: 17px; color: #444; }
.prop-lines { margin-top: 18px; display: grid; gap: 9px; }
.prop-lines i { display: block; height: 7px; width: 100%; background: #E3E3E3; border-radius: 3px; }
.prop figcaption { font-size: 16px; color: var(--muted); margin-top: 12px; text-align: center; }
.prop figcaption a { color: inherit; }
</style>
